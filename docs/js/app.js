class SiteGenerator {
    constructor() {
        this.currentSiteType = '';
        this.currentPreferences = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProjects();
    }

    setupEventListeners() {
        // Navegação entre abas
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(link.dataset.tab);
            });
        });

        // Seleção de categoria de site
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectSiteType(card.dataset.type);
            });
        });

        // Botão gerar site
        document.getElementById('generate-btn').addEventListener('click', () => {
            this.generateSite();
        });

        // Botão copiar código
        document.getElementById('copy-code').addEventListener('click', () => {
            this.copyCode();
        });

        // Botão novo projeto
        document.getElementById('new-project').addEventListener('click', () => {
            this.resetGenerator();
        });

        // Botão download código
        document.getElementById('download-code').addEventListener('click', () => {
            this.downloadCode();
        });

        // Botão preview
        document.getElementById('preview-site').addEventListener('click', () => {
            this.previewSite();
        });

        // Templates prontos
        document.querySelectorAll('.use-template').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.useTemplate(btn.dataset.type);
            });
        });
    }

    switchTab(tabName) {
        // Atualizar links de navegação
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Mostrar conteúdo da aba
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Carregar projetos se for a aba de projetos
        if (tabName === 'projects') {
            this.loadProjects();
        }
    }

    selectSiteType(siteType) {
        this.currentSiteType = siteType;
        
        // Atualizar UI
        document.querySelectorAll('.category-card').forEach(card => {
            card.style.borderColor = 'var(--border-color)';
        });
        document.querySelector(`[data-type="${siteType}"]`).style.borderColor = 'var(--primary-color)';

        // Mostrar painel de personalização
        document.getElementById('customization-panel').style.display = 'block';
        document.getElementById('customization-panel').scrollIntoView({ behavior: 'smooth' });

        // Esconder resultados anteriores
        document.getElementById('results-section').style.display = 'none';
    }

    collectPreferences() {
        return {
            colors: {
                primary: document.getElementById('primary-color').value,
                secondary: document.getElementById('secondary-color').value
            },
            font: document.getElementById('font-select').value,
            navbar: document.getElementById('navbar-check').checked,
            whatsapp: document.getElementById('whatsapp-check').checked,
            cart: document.getElementById('cart-check').checked,
            gallery: document.getElementById('gallery-check').checked,
            layout: document.querySelector('input[name="layout"]:checked').value
        };
    }

    async generateSite() {
        if (!this.currentSiteType) {
            this.showNotification('Selecione um tipo de site primeiro!', 'error');
            return;
        }

        const preferences = this.collectPreferences();
        this.currentPreferences = preferences;

        // Mostrar loading
        const generateBtn = document.getElementById('generate-btn');
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando...';
        generateBtn.disabled = true;

        try {
            const response = await fetch('/api/generate-site', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    siteType: this.currentSiteType,
                    preferences: preferences
                })
            });

            const data = await response.json();

            if (data.success) {
                this.showResults(data.code);
                this.showNotification('Site gerado com sucesso! 🚀', 'success');
            } else {
                throw new Error(data.error);
            }

        } catch (error) {
            console.error('Erro:', error);
            this.showNotification('Erro ao gerar site: ' + error.message, 'error');
        } finally {
            generateBtn.innerHTML = '<i class="fas fa-magic"></i> Gerar Site com IA';
            generateBtn.disabled = false;
        }
    }

    showResults(code) {
        document.getElementById('code-output').value = code;
        document.getElementById('results-section').style.display = 'block';
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
    }

    copyCode() {
        const codeOutput = document.getElementById('code-output');
        codeOutput.select();
        document.execCommand('copy');
        this.showNotification('Código copiado! 📋', 'success');
    }

    downloadCode() {
        const code = document.getElementById('code-output').value;
        const blob = new Blob([code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `site-${this.currentSiteType}-${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showNotification('Código baixado! 💾', 'success');
    }

    previewSite() {
        const code = document.getElementById('code-output').value;
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write(code);
        previewWindow.document.close();
    }

    resetGenerator() {
        this.currentSiteType = '';
        this.currentPreferences = {};
        
        // Reset UI
        document.querySelectorAll('.category-card').forEach(card => {
            card.style.borderColor = 'var(--border-color)';
        });
        
        document.getElementById('customization-panel').style.display = 'none';
        document.getElementById('results-section').style.display = 'none';
        
        // Scroll para topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        this.showNotification('Pronto para um novo projeto! 🎨', 'success');
    }

    useTemplate(templateType) {
        this.selectSiteType(templateType);
        this.switchTab('home');
        
        // Configurar preferências padrão para o template
        setTimeout(() => {
            document.getElementById('navbar-check').checked = true;
            document.getElementById('whatsapp-check').checked = true;
            document.getElementById('gallery-check').checked = true;
            
            if (templateType === 'loja-roupas') {
                document.getElementById('cart-check').checked = true;
            }
            
            this.showNotification(`Template ${templateType} carregado! ✨`, 'success');
        }, 500);
    }

    async loadProjects() {
        try {
            const response = await fetch('/api/projects');
            const data = await response.json();
            
            if (data.success) {
                this.displayProjects(data.projects);
            }
        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
        }
    }

    displayProjects(projects) {
        const container = document.getElementById('projects-list');
        
        if (projects.length === 0) {
            container.innerHTML = `
                <div class="no-projects">
                    <i class="fas fa-folder-open"></i>
                    <h3>Nenhum projeto ainda</h3>
                    <p>Crie seu primeiro site usando o gerador!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = projects.map(project => `
            <div class="project-card">
                <h3>${this.formatSiteType(project.site_type)}</h3>
                <p>Criado em: ${new Date(project.created_at).toLocaleDateString('pt-BR')}</p>
                <div class="project-actions">
                    <button onclick="siteGenerator.viewProject(${project.id})" class="action-btn small">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                </div>
            </div>
        `).join('');
    }

    formatSiteType(type) {
        const types = {
            'restaurante': 'Site de Restaurante',
            'loja-roupas': 'Loja de Roupas',
            'portfolio': 'Portfólio Pessoal',
            'consultorio': 'Consultório Médico',
            'academia': 'Academia'
        };
        return types[type] || type;
    }

    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#5865F2'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Inicializar quando DOM estiver pronto
const siteGenerator = new SiteGenerator();

// Adicionar animação CSS para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .no-projects {
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
    }
    
    .no-projects i {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }
    
    .project-actions {
        margin-top: 1rem;
    }
    
    .action-btn.small {
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
    }
`;
document.head.appendChild(style);
