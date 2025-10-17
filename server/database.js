import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Corrige caminhos (Render precisa disso)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho da pasta e do "banco"
const dataDir = path.join(__dirname, '../data');
const dbFile = path.join(dataDir, 'projects.json');

// Garante que a pasta e o arquivo existam
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify([]));
}

// === Funções principais ===
export function saveProject(siteType, preferences, code) {
  try {
    const projects = getProjects();
    const newProject = {
      id: projects.length + 1,
      site_type: siteType,
      preferences,
      code,
      created_at: new Date().toISOString()
    };

    projects.push(newProject);
    fs.writeFileSync(dbFile, JSON.stringify(projects, null, 2));

    console.log('✅ Projeto salvo:', newProject.id);
    return newProject.id;
  } catch (error) {
    console.error('❌ Erro ao salvar projeto:', error);
    return null;
  }
}

export function getProjects() {
  try {
    const data = fs.readFileSync(dbFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Erro ao ler projetos:', error);
    return [];
  }
}
