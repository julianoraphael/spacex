# SpaceX API - Documentação

Esta é a documentação da aplicação SpaceX API, que fornece informações sobre os lançamentos da SpaceX e estatísticas relacionadas. A aplicação possui rotas para listar lançamentos, obter estatísticas e uma rota padrão com uma mensagem de boas-vindas.

## Estrutura de Diretórios

O projeto possui a seguinte estrutura de diretórios:

- `backend/`: Contém o código-fonte do servidor da aplicação.
- `frontend/`: Contém o código-fonte da parte frontend da aplicação.

## Frontend

### Instalação

Siga as instruções abaixo para configurar e executar o frontend da aplicação. Importante, o backend precisa estar sendo executado para que o Frontend funcione.

Neste cenário de teste, está configurado apenas um cenário local, onde o backend responde em http://localhost:3000 e o frontend em http://localhost:3001

1. Acesse o diretório `frontend`:

```
cd frontend
```

2. Certifique-se de usar o Node.js versão 16. Se estiver usando o `nvm`, você pode instalar e usar a versão 16 com os seguintes comandos:

```
nvm install 16
nvm use 16
```

3. Instale as dependências:

```
npm install
```

### Inicialização

A aplicação pode ser iniciada de duas maneiras: diretamente com o npm ou usando Docker.

#### Iniciar com Node.js

Para iniciar a aplicação diretamente com o Node.js, execute o seguinte comando no diretório `frontend/spacex-app`:

```
npm start
```

#### Iniciar com Docker

Para iniciar a aplicação com Docker, siga as etapas abaixo, no mesmo diretório `frontend/spacex-app`:

1. Construa a imagem Docker:

```
docker build -t spacex-frontend .
```

2. Execute o contêiner Docker:

```
docker run -p 3001:3000 spacex-frontend
```

