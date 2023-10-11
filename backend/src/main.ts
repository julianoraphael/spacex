import express, { Request, Response } from 'express';
import { AppModule } from './app.module';
import { AppConfigLoader } from './config/app.config';
import { MongoClient, Db } from 'mongodb';
import apiRoutes from './api/spaceXAPI';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';


const cors = require('cors');
const app = express();

// Configure o aplicativo usando AppConfigLoader
AppConfigLoader.configure(app);

// Obtenha a porta do AppConfigLoader ou use uma porta padrão
const port = AppConfigLoader.getPort() || process.env.PORT || 3000;
const dbUrl = AppConfigLoader.getDbUrl();

app.use(cors()); 

app.use('/', apiRoutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// Função para conectar ao MongoDB
async function connectToMongoDB() {
    try {
      if (!dbUrl) {
        throw new Error('A URL do banco de dados não está definida.');
      }
  
      const client = new MongoClient(dbUrl);
      await client.connect(); // Conecte-se ao MongoDB
  
      const db: Db = client.db(); // Obtenha uma instância do banco de dados
  
      // Use o banco de dados aqui, por exemplo:
      const collection = db.collection('ColApplicationLogs');
  
      // Crie um objeto de log
      const logEntry = {
        timestamp: new Date(),
        message: 'Inicializando o servidor'
      };
  
      // Insira o objeto de log na coleção
      const result = await collection.insertOne(logEntry);
      console.log('Mensagem de log salva:', result);
  
      // Importando e usando o módulo da aplicação
      AppModule.bootstrap(app);
  
      // Inicie o servidor na porta configurada
      app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
      });
    } catch (error) {
      console.error('Erro ao conectar ao MongoDB:', error);
    }
  }

  export default app
  
  // Chame a função para conectar ao MongoDB e salvar o log
  connectToMongoDB();
  