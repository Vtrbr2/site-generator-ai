import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

export async function initDatabase() {
  try {
    db = await open({
      filename: path.join(__dirname, '../data/projects.db'),
      driver: sqlite3.Database
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        site_type TEXT NOT NULL,
        preferences TEXT NOT NULL,
        code TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Banco de dados inicializado');
  } catch (error) {
    console.error('❌ Erro no banco:', error);
  }
}

export async function saveProject(siteType, preferences, code) {
  try {
    const result = await db.run(
      'INSERT INTO projects (site_type, preferences, code) VALUES (?, ?, ?)',
      [siteType, JSON.stringify(preferences), code]
    );
    return result.lastID;
  } catch (error) {
    console.error('❌ Erro ao salvar projeto:', error);
    return null;
  }
}

export async function getProjects() {
  try {
    return await db.all('SELECT * FROM projects ORDER BY created_at DESC');
  } catch (error) {
    console.error('❌ Erro ao buscar projetos:', error);
    return [];
  }
}
