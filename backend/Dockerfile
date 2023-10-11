# Use uma imagem base do Node.js (ou qualquer que você use para o seu aplicativo)
FROM node:16

# Configuração do fuso horário brasileiro (São Paulo)
RUN apt update && apt install tzdata -y
ENV TZ=America/Sao_Paulo

# Configure o diretório de trabalho no container
WORKDIR /app

# Copie o aplicativo compilado (assumindo que os arquivos estão no diretório "dist")
COPY ./dist /app/dist

# Copie o diretório tools, onde está o instalador do mongoimport, que não existe no container)
COPY ./tools /app/tools

# Copie o arquivo local.config.yaml de um diretório acima para a raiz do container
COPY local.config.yaml /app/local.config.yaml

# Copie os scripts shell para o container
COPY ./shell/data_updater.sh /app/data_updater.sh
COPY ./shell/data_uploader.sh /app/data_uploader.sh

# Copie o arquivo local.config.yaml para a raiz do container
COPY local.config.yaml /app/local.config.yaml

# Instale as dependências necessárias para as tarefas do cron
RUN apt-get update && apt-get -y install cron && apt install /app/tools/mongodb-database-tools.deb

# Instale as dependências do aplicativo (incluindo o Express)
COPY ./package.json ./package-lock.json /app/
RUN npm install

# Copie os arquivos de configuração do cron
COPY ./cronjobs /etc/cron.d/

# Dê permissão de execução aos scripts shell
RUN chmod +x /app/data_updater.sh
RUN chmod +x /app/data_uploader.sh

# Configure as tarefas do cron (executar o primeiro script todos os dias às 9 da manhã e o segundo às 9:01)
RUN crontab /etc/cron.d/cronjobs

# Exponha a porta 3001 (a mesma porta em que seu aplicativo está configurado para ouvir)
EXPOSE 3000

# Inicie o serviço cron e o aplicativo no container
CMD (cron && node dist/main.js)
