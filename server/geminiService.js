import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

// Prompts específicos para cada tipo de site
const sitePrompts = {
  'restaurante': `
    Crie um site HTML, CSS e JavaScript completo para um RESTAURANTE com as seguintes características:
    
    CARACTERÍSTICAS DO SITE:
    - Design moderno e responsivo
    - Cores principais: {colors}
    - Fonte: {font}
    - {navbar}
    - {whatsapp}
    - Seção hero com imagem apetitosa
    - Cardápio organizado por categorias
    - Galeria de fotos dos pratos
    - Seção sobre o restaurante
    - Formulário de reserva
    - Rodapé com informações de contato
    - Totalmente responsivo para mobile
    
    INSTRUÇÕES TÉCNICAS:
    - Use HTML5 semântico
    - CSS moderno com Flexbox/Grid
    - JavaScript para interatividade
    - Botão do WhatsApp funcional
    - Formulário com validação
    - Imagens placeholder com alt text
    - Código bem comentado e organizado
    
    Retorne APENAS o código HTML, CSS e JS em um único arquivo, sem explicações adicionais.
  `,

  'loja-roupas': `
    Crie um site HTML, CSS e JavaScript completo para uma LOJA DE ROUPAS E SAPATOS com:
    
    CARACTERÍSTICAS:
    - Design elegante e moderno
    - Cores: {colors}
    - Fonte: {font}
    - {navbar}
    - {whatsapp}
    - {cart}
    - Catálogo de produtos com filtros
    - Carrinho de compras funcional
    - Páginas de produto individuais
    - Seção de promoções
    - Blog de moda (opcional)
    - Newsletter
    
    FUNCIONALIDADES:
    - Filtros por categoria, tamanho, cor
    - Carrinho com localStorage
    - Calculo de total e frete
    - Galeria de produtos
    - Design totalmente responsivo
    
    INSTRUÇÕES:
    - HTML5 semântico
    - CSS com variáveis
    - JavaScript ES6+
    - LocalStorage para carrinho
    - Código limpo e organizado
  `,

  'portfolio': `
    Crie um site HTML, CSS e JavaScript completo para um PORTFÓLIO PESSOAL com:
    
    CARACTERÍSTICAS:
    - Design clean e profissional
    - Cores: {colors}
    - Fonte: {font}
    - {navbar}
    - Galeria de projetos
    - Seção sobre mim
    - Habilidades técnicas
    - Formulário de contato
    - Links para redes sociais
    - Modo dark/light (opcional)
    
    SEÇÕES OBRIGATÓRIAS:
    - Hero com apresentação
    - Sobre mim com foto
    - Projetos com filtros
    - Habilidades em barras
    - Experiência profissional
    - Contato com formulário
    
    TECNOLOGIAS:
    - HTML5 semântico
    - CSS3 moderno
    - JavaScript vanilla
    - Animações suaves
    - Design responsivo
  `,

  'consultorio': `
    Crie um site HTML, CSS e JavaScript completo para um CONSULTÓRIO MÉDICO com:
    
    CARACTERÍSTICAS:
    - Design profissional e clean
    - Cores: {colors} 
    - Fonte: {font}
    - {navbar}
    - {whatsapp}
    - Agenda online
    - Especialidades médicas
    - Corpo clínico
    - Formulário de agendamento
    - Localização e contatos
    
    FUNCIONALIDADES:
    - Design que passe confiança
    - Informações das especialidades
    - Perfis dos médicos
    - Formulário de contato
    - Botão WhatsApp para emergências
    - Totalmente responsivo
  `,

  'academia': `
    Crie um site HTML, CSS e JavaScript completo para uma ACADEMIA com:
    
    CARACTERÍSTICAS:
    - Design energético e moderno
    - Cores: {colors}
    - Fonte: {font}
    - {navbar}
    - {whatsapp}
    - Modalidades oferecidas
    - Planos de assinatura
    - Galeria de fotos
    - Formulário de matrícula
    - Horários de funcionamento
    
    FUNCIONALIDADES:
    - Cards de modalidades
    - Tabela de preços
    - Galeria de equipamentos
    - Localização
    - Formulário lead
    - Design motivacional
  `
};

export async function generateSiteCode(siteType, preferences) {
  try {
    let promptTemplate = sitePrompts[siteType];
    
    if (!promptTemplate) {
      throw new Error(`Tipo de site não suportado: ${siteType}`);
    }

    // Substituir placeholders pelas preferências
    promptTemplate = promptTemplate
      .replace('{colors}', preferences.colors || 'azul e roxo')
      .replace('{font}', preferences.font || 'Poppins')
      .replace('{navbar}', preferences.navbar ? 'Navbar fixa no topo' : 'Sem navbar')
      .replace('{whatsapp}', preferences.whatsapp ? 'Botão do WhatsApp flutuante' : 'Sem WhatsApp')
      .replace('{cart}', preferences.cart ? 'Carrinho de compras funcional' : 'Sem carrinho');

    const requestBody = {
      contents: [{
        parts: [{
          text: promptTemplate
        }]
      }]
    };

    const response = await axios.post(GEMINI_URL, requestBody, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });

    return response.data.candidates[0].content.parts[0].text;
    
  } catch (error) {
    console.error('❌ Erro Gemini:', error.response?.data || error.message);
    throw new Error('Falha ao gerar código com IA. Tente novamente.');
  }
               }
