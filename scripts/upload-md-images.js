#!/usr/bin/env node
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import fse from "fs-extra";
import path from "path";
import mime from "mime-types";
import sharp from "sharp";
import hash from "hash-sum";
import pLimit from "p-limit";
import "dotenv/config";

const {
    R2_ACCOUNT_ID,
    R2_BUCKET,
    R2_ACCESS_KEY,
    R2_SECRET_KEY,
    R2_DOMAIN,
    MAX_CONCURRENT = 5,
} = process.env;

if (!R2_ACCOUNT_ID || !R2_BUCKET || !R2_ACCESS_KEY || !R2_SECRET_KEY || !R2_DOMAIN) {
    console.error("❌ Missing R2 env config");
    process.exit(1);
}

// 併發限制
const limit = pLimit(Number(MAX_CONCURRENT));

// 緩存初始化
const CACHE_FILE = ".mdimgup-cache.json";
let cache = fse.existsSync(CACHE_FILE) ? fse.readJsonSync(CACHE_FILE) : {};
const saveCache = () => fse.writeJsonSync(CACHE_FILE, cache, { spaces: 2 });

// R2 Client
const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY,
        secretAccessKey: R2_SECRET_KEY,
    },
});

// 上傳圖片（含緩存 + 壓縮 + gif 跳過）
async function uploadImage(filePath) {
    const fileHash = hash(fs.readFileSync(filePath));
    if (cache[fileHash]) {
        console.log(`♻ Cache hit: ${filePath}`);
        return cache[fileHash];
    }

    const ext = path.extname(filePath).toLowerCase();
    const isGif = ext === ".gif";
    let buffer;

    if (isGif) {
        buffer = fs.readFileSync(filePath);
        console.log("  └─ GIF skip compress");
    } else {
        const img = sharp(filePath);
        const meta = await img.metadata();
        img.resize({ width: meta.width > 1280 ? 1280 : meta.width });

        if (meta.format === "png") img.png({ quality: 80, compressionLevel: 8 });
        else if (meta.format === "webp") img.webp({ quality: 80 });
        else img.jpeg({ quality: 80 });

        buffer = await img.toBuffer();
        console.log("  └─ compressed → max 1280w");
    }

    const filename = Date.now() + "-" + path.basename(filePath);
    const key = `blog/${new Date().getFullYear()}/${filename}`;
    const type = mime.lookup(filePath) || "application/octet-stream";

    await s3.send(
        new PutObjectCommand({
            Bucket: R2_BUCKET,
            Key: key,
            Body: buffer,
            ContentType: type,
        })
    );

    const url = `${R2_DOMAIN}/${key}`;
    cache[fileHash] = url;
    saveCache();
    return url;
}

// 處理單個 md
async function processMarkdown(mdPath) {
    let content = fs.readFileSync(mdPath, "utf-8");
    const dir = path.dirname(mdPath);
    const imgReg = /!\[.*?\]\((.*?)\)/g;
    const tasks = [];

    for (const m of content.matchAll(imgReg)) {
        const raw = m[1];
        if (/^https?:\/\//.test(raw)) continue;

        const decoded = decodeURIComponent(raw);
        const full = path.isAbsolute(decoded) ? decoded : path.join(dir, decoded);

        if (!fse.existsSync(full)) {
            console.warn(`⚠ Not found: ${full}`);
            continue;
        }

        tasks.push(
            limit(() =>
                uploadImage(full).then(url => {
                    content = content.replace(raw, url);
                    console.log(`✅ ${url}`);
                })
            )
        );
    }

    await Promise.all(tasks);
    fs.writeFileSync(mdPath, content, "utf-8");
    console.log(`✔ Finished: ${mdPath}\n`);
}

// 取得所有 md
function collectFiles(targets) {
    const result = [];
    for (const t of targets) {
        const stat = fse.statSync(t);
        if (stat.isFile() && t.endsWith(".md")) result.push(t);
        if (stat.isDirectory()) {
            const files = fse.readdirSync(t, { withFileTypes: true });
            for (const f of files) {
                const sub = path.join(t, f.name);
                if (f.isDirectory()) result.push(...collectFiles([sub]));
                if (f.isFile() && sub.endsWith(".md")) result.push(sub);
            }
        }
    }
    return result;
}

// 入口
const args = process.argv.slice(2);
if (!args.length) {
    console.log("Usage: mdimgup <file.md | folder>");
    process.exit(1);
}

const mdFiles = collectFiles(args);
console.log(`📁 Found ${mdFiles.length} markdown files\n`);

for (const md of mdFiles) {
    await processMarkdown(md);
}

console.log("🎉 All done!");
