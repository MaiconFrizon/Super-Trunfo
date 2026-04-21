# 🎁 Lista de Presentes - Chá de Cozinha

Aplicação web elegante e sofisticada para gerenciar lista de presentes de chá de cozinha. Permite que convidados escolham presentes únicos (sem duplicatas) e que organizadores gerenciem toda a lista.

## ✨ Funcionalidades

### Para Convidados
- ✅ Visualizar lista completa de presentes com imagens
- ✅ Filtrar presentes (Todos, Disponíveis, Escolhidos)
- ✅ Escolher presente disponível preenchendo dados pessoais
- ✅ Deixar mensagem opcional para os noivos
- ✅ Interface elegante com design arredondado e fluido
- ✅ Responsivo para desktop, tablet e mobile

### Para Administradores
- ✅ Login seguro com senha
- ✅ Dashboard com estatísticas em tempo real
- ✅ Adicionar novos presentes com upload de imagem
- ✅ Editar presentes existentes
- ✅ Remover presentes
- ✅ Visualizar quem escolheu cada presente
- ✅ Ler mensagens dos convidados
- ✅ Exportar todos os dados em formato CSV

## 🎨 Design

- **Cores**: Paleta elegante com dourado (#D4AF37), rosa pastel e tons de cinza
- **Tipografia**: Playfair Display (títulos) + Lato (corpo)
- **Estilo**: Elementos arredondados, fluidos e com animações suaves
- **Tema**: Romântico e sofisticado

## 🚀 Como Usar

### Acesso Convidado
1. Acesse a página principal: `https://maicon-thalita-gifts.preview.emergentagent.com`
2. Navegue pelos presentes disponíveis
3. Clique em "Escolher este Presente" no presente desejado
4. Preencha seus dados (nome, sobrenome, contato)
5. Deixe uma mensagem carinhosa (opcional)
6. Confirme a escolha

### Acesso Administrativo
1. Acesse: `https://maicon-thalita-gifts.preview.emergentagent.com/admin`
2. Use a senha: `admin123`
3. Gerencie presentes e visualize seleções

## 🔧 Configuração Técnica

### Backend (FastAPI + MongoDB)
- API RESTful com endpoints para presentes e autenticação
- Upload de imagens convertidas para base64
- Autenticação JWT para área administrativa
- Exportação de dados em CSV

### Frontend (React)
- SPA (Single Page Application) com React Router
- Animações fluidas com Framer Motion
- Notificações toast com Sonner
- Design responsivo com Tailwind CSS

### Variáveis de Ambiente

**Backend** (`/app/backend/.env`):
```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
JWT_SECRET_KEY="bridal-shower-secret-key-2025"
ADMIN_PASSWORD="admin123"
```

**Frontend** (`/app/frontend/.env`):
```
REACT_APP_BACKEND_URL=https://maicon-thalita-gifts.preview.emergentagent.com
```

## 📝 Endpoints da API

### Públicos
- `GET /api/gifts` - Listar todos os presentes
- `POST /api/gifts/{id}/select` - Selecionar presente (convidado)

### Administrativos (requer autenticação)
- `POST /api/admin/login` - Login admin
- `GET /api/admin/gifts` - Listar presentes (admin)
- `POST /api/admin/gifts` - Criar presente
- `PUT /api/admin/gifts/{id}` - Atualizar presente
- `DELETE /api/admin/gifts/{id}` - Remover presente
- `GET /api/admin/export` - Exportar dados CSV
- `POST /api/admin/upload` - Upload de imagem

## 🎯 Próximos Passos Sugeridos

1. **Notificações**: Enviar email/SMS quando presente for escolhido
2. **Sugestões de presentes**: IA para sugerir presentes baseado em tendências
3. **Compartilhamento social**: Botões para compartilhar lista nas redes sociais
4. **Tema personalizável**: Permitir customizar cores do evento
5. **Multi-evento**: Gerenciar múltiplos chás/eventos

## 🛡️ Segurança

- Senhas não são armazenadas em texto plano (usar bcrypt em produção)
- Tokens JWT com expiração de 7 dias
- Validação de dados em frontend e backend
- CORS configurado corretamente

## 📦 Tecnologias

- **Backend**: FastAPI, Motor (MongoDB async), PyJWT, Passlib
- **Frontend**: React 19, Tailwind CSS, Framer Motion, Sonner, Lucide Icons
- **Database**: MongoDB
- **Deploy**: Kubernetes (Emergent Platform)

## 👨‍💻 Desenvolvido com

Made with ❤️ using Emergent AI Platform
