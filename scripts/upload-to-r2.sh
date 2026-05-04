#!/bin/bash
# save as: ~/bin/upload-to-r2.sh
# Handles both single and multiple image uploads with automatic compression

# Configuration
BUCKET_NAME="my-blog"
ACCOUNT_ID="50135d4bf04b0a072b0226e5d526f0d7"
ENDPOINT_URL="https://${ACCOUNT_ID}.r2.cloudflarestorage.com"
CDN_DOMAIN="images.leonwong282.com"

# Compression settings
JPEG_QUALITY=70        # 1-100, recommended: 80-90
PNG_QUALITY=70         # 1-100, recommended: 85-95
MAX_WIDTH=1280         # Maximum width in pixels
MAX_HEIGHT=1280        # Maximum height in pixels
CONVERT_TO_WEBP=false  # Set to true to convert all images to WebP

# Function to compress and upload a single image
upload_image() {
    local IMAGE_PATH="$1"
    
    # Check if file exists
    if [ ! -f "$IMAGE_PATH" ]; then
        echo "Error: File not found: $IMAGE_PATH" >&2
        return 1
    fi
    
    # Generate timestamp and get file extension
    local TIMESTAMP=$(date +%s)
    local RANDOM_SUFFIX=$RANDOM
    local EXTENSION="${IMAGE_PATH##*.}"
    local LOWERCASE_EXT=$(echo "$EXTENSION" | tr '[:upper:]' '[:lower:]')
    
    # Create temp directory if it doesn't exist
    local TEMP_DIR="/tmp/typora-upload-$$"
    mkdir -p "$TEMP_DIR"
    
    # Determine output format
    local OUTPUT_EXT="$LOWERCASE_EXT"
    if [ "$CONVERT_TO_WEBP" = true ]; then
        OUTPUT_EXT="webp"
    fi
    
    # Temporary compressed file path
    local TEMP_FILE="${TEMP_DIR}/${TIMESTAMP}-${RANDOM_SUFFIX}.${OUTPUT_EXT}"
    
    # Compress image using ImageMagick
    if [[ "$LOWERCASE_EXT" =~ ^(jpg|jpeg)$ ]]; then
        # JPEG compression
        convert "$IMAGE_PATH" \
            -resize "${MAX_WIDTH}x${MAX_HEIGHT}>" \
            -quality "$JPEG_QUALITY" \
            -strip \
            "$TEMP_FILE" 2>/dev/null
    elif [[ "$LOWERCASE_EXT" == "png" ]]; then
        # PNG compression
        convert "$IMAGE_PATH" \
            -resize "${MAX_WIDTH}x${MAX_HEIGHT}>" \
            -quality "$PNG_QUALITY" \
            -strip \
            "$TEMP_FILE" 2>/dev/null
    elif [[ "$LOWERCASE_EXT" =~ ^(gif|webp|bmp)$ ]]; then
        # Other formats - basic optimization
        convert "$IMAGE_PATH" \
            -resize "${MAX_WIDTH}x${MAX_HEIGHT}>" \
            -strip \
            "$TEMP_FILE" 2>/dev/null
    else
        # Unsupported format - copy as-is
        cp "$IMAGE_PATH" "$TEMP_FILE"
    fi
    
    # Check if compression succeeded
    if [ ! -f "$TEMP_FILE" ]; then
        echo "Error: Failed to compress $(basename "$IMAGE_PATH")" >&2
        rm -rf "$TEMP_DIR"
        return 1
    fi
    
    # Show compression stats
    local ORIGINAL_SIZE=$(stat -f%z "$IMAGE_PATH" 2>/dev/null || stat -c%s "$IMAGE_PATH")
    local COMPRESSED_SIZE=$(stat -f%z "$TEMP_FILE" 2>/dev/null || stat -c%s "$TEMP_FILE")
    local SAVINGS=$((100 - (COMPRESSED_SIZE * 100 / ORIGINAL_SIZE)))
    
    # Only use compressed version if it's smaller
    local UPLOAD_FILE="$TEMP_FILE"
    if [ "$COMPRESSED_SIZE" -gt "$ORIGINAL_SIZE" ]; then
        echo "Warning: Compressed file larger, using original" >&2
        cp "$IMAGE_PATH" "$TEMP_FILE"
    fi
    
    # Generate remote path
    local FILENAME="${TIMESTAMP}-${RANDOM_SUFFIX}.${OUTPUT_EXT}"
    local REMOTE_PATH="blog/$(date +%Y/%m)/${FILENAME}"
    
    # Get MIME type
    local MIME_TYPE=$(file -b --mime-type "$TEMP_FILE" 2>/dev/null || echo "image/jpeg")
    
    # Upload to R2 using AWS CLI
    if aws s3 cp "$TEMP_FILE" "s3://${BUCKET_NAME}/${REMOTE_PATH}" \
      --profile r2 \
      --endpoint-url="$ENDPOINT_URL" \
      --content-type="$MIME_TYPE" \
      --cache-control="public, max-age=31536000" \
      >/dev/null 2>&1; then
      # Success - output the URL
      echo "https://${CDN_DOMAIN}/${REMOTE_PATH}"
      
      # Log compression stats to stderr (won't interfere with Typora)
      if [ "$SAVINGS" -gt 0 ]; then
          echo "Compressed: $(basename "$IMAGE_PATH") → ${SAVINGS}% smaller" >&2
      fi
      
      # Cleanup temp file
      rm -rf "$TEMP_DIR"
      return 0
    else
      # Failure
      echo "Error: Failed to upload $(basename "$IMAGE_PATH")" >&2
      rm -rf "$TEMP_DIR"
      return 1
    fi
}

# Main script: Loop through all arguments (all image paths)
for IMAGE_PATH in "$@"; do
    upload_image "$IMAGE_PATH"
done
