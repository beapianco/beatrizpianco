const petSchema = {
	type: 'object',
	properties: {
		id: { type: 'integer', example: 1 },
		nome: { type: 'string', example: 'Pipoca' },
		especie: { type: 'string', example: 'cachorro' },
		idade: { type: 'integer', minimum: 0, example: 3 },
		raca: { type: 'string', example: 'vira-lata caramelo' },
		dono: { type: 'string', example: 'Luna Almeida' }
	},
	required: ['nome', 'especie', 'idade', 'raca', 'dono']
};

const publicServerUrl = process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
	? `https://${process.env.CODESPACE_NAME}-3000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
	: 'http://localhost:3000';

module.exports = {
	openapi: '3.0.3',
	info: {
		title: 'PetCare API',
		description: 'API alegre e didática para cadastro de pets, usuários, autenticação e imagens.',
		version: '1.0.0',
		contact: { name: 'Projeto AV1/AV2 - Desenvolvimento de Websites' }
	},
	servers: [{ url: publicServerUrl, description: 'Servidor do Codespace' }],
	tags: [
		{ name: 'Pets', description: 'CRUD protegido de pets' },
		{ name: 'Usuários', description: 'Cadastro com senha protegida por bcrypt' },
		{ name: 'Autenticação', description: 'Login e token Bearer' },
		{ name: 'Upload', description: 'Envio de imagens de pets' }
	],
	components: {
		securitySchemes: {
			bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'Token' }
		},
		schemas: {
			Pet: petSchema,
			UsuarioPublico: {
				type: 'object',
				properties: {
					id: { type: 'integer', example: 1 },
					nome: { type: 'string', example: 'Luna Almeida' },
					email: { type: 'string', format: 'email', example: 'luna@example.com' }
				}
			}
		}
	},
	paths: {
		'/pets': {
			post: {
				tags: ['Pets'], security: [{ bearerAuth: [] }], summary: 'Cadastra um pet',
				requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Pet' } } } },
				responses: { 201: { description: 'Pet cadastrado' }, 400: { description: 'Dados inválidos' }, 401: { description: 'Token ausente ou inválido' } }
			},
			get: {
				tags: ['Pets'], security: [{ bearerAuth: [] }], summary: 'Lista todos os pets',
				responses: { 200: { description: 'Lista de pets' }, 401: { description: 'Token ausente ou inválido' } }
			}
		},
		'/pets/{id}': {
			parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 1 }],
			get: { tags: ['Pets'], security: [{ bearerAuth: [] }], summary: 'Busca um pet por ID', responses: { 200: { description: 'Pet encontrado' }, 404: { description: 'Pet não encontrado' } } },
			put: { tags: ['Pets'], security: [{ bearerAuth: [] }], summary: 'Atualiza um pet', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Pet' } } } }, responses: { 200: { description: 'Pet atualizado' }, 400: { description: 'Dados inválidos' }, 404: { description: 'Pet não encontrado' } } },
			delete: { tags: ['Pets'], security: [{ bearerAuth: [] }], summary: 'Remove um pet', responses: { 200: { description: 'Pet removido' }, 404: { description: 'Pet não encontrado' } } }
		},
		'/usuarios': {
			post: {
				tags: ['Usuários'], summary: 'Cadastra um usuário',
				requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['nome', 'email', 'senha'], properties: { nome: { type: 'string', example: 'Luna Almeida' }, email: { type: 'string', format: 'email', example: 'luna@example.com' }, senha: { type: 'string', format: 'password', example: 'patinhas123' } } } } } },
				responses: { 201: { description: 'Usuário criado sem retornar senha' }, 400: { description: 'Campos obrigatórios ausentes' }, 409: { description: 'Email já cadastrado' } }
			}
		},
		'/login': {
			post: {
				tags: ['Autenticação'], summary: 'Realiza login e gera token',
				requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'senha'], properties: { email: { type: 'string', example: 'luna@example.com' }, senha: { type: 'string', format: 'password', example: 'patinhas123' } } } } } },
				responses: { 200: { description: 'Login realizado com token Bearer' }, 400: { description: 'Campos ausentes' }, 401: { description: 'Credenciais inválidas' } }
			}
		},
		'/upload': {
			post: {
				tags: ['Upload'], summary: 'Envia imagem PNG, JPG ou JPEG',
				requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', required: ['arquivo'], properties: { arquivo: { type: 'string', format: 'binary' } } } } } },
				responses: { 201: { description: 'Upload concluído' }, 400: { description: 'Formato ausente ou inválido' }, 413: { description: 'Arquivo maior que 5 MB' } }
			}
		}
	}
};