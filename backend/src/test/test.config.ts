export class TestAppConfigLoader {
    static getDbUrl(): string {
      return 'mongodb://localhost:27017/testdb'; 
    }
  
    static getPort(): number {
      return 3000; 
    }
  }
  