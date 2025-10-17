import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../data/projects.db');
const db = new Database(dbPath);

// Cria tabela se não existir
db.prepare(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_type TEXT NOT NULL,
    preferences TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

console.log('✅ Banco de dados inicializado com sucesso');

export function saveProject(siteType, preferences, code) {
  try {
    const stmt = db.prepare('INSERT INTO projects (site_type, preferences, code) VALUES (?, ?, ?)');
    const result = stmt.run(siteType, JSON.stringify(preferences), code);
    return result.lastInsertRowid;
  } catch (error) {
    console.error('❌ Erro ao salvar projeto:', error);
    return null;
  }
}

export function getProjects() {
  try {
    const rows = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
    return rows;
  } catch (error) {
    console.error('❌ Erro ao buscar projetos:', error);
    return [];
  }
}
