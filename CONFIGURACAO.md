# 🔧 Guia de Configuração - Colégio Amadeus

## 📋 Checklist de Implementação

### 1. 🔗 Configurar Webhooks n8n

**a) Webhook de Validação (após Etapa 1)**

**Arquivo**: `src/App.jsx` (linha ~100)

**Substituir o código de simulação** e `WEBHOOK_N8N_VALIDACAO_URL` pela URL real do seu webhook n8n para validação de WhatsApp. Certifique-se de que o webhook retorna um JSON com `{"whatsappValido": true}` para sucesso.

```javascript
// De:
// Simular delay de validação
await new Promise(resolve => setTimeout(resolve, 1500))
// Simular sucesso na validação
return true

// Para (exemplo):
const response = await fetch(\'https://sua-instancia-n8n.com/webhook/validacao-whatsapp\', {
  method: \'POST\',
  headers: {
    \'Content-Type\': \'application/json\',
  },
  body: JSON.stringify(responsibleData)
})

if (response.ok) {
  const result = await response.json()
  return result.whatsappValido === true
} else {
  throw new Error(\'Erro na validação\')
}
```

**b) Webhook de Envio Final (após Etapa 3)**

**Arquivo**: `src/App.jsx` (linha ~170)

**Substituir o código de simulação** e `WEBHOOK_N8N_URL` pela URL real do seu webhook n8n para envio final dos dados.

```javascript
// De:
// Simulação para demonstração - TODO: Substituir WEBHOOK_N8N_URL pela URL real do n8n
console.log(\'Dados finais enviados para o n8n:\', formData)
// Simular delay de envio
await new Promise(resolve => setTimeout(resolve, 2000))
// Simular sucesso
if (window.fbq) {
  window.fbq(\'track\', \'CompleteRegistration\')
}
setIsSuccess(true)

// Para (exemplo):
const response = await fetch(\'https://sua-instancia-n8n.com/webhook/colegio-amadeus-leads\', {
  method: \'POST\',
  headers: {
    \'Content-Type\': \'application/json\',
  },
  body: JSON.stringify(formData)
})

if (response.ok) {
  if (window.fbq) {
    window.fbq(\'track\', \'CompleteRegistration\')
  }
  setIsSuccess(true)
} else {
  throw new Error(\'Erro no envio\')
}
```

### 2. 📊 Configurar Meta Pixel do Facebook

**Arquivo**: `index.html` (linhas 12-35)

**Descomentar o código** e substituir `SEU_PIXEL_ID_AQUI` pelo ID real:

```html
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version=\'2.0\';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,\'script\',
  \'https://connect.facebook.net/en_US/fbevents.js\');
  
  fbq(\'init\', \'1234567890123456\'); // SEU ID REAL AQUI
  fbq(\'track\', \'PageView\');
</script>
```

### 3. 🏫 Adicionar Logo do Colégio

**Arquivo**: `src/App.jsx` (linha ~202)

**Substituir**:
```jsx
<div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
  CA
</div>
```

**Por**:
```jsx
<img 
  src="/logo-colegio-amadeus.png" 
  alt="Colégio Amadeus" 
  className="w-12 h-12 object-contain"
/>
```

**Adicionar a logo** na pasta `public/`.

### 4. 🎥 Configurar Vídeo Institucional

**Arquivo**: `src/App.jsx` (linhas ~250 e ~320)

**Substituir os placeholders**:
```jsx
<div className="w-full h-full flex items-center justify-center text-gray-500">
  Player de Vídeo Institucional
</div>
```

**Por embed do YouTube**:
```jsx
<iframe
  width="100%"
  height="100%"
  src="https://www.youtube.com/embed/SEU_VIDEO_ID"
  title="Vídeo Institucional Colégio Amadeus"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  className="rounded-2xl"
></iframe>
```

### 5. 📱 Configurar Números do WhatsApp

**Se necessário alterar o número** (padrão: 558499999999):

**Arquivo**: `src/App.jsx`

**Buscar e substituir todas as ocorrências**:
- Linha ~195: Botão flutuante
- Linha ~230: Página de sucesso

```javascript
// De:
https://wa.me/558499999999

// Para:
https://wa.me/5584SEUNUMERO
```

### 6. 📄 Configurar Material Informativo

**Arquivo**: `src/App.jsx` (linha ~240)

**Substituir**:
```jsx
onClick={() => {/* TODO: Inserir link do PDF do material informativo */}}
```

**Por**:
```jsx
onClick={() => window.open(\'/material-informativo-colegio-amadeus.pdf\', \'_blank\')}
```

**Adicionar o PDF** na pasta `public/`.

### 7. 🌐 Configurar Link do Site

**Arquivo**: `src/App.jsx` (linha ~270)

**Substituir**:
```jsx
onClick={() => {/* TODO: Inserir URL do site do colégio */}}
```

**Por**:
```jsx
onClick={() => window.open(\'https://www.colegioamadeus.com.br\', \'_blank\')}
```

### 8. 📧 Configurar Política de Privacidade

**Arquivo**: `src/App.jsx` (linha ~450)

**Substituir**:
```jsx
<a href="#" className="text-blue-600 underline hover:text-blue-800">
  Política de Privacidade
</a>
```

**Por**:
```jsx
<a 
  href="/politica-privacidade.pdf" 
  target="_blank"
  className="text-blue-600 underline hover:text-blue-800"
>
  Política de Privacidade
</a>
```

## 🚀 Deploy e Produção

### 1. Build do Projeto
```bash
pnpm run build
```

### 2. Testar Build Local
```bash
pnpm run preview
```

### 3. Deploy
- Faça upload da pasta `dist/` para seu servidor
- Configure o servidor para servir `index.html` para todas as rotas
- Certifique-se que os arquivos estáticos (logo, PDF) estão acessíveis

## 🔍 Testes Recomendados

### Antes do Deploy:
1. ✅ Testar formulário completo
2. ✅ Verificar formatação de telefone
3. ✅ Testar validações de erro
4. ✅ Verificar responsividade mobile
5. ✅ Testar botões do WhatsApp
6. ✅ Verificar captura de UTM (adicione ?utm_source=teste na URL)
7. ✅ Testar Meta Pixel (usar Facebook Pixel Helper)

### Após Deploy:
1. ✅ Testar webhook n8n (validação)
2. ✅ Testar webhook n8n (envio final)
3. ✅ Verificar eventos do Meta Pixel
4. ✅ Testar em diferentes dispositivos
5. ✅ Verificar velocidade de carregamento

## 📊 Monitoramento

### Métricas Importantes:
- Taxa de conversão por etapa
- Abandono no formulário
- Origem dos leads (UTM)
- Dispositivos mais utilizados

### Ferramentas Recomendadas:
- Google Analytics
- Facebook Pixel Helper
- Google PageSpeed Insights
- GTmetrix

## 🆘 Solução de Problemas

### Formulário não envia:
1. Verificar URL do webhook n8n (validação e envio final)
2. Verificar console do navegador para erros
3. Testar webhooks separadamente

### Meta Pixel não funciona:
1. Verificar ID do pixel
2. Usar Facebook Pixel Helper
3. Verificar se o domínio está configurado no Facebook

### Responsividade:
1. Testar em diferentes tamanhos de tela
2. Verificar se TailwindCSS está carregando
3. Usar DevTools para debug

---

**💡 Dica**: Mantenha sempre uma versão de backup antes de fazer alterações em produção!
