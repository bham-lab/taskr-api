// scripts/migrate.js — run all migrations in order
import { readdir, readFile } from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import { query } from "../config/db.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MIGRATIONS = path.join(__dirname, "../migrations")

const migrate = async () => {
    // Create migrations tracking table if it doesn't exist
    await query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id         SERIAL PRIMARY KEY,
      filename   VARCHAR(255) UNIQUE NOT NULL,
      run_at     TIMESTAMP DEFAULT NOW()
    )
  `)

    const files = (await readdir(MIGRATIONS)).sort()

    for (const file of files) {
        // Check if already run
        const ran = await query(
            "SELECT id FROM migrations WHERE filename = $1",
            [file]
        )

        if (ran.rowCount > 0) {
            console.log(`⏭  Skipped: ${file}`)
            continue
        }

        // Run migration
        const sql = await readFile(path.join(MIGRATIONS, file), "utf-8")
        await query(sql)
        await query(
            "INSERT INTO migrations (filename) VALUES ($1)",
            [file]
        )

        console.log(`✅ Migrated: ${file}`)
    }

    console.log("Migration complete")
    process.exit(0)
}

migrate().catch(err => {
    console.error("Migration failed:", err)
    process.exit(1)
})
