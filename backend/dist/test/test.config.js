"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestAppConfigLoader = void 0;
class TestAppConfigLoader {
    static getDbUrl() {
        return 'mongodb://localhost:27017/testdb';
    }
    static getPort() {
        return 3000;
    }
}
exports.TestAppConfigLoader = TestAppConfigLoader;
