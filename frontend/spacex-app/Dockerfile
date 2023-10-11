# Use uma imagem base que inclua o Node.js
FROM node:16

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o arquivo package.json e o arquivo package-lock.json (se existir)
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie todos os arquivos do diretório atual para o diretório de trabalho no contêiner
COPY . .

# Construa o aplicativo React para produção
RUN npm run build

# Comando para iniciar o servidor da sua aplicação (pode variar dependendo do seu projeto)
CMD ["npm", "start"]
