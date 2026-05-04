import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import fse from "fs-extra";
import path from "path";
import mime from "mime-types";
import sharp from "sharp";
import 'dotenv/config';

const {
    R2_ACCOUNT_ID,
    R2_BUCKET,
    R2_ACCESS_KEY,
    R2_SECRET_KEY,
    R2_DOMAIN,
} = process.env;

if (!R2_ENDPOINT || !R2_BUCKET || !R2_ACCESS_KEY || !R2_SECRET_KEY || !R2_PUBLIC_URL) {
    console.error("❌ Missing R2 env config, check .env file!");
    process.exit(1);
}

// =================================

// 初始化 S3 Client (R2 兼容)
const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY,
        secretAccessKey: R2_SECRET_KEY,
    },
});

// 圖片處理 + 上傳
async function uploadImage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    let fileBuffer;
    const isGif = ext === ".gif";

    if (isGif) {
        // ✅ GIF 直接讀取，不壓縮
        fileBuffer = fs.readFileSync(filePath);
        console.log("  └─ GIF detected: skip compression");
    } else {
        // ✅ 其他圖片壓縮 + 限制寬度 1280，保持原格式
        const image = sharp(filePath);
        const metadata = await image.metadata();

        image.resize({
            width: metadata.width > 1280 ? 1280 : metadata.width,
        });

        // 依原格式輸出
        if (metadata.format === "png") {
            image.png({ quality: 80, compressionLevel: 8 });
        } else if (metadata.format === "webp") {
            image.webp({ quality: 80 });
        } else {
            image.jpeg({ quality: 80 });
        }

        fileBuffer = await image.toBuffer();
        console.log("  └─ Image compressed & resized max 1280w");
    }

    const fileName = Date.now() + "-" + path.basename(filePath);
    const uploadKey = `blog/2025/11/${fileName}`;

    const contentType = mime.lookup(filePath) || "application/octet-stream";

    await s3.send(
        new PutObjectCommand({
            Bucket: R2_BUCKET,
            Key: uploadKey,
            Body: fileBuffer,
            ContentType: contentType,
        })
    );

    return `${R2_DOMAIN}/${uploadKey}`;
}

// 解析 Markdown & replace 圖片
async function processMarkdown(mdFilePath) {
    const mdDir = path.dirname(mdFilePath);
    let content = fs.readFileSync(mdFilePath, "utf-8");

    const imgRegex = /!\[.*?\]\((.*?)\)/g;
    const matches = [...content.matchAll(imgRegex)];

    console.log(`🔍 Found ${matches.length} images...`);

    let success = 0, fail = 0;

    for (const match of matches) {
        const rawUrl = match[1];

        // ✅ 跳過網路圖片
        if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
            console.log(`⏭ Skip network image: ${rawUrl}`);
            continue;
        }

        // ✅ decode 路徑避免中文錯誤
        const decodedUrl = decodeURIComponent(rawUrl);
        const imgFullPath = path.isAbsolute(decodedUrl)
            ? decodedUrl
            : path.join(mdDir, decodedUrl);

        if (!fse.existsSync(imgFullPath)) {
            console.log(`❌ File not found: ${imgFullPath}`);
            fail++;
            continue;
        }

        console.log(`⬆ Uploading: ${imgFullPath}`);

        try {
            const remoteUrl = await uploadImage(imgFullPath);
            content = content.replace(rawUrl, remoteUrl);
            console.log(`✅ Uploaded: ${remoteUrl}`);
            success++;
        } catch (err) {
            console.log(`❌ Upload failed: ${err.message}`);
            fail++;
        }
    }

    fs.writeFileSync(mdFilePath, content, "utf-8");

    console.log("\n🎯 Done!");
    console.log(`✅ Success: ${success}`);
    console.log(`❌ Failed : ${fail}`);
}

// CLI 入口
const mdFile = process.argv[2];
if (!mdFile) {
    console.log("Usage: node upload-md-images.js <markdown-file>");
    process.exit(1);
}

processMarkdown(mdFile);
