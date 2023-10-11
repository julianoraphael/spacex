"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigLoader = void 0;
const express_1 = __importDefault(require("express"));
const yaml = __importStar(require("js-yaml"));
const fs = __importStar(require("fs"));
class AppConfigLoader {
    static configure(app) {
        this.configureApplicationMiddleware(app);
        try {
            if (!this.config) {
                this.config = this.loadConfig();
                console.log(this.config.database);
                this.dbUrl = this.config.database.url; // Carregue a URL do banco de dados
            }
            this.configurePort(app, this.config);
        }
        catch (error) {
            console.error('Erro ao configurar o aplicativo:', error);
        }
    }
    static configureApplicationMiddleware(app) {
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
    }
    static loadConfig() {
        const configFile = fs.readFileSync('local.config.yaml', 'utf8');
        if (!configFile) {
            throw new Error('O arquivo de configuração está vazio ou mal formatado.');
        }
        return yaml.load(configFile);
    }
    static getPort() {
        if (this.config) {
            return this.config.node_app.port;
        }
        return undefined;
    }
    static getDbUrl() {
        return this.dbUrl;
    }
    static configurePort(app, config) {
        const port = config.node_app.port;
        app.set('port', port);
        console.log(`Aplicativo configurado para rodar na porta ${port}`);
    }
}
exports.AppConfigLoader = AppConfigLoader;
