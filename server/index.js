import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSiteCode } from './geminiService.js';
import { initDatabase, saveProject, getProjects } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Inicializar banco
initDatabase();

// Rotas da API
app.post('/api/generate-site', async (req, res) => {
  try {
    const { siteType, preferences } = req.body;
    
    console.log('📦 Gerando site:', siteType);
    console.log('🎨 Preferências:', preferences);

    const code = await generateSiteCode(siteType, preferences);
    
    // Salvar projeto no banco
    const projectId = await saveProject(siteType, preferences, code);
    
    res.json({
      success: true,
      code: code,
      projectId: projectId,
      message: 'Site gerado com sucesso! 🚀'
    });
    
  } catch (error) {
    console.error('❌ Erro ao gerar site:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await getProjects();
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Servir frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Site Generator AI',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🎯 Acesse: http://localhost:${PORT}`);
});
