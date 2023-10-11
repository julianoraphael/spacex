"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const app_description_1 = require("./app.description");
const app_config_1 = require("./config/app.config");
class AppModule {
    static bootstrap(app) {
        // Configurações da aplicação
        app_config_1.AppConfigLoader.configure(app);
        // Adicione outras configurações e rotas aqui conforme necessário
        console.log(`${app_description_1.appDescription.name} v${app_description_1.appDescription.version} iniciado.`);
    }
}
exports.AppModule = AppModule;
