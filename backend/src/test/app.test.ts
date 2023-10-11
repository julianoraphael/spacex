import request from 'supertest';
import app from '../main'; 

describe('Testes das Rotas', () => {
    it('Deve responder com status 200 na rota padrão', async () => {
      const response = await request(app).get('/');
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Fullstack Challenge🏅 - Space X API');
    });

    it('Deve responder com status 404 em uma rota inexistente', async () => {
        const response = await request(app).get('/rota-inexistente');
        expect(response.status).toBe(404);
     
      });
});
