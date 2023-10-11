"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_module_1 = require("./app.module");
const app_config_1 = require("./config/app.config");
const mongodb_1 = require("mongodb");
const spaceXAPI_1 = __importDefault(require("./api/spaceXAPI"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger"));
const cors = require('cors');
const app = (0, express_1.default)();
// Configure o aplicativo usando AppConfigLoader
app_config_1.AppConfigLoader.configure(app);
// Obtenha a porta do AppConfigLoader ou use uma porta padrão
const port = app_config_1.AppConfigLoader.getPort() || process.env.PORT || 3000;
const dbUrl = app_config_1.AppConfigLoader.getDbUrl();
app.use(cors());
app.use('/', spaceXAPI_1.default);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// Função para conectar ao MongoDB
function connectToMongoDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!dbUrl) {
                throw new Error('A URL do banco de dados não está definida.');
            }
            const client = new mongodb_1.MongoClient(dbUrl);
            yield client.connect(); // Conecte-se ao MongoDB
            const db = client.db(); // Obtenha uma instância do banco de dados
            // Use o banco de dados aqui, por exemplo:
            const collection = db.collection('ColApplicationLogs');
            // Crie um objeto de log
            const logEntry = {
                timestamp: new Date(),
                message: 'Inicializando o servidor'
            };
            // Insira o objeto de log na coleção
            const result = yield collection.insertOne(logEntry);
            console.log('Mensagem de log salva:', result);
            // Importando e usando o módulo da aplicação
            app_module_1.AppModule.bootstrap(app);
            // Inicie o servidor na porta configurada
            app.listen(port, () => {
                console.log(`Servidor rodando na porta ${port}`);
            });
        }
        catch (error) {
            console.error('Erro ao conectar ao MongoDB:', error);
        }
    });
}
exports.default = app;
// Chame a função para conectar ao MongoDB e salvar o log
connectToMongoDB();
