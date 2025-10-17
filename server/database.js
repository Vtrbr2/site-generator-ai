import fs from 'fs';
import path from 'path';

// Caminho do arquivo de banco de dados (JSON local)
const dbPath = path.resolve('./database.json');

// === Função para garantir que o arquivo exista ===
function ensureDatabaseExists() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ projects: [] }, null, 2));
    console.log('🗂️ Novo arquivo database.json criado!');
  }
}

// Inicializa automaticamente ao importar
ensureDatabaseExists();

// === Função para ler o banco ===
function readDatabase() {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Erro ao ler o banco:', error);
    return { projects: [] };
  }
}

// === Função para gravar o banco ===
function writeDatabase(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Erro ao salvar o banco:', error);
  }
}

// === Salvar um projeto (com proteção contra duplicados) ===
export function saveProject(siteType, preferences, code) {
  const db = readDatabase();

  // Garante que o código ou tipo não seja duplicado
  const isDuplicate = db.projects.some(
    (p) =>
      p.site_type === siteType &&
      JSON.stringify(p.preferences) === JSON.stringify(preferences) &&
      p.code === code
  );

  if (isDuplicate) {
    console.log('⚠️ Projeto duplicado detectado — não foi salvo novamente.');
    return null;
  }

  const newProject = {
    id: db.projects.length + 1,
    site_type: siteType,
    preferences,
    code,
    created_at: new Date().toISOString(),
  };

  db.projects.push(newProject);
  writeDatabase(db);

  console.log('✅ Projeto salvo com sucesso:', newProject.id);
  return newProject.id;
}

// === Buscar todos os projetos ===
export function getProjects() {
  const db = readDatabase();
  return db.projects || [];
}

// === Compatibilidade com versões antigas (para evitar erro no Render) ===
export function initDatabase() {
  ensureDatabaseExists();
  console.log('⚙️ initDatabase() chamado — banco JSON já está inicializado.');
  }
