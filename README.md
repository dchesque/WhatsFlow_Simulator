# 🚀 WhatsFlow Simulator

[![Deploy](https://img.shields.io/badge/Deploy-EasyPanel-blue.svg)](https://easypanel.io)
[![Docker](https://img.shields.io/badge/Docker-Ready-green.svg)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**O simulador definitivo para testar fluxos de WhatsApp com N8N antes de ir para produção!**

WhatsFlow Simulator é uma aplicação web que simula perfeitamente a interface do WhatsApp, permitindo que desenvolvedores testem completamente suas integrações de IA e automações via webhook com N8N antes de conectar à API oficial do WhatsApp.

## ✨ Características

- 📱 **Interface WhatsApp Autêntica** - UI/UX idêntica ao WhatsApp Web
- 🔗 **Integração N8N Completa** - Webhook bidirecional para testes reais
- 🤖 **Ideal para IA Agents** - Teste chatbots e assistentes virtuais
- ⚡ **Tempo Real** - Respostas instantâneas via webhook
- 🎨 **Dark/Light Mode** - Suporte completo a temas
- 📊 **Logs de Debug** - Monitore todas as interações
- 🔧 **Fácil Configuração** - Setup em minutos
- 🐳 **Docker Ready** - Deploy instantâneo em qualquer VPS

## 🎯 Por que usar o WhatsFlow Simulator?

### Antes (Problemas)
- ❌ Testar direto na API do WhatsApp é caro e arriscado
- ❌ Debugging complexo com limitações de rate limit
- ❌ Dificuldade para testar fluxos conversacionais
- ❌ Impossível simular cenários específicos

### Depois (Soluções)
- ✅ Teste ilimitado sem custos ou limitações
- ✅ Debug completo com logs detalhados
- ✅ Simule qualquer cenário de conversa
- ✅ Valide todo o fluxo antes da produção
- ✅ Desenvolvimento ágil e seguro

## 🚀 Quick Start

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/whatsflow-simulator.git
cd whatsflow-simulator
```

### 2. Executar Localmente
```bash
npm install
npm run dev
```

### 3. Deploy com Docker (Recomendado)
```bash
docker build -t whatsflow-simulator .
docker run -p 80:80 whatsflow-simulator
```

### 4. Deploy no EasyPanel
1. Conecte seu repositório Git no EasyPanel
2. O sistema detectará automaticamente o Dockerfile
3. Configure a porta 80
4. Deploy automático! 🎉

## ⚙️ Configuração N8N

### 1. Webhook de Entrada (N8N → WhatsFlow)
```javascript
// URL do webhook no N8N
POST https://seu-n8n.com/webhook/whatsapp-in

// Payload esperado
{
  "message": "Mensagem do usuário",
  "from": "usuario123",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

### 2. Webhook de Saída (WhatsFlow → N8N)
Configure na interface do WhatsFlow:
- **Webhook URL**: `https://seu-n8n.com/webhook/whatsapp-out`
- **Método**: POST
- **Timeout**: 30s

### 3. Exemplo de Fluxo N8N
```json
{
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "whatsapp-in"
      }
    },
    {
      "name": "Processar Mensagem",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Seu código de IA aqui\nreturn [{ json: { response: 'Olá! Como posso ajudar?' } }];"
      }
    },
    {
      "name": "Enviar Resposta",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://whatsflow-simulator.com/webhook",
        "method": "POST"
      }
    }
  ]
}
```

## 🔧 Configurações Avançadas

### Variáveis de Ambiente (Opcional)
```env
VITE_DEFAULT_WEBHOOK_URL=https://seu-n8n.com/webhook/whatsapp-out
VITE_APP_TITLE=WhatsFlow Simulator
VITE_DEBUG_MODE=true
```

### Headers Personalizados
```javascript
// Configure headers customizados no webhook
{
  "Authorization": "Bearer seu-token",
  "Content-Type": "application/json",
  "X-Custom-Header": "valor"
}
```

## 🛠️ Stack Tecnológica

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Tailwind CSS + Shadcn/ui
- **Routing**: React Router Dom
- **State**: React Query + Context
- **Build**: Vite
- **Container**: Docker + Nginx
- **Deploy**: EasyPanel, Vercel, Netlify

## 📱 Capturas de Tela

### Interface Principal
![WhatsFlow Interface](docs/screenshot-main.png)

### Configuração de Webhook
![Webhook Config](docs/screenshot-config.png)

### Logs de Debug
![Debug Logs](docs/screenshot-debug.png)

## 🔄 Workflow de Desenvolvimento

### 1. Desenvolvimento Local
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Verificar código
```

### 2. Testes de Integração
- Configure seu N8N de desenvolvimento
- Teste diferentes cenários de conversa
- Valide todos os webhooks
- Debug com logs detalhados

### 3. Deploy para Produção
- Build da aplicação
- Deploy via Docker
- Conectar N8N de produção
- Monitorar métricas

## 🎨 Personalização

### Temas Customizados
```css
/* Adicione em src/styles/custom.css */
:root {
  --whatsapp-green: #25D366;
  --whatsapp-dark: #1f1f1f;
  /* Suas cores personalizadas */
}
```

### Componentes Personalizados
```typescript
// src/components/CustomMessage.tsx
export const CustomMessage = ({ content, type }) => {
  // Seu componente personalizado
};
```

## 📊 Casos de Uso

### 🤖 Chatbots de IA
- Teste assistentes virtuais
- Valide fluxos conversacionais
- Debug respostas de IA

### 📈 E-commerce
- Automação de vendas
- Suporte ao cliente
- Notificações de pedidos

### 🏥 Healthcare
- Agendamento de consultas
- Lembretes de medicação
- Triagem inicial

### 📚 Educação
- Tutores virtuais
- Notificações de aula
- Suporte acadêmico

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- 📧 **Email**: suporte@whatsflow.com
- 💬 **Discord**: [WhatsFlow Community](https://discord.gg/whatsflow)
- 📖 **Docs**: [docs.whatsflow.com](https://docs.whatsflow.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/seu-usuario/whatsflow-simulator/issues)

## 🌟 Roadmap

- [ ] Suporte a mensagens de mídia (imagens, videos)
- [ ] Grupos de conversa simulados
- [ ] Métricas e analytics integrados
- [ ] Templates de mensagens
- [ ] Integração com outros platforms (Zapier, Make)
- [ ] API REST para automação

---

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

![Made with ❤️ by WhatsFlow Team](https://img.shields.io/badge/Made%20with-❤️-red.svg)