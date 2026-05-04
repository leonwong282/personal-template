#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// 取得 MD 檔案路徑
const mdFile = process.argv[2];
if (!mdFile) {
    console.error("❌ Usage: node upload-md-images.js <markdown-file>");
    process.exit(1);
}

// 讀取 Markdown
let content = fs.readFileSync(mdFile, "utf-8");

// 取得所有圖片路徑
const regex = /!\[.*?\]\((.*?)\)/g;
let matches = [...content.matchAll(regex)];

if (matches.length === 0) {
    console.log("✅ No images found, done.");
    process.exit(0);
}

console.log(`🔍 Found ${matches.length} images...`);

// Markdown 所在目錄（用來解析相對路徑）
const mdDir = path.dirname(mdFile);

// 逐張處理圖片
let success = 0;
let fail = 0;

for (const match of matches) {
    let imgPath = match[1];

    // 1. URL decode（處理中文被編碼情況）
    imgPath = decodeURIComponent(imgPath);

    // 2. 解析成相對 MD 的真實路徑
    const imgFullPath = path.join(mdDir, imgPath);

    // 3. 檢查是否存在
    if (!fs.existsSync(imgFullPath)) {
        console.error(`❌ File not found: ${imgFullPath}`);
        fail++;
        continue;
    }

    console.log(`⬆ Uploading: ${imgFullPath}`);

    try {
        // 4. 執行你的上傳腳本
        const uploadedUrl = execSync(`~/bin/upload-to-r2.sh "${imgFullPath}"`)
            .toString()
            .trim();

        if (!uploadedUrl.startsWith("http")) {
            throw new Error("Invalid upload response: " + uploadedUrl);
        }

        console.log(`✅ Uploaded: ${uploadedUrl}`);

        // 5. 替換 MD 內容
        content = content.replace(match[1], uploadedUrl);
        success++;
    } catch (err) {
        console.error(`❌ Upload failed:`, err.message);
        fail++;
    }
}

// 6. 寫回 Markdown
fs.writeFileSync(mdFile, content, "utf-8");

// 7. 結果總結
console.log("\n🎯 Done!");
console.log(`✅ Success: ${success}`);
console.log(`❌ Failed : ${fail}`);
