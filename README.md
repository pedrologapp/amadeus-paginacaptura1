# Site de Captação de Leads - Colégio Amadeus

## 📋 Visão Geral

Site moderno e responsivo para captação de leads do Colégio Amadeus, com formulário multi-etapas, integração com n8n e Meta Pixel do Facebook.

## ✨ Funcionalidades Implementadas

### 🎯 Formulário Multi-etapas (3 etapas)
- **Etapa 1**: Dados do Responsável
  - Nome completo (obrigatório)
  - Celular com formatação automática (84) 9 9999-9999
  - E-mail com validação
  - **Envio de JSON para n8n para validação de WhatsApp ao avançar**

- **Etapa 2**: Dados do(s) Estudante(s)
  - Nome completo (obrigatório)
  - Série pretendida (dropdown com todas as opções)
  - Turno pretendido (Matutino, Vespertino, Integral)
  - Suporte para até 3 estudantes
  - Seção de vídeo institucional

- **Etapa 3**: Confirmação e Consentimento
  - Checkbox opcional para receber conteúdos
  - Checkbox obrigatório para agendamento via WhatsApp
  - Link para Política de Privacidade

### 🎨 Design e UX
- **Cores**: Azul #0066CC (primária), Laranja #FF6B35 (secundária)
- **Tipografia**: Inter, Poppins, Montserrat
- **Efeitos**: Glassmorphism, sombras suaves, hover effects
- **Responsivo**: Mobile-first design
- **Animações**: Transições suaves, micro-interações

### 📱 Funcionalidades Avançadas
- **Indicador de progresso** visual no header
- **Validação em tempo real** com mensagens de erro
- **Formatação automática** de telefone
- **Botão flutuante do WhatsApp** com animação
- **Captura de parâmetros UTM** automática
- **Página de sucesso** completa com CTAs

## 🔧 Configurações Necessárias

### 1. Webhooks n8n

**a) Webhook de Validação (após Etapa 1)**
Substitua `WEBHOOK_N8N_VALIDACAO_URL` no arquivo `src/App.jsx` pela URL real do seu webhook n8n para validação de WhatsApp.

```javascript
// Linha ~100 em src/App.jsx
const response = await fetch(\'SUA_URL_WEBHOOK_N8N_VALIDACAO_AQUI\', {
```

**b) Webhook de Envio Final (após Etapa 3)**
Substitua `WEBHOOK_N8N_URL` no arquivo `src/App.jsx` pela URL real do seu webhook n8n para envio final dos dados.

```javascript
// Linha ~170 em src/App.jsx
const response = await fetch(\'SUA_URL_WEBHOOK_N8N_AQUI\', {
```

### 2. Meta Pixel do Facebook
Descomente e configure o Meta Pixel no arquivo `index.html`:

```html
<!-- Linha 18-30 em index.html -->
<script>
  // Substitua \'SEU_PIXEL_ID_AQUI\' pelo ID real do seu Pixel
  fbq(\'init\', \'SEU_PIXEL_ID_REAL\');
  fbq(\'track\', \'PageView\');
</script>
```

### 3. Links e Recursos
- **Logo do Colégio**: Substitua o placeholder "CA" por sua logo real
- **Vídeo Institucional**: Adicione o embed do YouTube/Vimeo
- **Material Informativo**: Configure o link do PDF
- **Site do Colégio**: Configure o link de retorno

## 📊 Estrutura de Dados Enviados

### a) JSON de Validação (após Etapa 1)
Enviado para `WEBHOOK_N8N_VALIDACAO_URL`:

```json
{
  "timestamp": "2025-10-01T08:56:00Z",
  "responsavel": {
    "nome": "Maria Santos Silva",
    "celular": "(84) 9 8765-4321",
    "email": "maria.santos@email.com"
  },
  "utm": {
    "source": "facebook",
    "medium": "cpc",
    "campaign": "matriculas_2025",
    "content": "carousel_01",
    "term": "escola_natal"
  },
  "origem": "site_captacao",
  "etapa": "validacao_responsavel"
}
```

### b) JSON de Envio Final (após Etapa 3)
Enviado para `WEBHOOK_N8N_URL`:

```json
{
  "timestamp": "2025-10-01T08:56:00Z",
  "responsavel": {
    "nome": "Maria Santos Silva",
    "celular": "(84) 9 8765-4321",
    "email": "maria.santos@email.com"
  },
  "estudantes": [
    {
      "nome": "Pedro Santos Silva",
      "serie": "6º ano",
      "turno": "Matutino"
    }
  ],
  "consentimentos": {
    "receberConteudos": false,
    "agendarWhatsApp": true
  },
  "utm": {
    "source": "facebook",
    "medium": "cpc",
    "campaign": "matriculas_2025",
    "content": "carousel_01",
    "term": "escola_natal"
  },
  "origem": "site_captacao"
}
```

## 🚀 Como Executar

### Desenvolvimento
```bash
cd colegio-amadeus-leads
pnpm install
pnpm run dev --host
```

### Build para Produção
```bash
pnpm run build
```

## 📱 Eventos do Meta Pixel

O site dispara os seguintes eventos:
- **PageView**: Ao carregar a página
- **Lead**: Ao completar a Etapa 1 (após envio dos dados do responsável e validação do WhatsApp)
- **CompleteRegistration**: Ao finalizar o formulário (após Etapa 3)

## 🎯 Links do WhatsApp

### Botão Flutuante
```
https://wa.me/558499999999?text=Olá! Gostaria de saber mais sobre o Colégio Amadeus
```

### Página de Sucesso
```
https://wa.me/558499999999?text=Olá! Acabei de preencher o formulário de interesse no Colégio Amadeus e gostaria de agendar minha visita
```

## 🔍 Validações Implementadas

- **Campos obrigatórios**: Nome, celular, e-mail do responsável; nome, série pretendida, turno pretendido do estudante.
- **Formato de e-mail**: Validação de formato válido.
- **Telefone**: Deve ter 11 dígitos.
- **Consentimento**: Checkbox obrigatório para agendamento via WhatsApp.
- **Validação de WhatsApp via n8n**: Após a Etapa 1, verifica a validade do número.

## 📋 Checklist de Implementação

### ✅ Concluído
- [x] Formulário multi-etapas funcional (nova ordem: Responsável -> Estudante -> Confirmação)
- [x] Design responsivo e moderno
- [x] Validação de campos
- [x] Formatação de telefone
- [x] Captura de UTM
- [x] Página de sucesso
- [x] Botão flutuante WhatsApp
- [x] Indicador de progresso
- [x] **Envio de JSON para n8n para validação de WhatsApp após Etapa 1**
- [x] **Campos de estudante atualizados** (Série pretendida, Turno pretendido)

### 🔄 Para Configurar
- [ ] URL do webhook n8n (validação)
- [ ] URL do webhook n8n (envio final)
- [ ] ID do Meta Pixel
- [ ] Logo do colégio
- [ ] Vídeo institucional
- [ ] Link do material informativo
- [ ] Link do site do colégio
- [ ] Número do WhatsApp (se diferente)

## 🎨 Customizações

### Cores
As cores podem ser alteradas no arquivo `src/App.css`:
```css
.bg-amadeus-blue { background-color: #0066CC; }
.bg-amadeus-orange { background-color: #FF6B35; }
```

### Textos
Todos os textos podem ser editados diretamente no arquivo `src/App.jsx`.

## 📞 Suporte

Para dúvidas sobre implementação ou customizações, consulte a documentação do React e TailwindCSS.

---

**Desenvolvido com React + TailwindCSS + shadcn/ui**
