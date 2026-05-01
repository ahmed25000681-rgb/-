import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(process.cwd(), "firebase-applet-config.json");

if (!fs.existsSync(configPath)) {
  console.error("❌ Error: firebase-applet-config.json not found. Run set_up_firebase first.");
  process.exit(1);
}

const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));

// Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Import Library dynamically since it's a TS file and we are running via tsx
async function seed() {
  console.log("🚀 Starting Articles Migration to Firestore...");
  
  // We'll import the data from the library
  // Note: We are using a relative path from the root since tsx is run from there
  const { LIBRARY } = await import("../src/data/articles.js").catch(async () => {
      // Fallback for different environments
      return await import("../src/data/articles.ts");
  });

  const entries = Object.entries(LIBRARY);
  console.log(`📦 Found ${entries.length} articles to migrate.`);

  for (const [id, article] of entries) {
    try {
      console.log(`➡️ Migrating: ${id} - ${article.title}`);
      await setDoc(doc(db, "articles", id), {
        ...article,
        id,
        createdAt: new Date().toISOString(),
        type: article.level === 3 ? "research" : "lesson"
      });
    } catch (error) {
      console.error(`❌ Failed to migrate ${id}:`, error);
    }
  }

  console.log("✅ Migration complete. The Vault is now hosted on the cloud.");
  process.exit(0);
}

seed();
