import express, { Application } from 'express';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { ApplicationConfiguration } from './config.interface';

export class AppConfigLoader {
  private static config: ApplicationConfiguration | undefined;
  private static dbUrl: string ;

  public static configure(app: Application): void {
    this.configureApplicationMiddleware(app);

    try {
      if (!this.config) {
        this.config = this.loadConfig();
        console.log(this.config.database)
        this.dbUrl = this.config.database.url; // Carregue a URL do banco de dados
      }

      this.configurePort(app, this.config);
    } catch (error) {
      console.error('Erro ao configurar o aplicativo:', error);
    }
  }

  private static configureApplicationMiddleware(app: Application): void {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }

  private static loadConfig(): ApplicationConfiguration {
    const configFile = fs.readFileSync('local.config.yaml', 'utf8');
    if (!configFile) {
      throw new Error('O arquivo de configuração está vazio ou mal formatado.');
    }
    return yaml.load(configFile) as ApplicationConfiguration;
  }

  public static getPort(): number | undefined {
    if (this.config) {
      return this.config.node_app.port;
    }
    return undefined;
  }

  public static getDbUrl(): string | undefined {
    return this.dbUrl;
  }

  private static configurePort(app: Application, config: ApplicationConfiguration): void {
    const port = config.node_app.port;
    app.set('port', port);
    console.log(`Aplicativo configurado para rodar na porta ${port}`);
  }
}
