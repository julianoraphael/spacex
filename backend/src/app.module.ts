import { Application } from 'express';
import { appDescription } from './app.description';
import { AppConfigLoader } from './config/app.config';

export class AppModule {
  public static bootstrap(app: Application): void {
    // Configurações da aplicação
    AppConfigLoader.configure(app);

    // Adicione outras configurações e rotas aqui conforme necessário

    console.log(`${appDescription.name} v${appDescription.version} iniciado.`);
  }
}
