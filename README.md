# 🐾 PetCare API

Uma API REST alegre, organizada e didática para cadastrar pets, usuários, autenticar acessos e enviar imagens. Este projeto foi desenvolvido para as atividades **AV1/AV2 de Desenvolvimento de Websites**, com foco em uma base simples, segura e fácil de demonstrar.

<div align="center">

![Cachorro feliz](https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85)

**Pets bem cuidados, código bem organizado.** 🐶 🐱 🐰

</div>

## ✨ Visão geral

- API construída com **Node.js** e **Express**.
- Armazenamento totalmente **em memória**, sem banco de dados.
- Senhas protegidas com **bcrypt**.
- Rotas `/pets` protegidas por token Bearer.
- Upload local de imagens com **Multer**.
- Documentação interativa disponível no **Swagger UI**.
- Respostas JSON claras, consistentes e sem exposição de senhas.

## 🛠️ Tecnologias

| Tecnologia | Uso |
| --- | --- |
| Node.js | Runtime JavaScript do servidor |
| Express 5 | Servidor HTTP e roteamento |
| bcrypt | Hash e comparação segura de senhas |
| Multer | Upload de arquivos multipart/form-data |
| Swagger UI Express | Documentação interativa OpenAPI |
| crypto | Geração de tokens de autenticação |

## 🎓 Funcionalidades da AV1

CRUD completo de pets, com IDs únicos, validações e armazenamento em memória:

- `POST /pets` - cadastra um pet;
- `GET /pets` - lista todos os pets;
- `GET /pets/:id` - busca um pet por ID;
- `PUT /pets/:id` - atualiza um pet;
- `DELETE /pets/:id` - remove um pet.

Todos os endpoints de pets exigem `Authorization: Bearer TOKEN`.

### Exemplos de pets

| Pet | Espécie | Personalidade |
| --- | --- | --- |
| Pipoca | Cachorro | Caramelo, brincalhão e especialista em sonecas |
| Jujuba | Gato | Curiosa, elegante e dona da janela |
| Kiwi | Coelho | Fofo, veloz e apaixonado por cenouras |

![Gato curioso](https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=700&q=85)

## 🔐 Funcionalidades da AV2

### Usuários e autenticação

- `POST /usuarios` cadastra `nome`, `email` e `senha`.
- A senha é transformada em hash com bcrypt antes de ser armazenada.
- Emails duplicados são recusados.
- A senha nunca aparece nas respostas.
- `POST /login` verifica o email e compara a senha com bcrypt.
- O login gera um token de autenticação em memória.
- O middleware valida o header `Authorization: Bearer TOKEN` nas rotas `/pets`.

### Upload de imagens

- `POST /upload` recebe um arquivo no campo `arquivo`.
- Aceita somente `.png`, `.jpg` e `.jpeg`.
- Limite máximo: **5 MB**.
- Arquivos são salvos localmente em `uploads/` com nome único.
- A resposta informa nome original, nome armazenado, tipo, tamanho e caminho.

### Documentação

- `GET /api-docs` abre o Swagger UI.
- O botão **Authorize** permite informar o token Bearer e testar as rotas protegidas.

![Coelho colorido](https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=700&q=85)

## 📁 Estrutura de pastas

```text
beatrizpianco/
├── app.js
├── package.json
├── package-lock.json
├── README.md
├── uploads/
│   └── .gitkeep
└── src/
    ├── data/
    │   └── usuarios.js
    ├── docs/
    │   └── swagger.js
    ├── middleware/
    │   └── auth.js
    └── routes/
        ├── login.js
        ├── pets.js
        ├── upload.js
        └── usuarios.js
```

## 🚀 Como instalar e executar

Pré-requisito: Node.js 18 ou superior.

```bash
npm install
npm start
```

O servidor será iniciado em:

```text
http://localhost:3000
```

Documentação interativa:

```text
http://localhost:3000/api-docs
```

## 📚 Rotas disponíveis

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| `GET` | `/` | Não | Status e atalhos da API |
| `POST` | `/usuarios` | Não | Cadastro de usuário |
| `POST` | `/login` | Não | Login e geração de token |
| `POST` | `/pets` | Bearer | Cadastro de pet |
| `GET` | `/pets` | Bearer | Lista pets |
| `GET` | `/pets/:id` | Bearer | Consulta pet |
| `PUT` | `/pets/:id` | Bearer | Atualiza pet |
| `DELETE` | `/pets/:id` | Bearer | Remove pet |
| `POST` | `/upload` | Não | Upload de imagem |
| `GET` | `/api-docs` | Não | Swagger UI |

## 🧪 Exemplos de requisições

### 1. Criar usuário

```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Luna Almeida",
    "email": "luna@example.com",
    "senha": "patinhas123"
  }'
```

Resposta `201 Created`:

```json
{
  "id": 1,
  "nome": "Luna Almeida",
  "email": "luna@example.com"
}
```

### 2. Fazer login

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "luna@example.com",
    "senha": "patinhas123"
  }'
```

Resposta `200 OK`:

```json
{
  "mensagem": "Login realizado com sucesso.",
  "token": "COLE_O_TOKEN_AQUI",
  "usuario": {
    "id": 1,
    "nome": "Luna Almeida",
    "email": "luna@example.com"
  }
}
```

### 3. Cadastrar o pet Pipoca

Substitua `COLE_O_TOKEN_AQUI` pelo token recebido no login.

```bash
curl -X POST http://localhost:3000/pets \
  -H "Authorization: Bearer COLE_O_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Pipoca",
    "especie": "cachorro",
    "idade": 3,
    "raca": "vira-lata caramelo",
    "dono": "Luna Almeida"
  }'
```

### 4. Listar pets

```bash
curl http://localhost:3000/pets \
  -H "Authorization: Bearer COLE_O_TOKEN_AQUI"
```

### 5. Fazer upload de imagem

```bash
curl -X POST http://localhost:3000/upload \
  -F "arquivo=@./minha-imagem.jpg"
```

Resposta `201 Created`:

```json
{
  "mensagem": "Upload realizado com sucesso!",
  "arquivo": {
    "nomeOriginal": "minha-imagem.jpg",
    "nomeArmazenado": "uuid-gerado.jpg",
    "tipo": "image/jpeg",
    "tamanhoBytes": 24576,
    "caminho": "uploads/uuid-gerado.jpg"
  }
}
```

## 📮 Como testar no Postman

1. Execute `npm start`.
2. Crie uma requisição `POST http://localhost:3000/usuarios` com Body **raw / JSON**.
3. Faça `POST http://localhost:3000/login` com o mesmo email e senha.
4. Copie o campo `token` da resposta.
5. Para qualquer rota de pets, abra a aba **Authorization**, escolha **Bearer Token** e cole o token.
6. Teste `POST`, `GET`, `GET por ID`, `PUT` e `DELETE` em `/pets`.
7. Para upload, crie `POST http://localhost:3000/upload`, selecione Body **form-data**, adicione a chave `arquivo` como tipo **File** e escolha uma imagem PNG, JPG ou JPEG.
8. Abra `http://localhost:3000/api-docs` para executar os exemplos pelo Swagger UI.

### Cenários importantes

- Sem token em `/pets`: retorna `401`.
- Token inválido: retorna `401`.
- Email duplicado: retorna `409`.
- Imagem acima de 5 MB: retorna `413`.
- Extensão diferente de PNG/JPG/JPEG: retorna `400`.

## ✅ Observações

Os dados ficam em memória e são perdidos quando o servidor é reiniciado, conforme o escopo da atividade. A pasta `uploads/` existe localmente, mas os arquivos enviados são ignorados pelo Git para evitar subir imagens temporárias ou pesadas.