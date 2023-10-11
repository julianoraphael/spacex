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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongodb_1 = require("mongodb");
const app_config_1 = require("../config/app.config");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Launches
 *   description: API para gerenciar lançamentos da Space X
 *
 * /launches:
 *   get:
 *     summary: Lista de lançamentos com paginação e filtros de busca.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         description: Limite de resultados por página (use 'all' para todos os resultados).
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Número da página a ser exibida.
 *       - in: query
 *         name: success
 *         schema:
 *           type: string
 *         description: Filtrar por sucesso (true/false).
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nome (insensível a maiúsculas/minúsculas).
 *     responses:
 *       200:
 *         description: Lista de lançamentos.
 *       400:
 *         description: Erro ao buscar lançamentos.
 */
/**
 * @swagger
 * /launches/stats:
 *   get:
 *     summary: Estatísticas de lançamentos.
 *     responses:
 *       200:
 *         description: Estatísticas de lançamentos.
 *       400:
 *         description: Erro ao buscar estatísticas de lançamento.
 */
/**
 * @swagger
 * /:
 *   get:
 *     summary: Rota padrão.
 *     responses:
 *       200:
 *         description: Mensagem da API.
 */
/**
 * @swagger
 * /api-docs:
 *   get:
 *     summary: Documentação da API.
 *     responses:
 *       200:
 *         description: Documentação da API.
 */
/**
 * @swagger
 * /launches:
 *   get:
 *     summary: Lista de lançamentos com paginação e filtros de busca.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         description: Limite de resultados por página (use 'all' para todos os resultados).
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Número da página a ser exibida.
 *       - in: query
 *         name: success
 *         schema:
 *           type: string
 *         description: Filtrar por sucesso (true/false).
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nome (insensível a maiúsculas/minúsculas).
 *     responses:
 *       200:
 *         description: Lista de lançamentos.
 *       400:
 *         description: Erro ao buscar lançamentos.
 */
/**
 * @swagger
 * /launches/stats:
 *   get:
 *     summary: Estatísticas de lançamentos.
 *     responses:
 *       200:
 *         description: Estatísticas de lançamentos.
 *       400:
 *         description: Erro ao buscar estatísticas de lançamento.
 */
/**
 * @swagger
 * /:
 *   get:
 *     summary: Rota padrão.
 *     responses:
 *       200:
 *         description: Mensagem da API.
 */
// Rota para listar lançamentos com paginação e filtros de busca por sucesso e nome
router.get('/launches', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extrai os parâmetros da consulta
        const { limit = 'all', page = '1', success, name, rocket } = req.query;
        // Obtém a URL do MongoDB a partir das configurações
        const mongoURI = app_config_1.AppConfigLoader.getDbUrl() || '';
        // Conecta-se ao MongoDB
        const client = new mongodb_1.MongoClient(mongoURI, {
            useUnifiedTopology: true,
        });
        yield client.connect();
        const db = client.db();
        const collection = db.collection('ColLaunches');
        const filter = {};
        // Aplica filtros com base nos parâmetros
        if (success && typeof success === 'string') {
            filter.success = success === 'true';
        }
        if (name && typeof name === 'string') {
            const nameRegex = new RegExp(escapeRegExp(name), 'i');
            filter.name = nameRegex;
        }
        if (rocket && typeof rocket === 'string') {
            const rocketRegex = new RegExp(escapeRegExp(rocket), 'i');
            filter.name = rocketRegex;
        }
        // Conta documentos correspondentes ao filtro
        const totalDocs = yield collection.countDocuments(filter);
        const parsedLimit = limit === 'all' ? totalDocs : Number(limit);
        const parsedPage = Number(page);
        const skip = (parsedPage - 1) * parsedLimit;
        // Consulta com paginação e filtro
        const results = yield collection.find(filter).skip(skip).limit(parsedLimit).toArray();
        const totalPages = Math.ceil(totalDocs / parsedLimit);
        const hasNext = parsedPage < totalPages;
        const hasPrev = parsedPage > 1;
        // Retorna os resultados
        res.status(200).json({
            results,
            totalDocs,
            page: parsedPage,
            totalPages,
            hasNext,
            hasPrev,
        });
    }
    catch (error) {
        // Em caso de erro, retorna mensagem de erro formatada
        res.status(400).json({ message: 'Erro ao buscar lançamentos' });
    }
}));
router.get('/rockets/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rocketId = req.params.id;
        // Obtém a URL do MongoDB a partir das configurações
        const mongoURI = app_config_1.AppConfigLoader.getDbUrl() || '';
        // Conecta-se ao MongoDB
        const client = new mongodb_1.MongoClient(mongoURI, {
            useUnifiedTopology: true,
        });
        yield client.connect();
        const db = client.db();
        const rocketsCollection = db.collection('ColRockets');
        try {
            const rocket = yield rocketsCollection.findOne({ id: rocketId });
            if (rocket) {
                res.status(200).json({ name: rocket.name });
            }
            else {
                res.status(404).json({ message: 'Foguete não encontrado' });
            }
        }
        catch (error) {
            console.error('Erro ao buscar o foguete:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
        finally {
            // Certifique-se de desconectar o cliente após a consulta
            client.close();
        }
    }
    catch (error) {
        // Em caso de erro, retorna mensagem de erro formatada
        res.status(400).json({ message: 'Erro ao buscar lançamentos' });
    }
}));
// Rota para obter estatísticas de lançamento
router.get('/launches/stats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // URL do MongoDB
        const mongoURI = app_config_1.AppConfigLoader.getDbUrl() || '';
        const client = new mongodb_1.MongoClient(mongoURI, {
            useUnifiedTopology: true,
        });
        yield client.connect();
        const db = client.db();
        const collection = db.collection('ColLaunches');
        // Pipeline para contar foguetes reutilizados   
        const rocketCountReusedPipeline = [
            {
                $match: {
                    $and: [
                        { "cores.0.reused": true },
                        { "upcoming": false },
                    ],
                },
            },
            {
                $group: {
                    _id: "$rocket",
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "ColRockets",
                    localField: "_id",
                    foreignField: "id",
                    as: "rocketData",
                },
            },
            {
                $unwind: "$rocketData",
            },
            {
                $project: {
                    _id: 1,
                    name: "$rocketData.name",
                    count: 1,
                },
            },
        ];
        const rocketCountReused = yield collection.aggregate(rocketCountReusedPipeline).toArray();
        // Pipeline para contar foguetes novos    
        const rocketUsagePipeline = [
            {
                $match: {
                    $and: [
                        { "cores.0.reused": false },
                        { "upcoming": false },
                    ],
                },
            },
            {
                $group: {
                    _id: "$rocket",
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "ColRockets",
                    localField: "_id",
                    foreignField: "id",
                    as: "rocketData",
                },
            },
            {
                $unwind: "$rocketData",
            },
            {
                $project: {
                    _id: 1,
                    name: "$rocketData.name",
                    count: 1,
                },
            },
        ];
        const rocketUsage = yield collection.aggregate(rocketUsagePipeline).toArray();
        // Pipeline para contar êxitos e falhas gerais
        const successFailurePipeline = [
            {
                $group: {
                    _id: null,
                    successes: {
                        $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] },
                    },
                    failures: {
                        $sum: { $cond: [{ $eq: ['$success', false] }, 1, 0] },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ];
        // Executa pipeline para contar êxitos e falhas gerais
        const successFailure = yield collection.aggregate(successFailurePipeline).toArray();
        // Pipeline para contar êxitos e falhas por ano
        const successFailureByYearPipeline = [
            {
                $group: {
                    _id: { $year: { $dateFromString: { dateString: '$date_utc' } } },
                    successes: {
                        $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] },
                    },
                    failures: {
                        $sum: { $cond: [{ $eq: ['$success', false] }, 1, 0] },
                    },
                },
            },
            {
                $sort: { _id: 1 },
            },
            {
                $project: {
                    _id: 0,
                    year: '$_id',
                    successes: 1,
                    failures: 1,
                },
            },
        ];
        // Executa pipeline para contar êxitos e falhas por ano
        const successFailureByYear = yield collection.aggregate(successFailureByYearPipeline).toArray();
        // Pipeline para contar quantas vezes cada foguete foi utilizado por ano
        const rocketUsageByYearPipeline = [
            {
                $match: {
                    "upcoming": false, // Garante que estamos contando apenas lançamentos passados
                },
            },
            {
                $group: {
                    _id: {
                        rocket: "$rocket",
                        year: { $year: { $dateFromString: { dateString: "$date_utc" } } },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "ColRockets",
                    localField: "_id.rocket",
                    foreignField: "id",
                    as: "rocketData",
                },
            },
            {
                $unwind: "$rocketData",
            },
            {
                $project: {
                    _id: 1,
                    rocketName: "$rocketData.name",
                    year: "$_id.year",
                    count: 1,
                },
            },
        ];
        const rocketUsageByYear = yield collection
            .aggregate(rocketUsageByYearPipeline)
            .toArray();
        // Retorna estatísticas
        res.status(200).json({
            rocketUsageByYear,
            rocketCountReused,
            rocketUsage,
            successFailure: successFailure[0] || { successes: 0, failures: 0 },
            successFailureByYear,
        });
    }
    catch (error) {
        // Em caso de erro, retorna mensagem de erro formatada
        res.status(400).json({ message: 'Erro ao buscar estatísticas de lançamento' });
    }
}));
// Função para escapar caracteres especiais em uma string para uso em uma expressão regular
function escapeRegExp(input) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
// Rota padrão
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Fullstack Challenge🏅 - Space X API' });
});
exports.default = router;
