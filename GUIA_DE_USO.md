# 📋 GUIA DE USO - Lista de Presentes

## 🔐 ACESSO ADMINISTRATIVO

### Como acessar o painel admin:

**Opção 1 - Link no rodapé:**
1. Vá até a página principal: https://kitchenrsvp.preview.emergentagent.com
2. Role até o final da página
3. Clique em "🔒 Acesso Administrativo"

**Opção 2 - URL direta:**
- Acesse: https://kitchenrsvp.preview.emergentagent.com/admin

**Credenciais:**
- Senha: `admin123`

---

## 📊 ENTENDENDO O PAINEL ADMINISTRATIVO

### 1. Estatísticas no Topo
- **Total de Presentes**: Quantidade total cadastrada
- **Disponíveis**: Presentes que ainda não foram escolhidos
- **Escolhidos**: Presentes já selecionados por convidados

### 2. Tabela de Presentes

A tabela mostra:
- ✅ **Presente**: Nome e miniatura da imagem
- ✅ **Status**: Badge indicando "Disponível" (dourado) ou "Escolhido" (rosa)
- ✅ **Escolhido Por**: Nome da pessoa que escolheu (se aplicável)
- ✅ **Contato**: Email ou telefone do convidado
- ✅ **Mensagem**: Link "Ver mensagem completa" para ler a mensagem

### 3. Ver Detalhes Completos

**Para ver TODAS as informações de um presente escolhido:**
1. Localize o presente na tabela
2. Na coluna "Mensagem", clique em **"Ver mensagem completa"**
3. Um modal se abrirá mostrando:
   - Nome completo da pessoa
   - Contato (email/telefone)
   - Data e hora da seleção
   - Mensagem completa para os noivos

---

## 🎁 GERENCIAR PRESENTES

### Adicionar Novo Presente
1. Clique no botão **"+ Adicionar Presente"** (dourado)
2. Preencha:
   - Nome do presente
   - Faça upload da imagem (PNG/JPG, máx 5MB)
3. Clique em "Adicionar Presente"

### Editar Presente
1. Localize o presente na tabela
2. Clique no ícone de lápis (✏️) na coluna "Ações"
3. Modifique o que desejar
4. Clique em "Atualizar Presente"

### Remover Presente
1. Localize o presente na tabela
2. Clique no ícone de lixeira (🗑️) na coluna "Ações"
3. Confirme a exclusão

### Exportar Dados
1. Clique no botão **"↓ Exportar Dados"**
2. Um arquivo CSV será baixado com:
   - Nome de todos os presentes
   - Status (Disponível/Escolhido)
   - Informações de quem escolheu
   - Mensagens
   - Datas

---

## 👥 VISUALIZAÇÃO PARA CONVIDADOS

### O que os convidados veem:
- ✅ Lista completa de presentes com imagens
- ✅ Status visual (presentes escolhidos ficam com overlay escuro)
- ✅ Filtros: Todos | Disponíveis | Escolhidos
- ✅ Botão "Escolher este Presente" apenas em presentes disponíveis

### O que os convidados NÃO veem:
- ❌ Quem escolheu cada presente (privacidade)
- ❌ Contatos de outros convidados
- ❌ Mensagens de outros convidados
- ❌ Botões de administração

---

## 🔍 EXPLICAÇÃO DOS PROBLEMAS RELATADOS

### ❓ "Itens marcados como escolhidos - não sei quem escolheu"

**RESPOSTA:** Os dados ESTÃO salvos no banco de dados!

**Atualmente no sistema:**
- **Jogo de Panelas Inox** → Escolhido por **Maria Silva** (maria@email.com)
- **Cafeteira Elétrica** → Escolhido por **Thalita Da Luz** (14 997206571)

**Como ver essas informações:**
1. Acesse /admin
2. Faça login (senha: admin123)
3. Na tabela, clique em "Ver mensagem completa" para cada presente escolhido

---

### ❓ "Imagem não está carregando"

**RESPOSTA:** As imagens estão carregando corretamente!

O que pode parecer "problema":
- Presentes **escolhidos** aparecem com **overlay escuro** (é proposital!)
- Isso indica visualmente que já foram escolhidos

**Proteção adicionada:**
- Se alguma imagem falhar, automaticamente carrega uma imagem padrão
- Não haverá mais "quadrados vazios"

---

### ❓ "Não encontro o login administrativo"

**RESPOSTA:** Agora tem link no rodapé!

- Role a página principal até o final
- Clique em "🔒 Acesso Administrativo"
- Ou acesse diretamente: /admin

---

### ❓ "Não vejo informações de quem escolheu"

**RESPOSTA:** Está no painel admin!

**Passo a passo:**
1. /admin → Login
2. Localize o presente "Escolhido" (badge rosa)
3. Clique em "Ver mensagem completa"
4. Veja TODOS os detalhes:
   - Nome completo
   - Contato
   - Data/hora exata
   - Mensagem completa

---

## 🎯 RESUMO EXECUTIVO

| O QUE | ONDE ESTÁ | COMO ACESSAR |
|-------|-----------|--------------|
| Login Admin | `/admin` | Link no rodapé da página principal |
| Ver quem escolheu | Dashboard Admin | Tabela → coluna "Escolhido Por" |
| Ver mensagem completa | Dashboard Admin | Botão "Ver mensagem completa" |
| Exportar tudo | Dashboard Admin | Botão "Exportar Dados" → CSV |
| Adicionar presente | Dashboard Admin | Botão "+ Adicionar Presente" |
| Editar presente | Dashboard Admin | Ícone ✏️ na linha do presente |
| Remover presente | Dashboard Admin | Ícone 🗑️ na linha do presente |

---

## 🛡️ SEGURANÇA

- ✅ Dados salvos no MongoDB (persistentes)
- ✅ Autenticação JWT com expiração de 7 dias
- ✅ Senha protegida (variável de ambiente)
- ✅ Informações privadas visíveis APENAS para admin
- ✅ Convidados não veem dados de outros convidados

---

## 📱 ACESSO RÁPIDO

**Página Principal (Convidados):**
👉 https://kitchenrsvp.preview.emergentagent.com

**Painel Admin:**
👉 https://kitchenrsvp.preview.emergentagent.com/admin
🔑 Senha: `admin123`

---

## 💡 DICAS

1. **Para compartilhar com convidados**: Envie apenas o link principal (sem /admin)
2. **Para ver mensagens**: Use o painel admin → "Ver mensagem completa"
3. **Backup dos dados**: Use "Exportar Dados" regularmente
4. **Trocar senha**: Edite `/app/backend/.env` → variável `ADMIN_PASSWORD`

---

## 🆘 PRECISA DE AJUDA?

Se algo não funcionar:
1. Verifique se está logado no admin (JWT expira em 7 dias)
2. Limpe o cache do navegador
3. Tente fazer logout e login novamente
