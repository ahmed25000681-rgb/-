import fs from "fs";
import path from "path";
import { LIBRARY } from "../src/data/articles.js";

const outputDir = path.join(process.cwd(), "public", "articles");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log("⚡ Extracting academic content to /public/articles...");

Object.entries(LIBRARY).forEach(([id, article]) => {
  const filePath = path.join(outputDir, `${id}.md`);
  fs.writeFileSync(filePath, article.content);
  console.log(`✅ Extracted: ${id}`);
});

console.log("🚀 Extraction complete. Clean up src/data/articles.ts manually to finalize.");
