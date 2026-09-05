const express = require('express');
const petsRoutes = require('./src/routes/pets');
const usuariosRoutes = require('./src/routes/usuarios');
const loginRoutes = require('./src/routes/login');
const uploadRoutes = require('./src/routes/upload');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/docs/swagger');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use('/pets', petsRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/login', loginRoutes);
app.use('/upload', uploadRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = 3000;

app.get('/api-status', (req, res) => {
    res.json({
        mensagem: 'API Cadastro de Pets funcionando!',
        versao: '1.0.0',
        rotas: {
            pets: '/pets',
            usuarios: '/usuarios',
            login: '/login',
            upload: '/upload',
            documentacao: '/api-docs'
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});