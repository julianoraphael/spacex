# SpaceX API - Documentação

Esta é a documentação da aplicação SpaceX API, que fornece informações sobre os lançamentos da SpaceX e estatísticas relacionadas. A aplicação possui rotas para listar lançamentos, obter estatísticas e uma rota padrão com uma mensagem de boas-vindas.

## Estrutura de Diretórios

O projeto possui a seguinte estrutura de diretórios:

- `backend/`: Contém o código-fonte do servidor da aplicação.
- `frontend/`: (Caso exista) Contém o código-fonte da parte frontend da aplicação.

## Backend

### Instalação

Siga as instruções abaixo para configurar e executar o backend da aplicação.

1. Acesse o diretório `backend`:

```
cd backend
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

4. Compile a aplicação (se necessário):

```
npm run build
```

### Inicialização

A aplicação pode ser iniciada de duas maneiras: diretamente com o Node.js ou usando Docker.

#### Iniciar com Node.js

Para iniciar a aplicação diretamente com o Node.js, execute o seguinte comando no diretório `backend`:

```
npm start
```

#### Iniciar com Docker

Para iniciar a aplicação com Docker, siga as etapas abaixo:

1. Construa a imagem Docker:

```
docker build -t spacex .
```

2. Execute o contêiner Docker:

```
docker run -p 3000:3000 spacex
```

### Configurações

As configurações da aplicação e do banco de dados estão definidas no arquivo `backend/local.config.yaml`. Você pode usar esse arquivo para configurar diferentes ambientes para a aplicação, como QA, Dev e Prod.

## Rotas

A aplicação possui as seguintes rotas:

- `/`: Rota padrão que retorna a seguinte mensagem: "Fullstack Challenge🏅 - Space X API".

- `/launches`: Rota que lista os lançamentos da SpaceX com suporte a paginação e filtros. Os parâmetros disponíveis são:

- `limit`: Limite de resultados por página (use 'all' para todos os resultados).
- `page`: Número da página a ser exibida.
- `success`: Filtrar por sucesso (true/false).
- `name`: Filtrar por nome (insensível a maiúsculas/minúsculas).

Exemplo de pesquisa por nome:
/launches?name=Falcon

Exemplo de pesquisa com limite e página:
/launches?limit=10&page=2

/launches/stats: Rota que fornece estatísticas sobre os lançamentos da SpaceX.

