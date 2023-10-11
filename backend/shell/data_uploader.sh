#!/bin/bash

# Define as informações de conexão do MongoDB
mongo_uri="mongodb+srv://julianoraphael:2QeZsvDOg6I32nHH@cluster0.ehwclk6.mongodb.net/?retryWrites=true&w=majority"
database="seu_database"  # Substitua "seu_database" pelo nome do seu banco de dados
collection="ColLaunches"

# Define o nome do arquivo JSON que contém os dados
arquivo_json="spacex_launches_$(date "+%Y-%m-%d").json"

# Use o mongoimport para inserir apenas dados que não existem na coleção
mongoimport --uri "$mongo_uri" --collection "$collection" --file "$arquivo_json" --jsonArray --upsert --upsertFields id

# Verifique se a importação foi bem-sucedida
if [ $? -eq 0 ]; then
    echo "Dados importados com sucesso para a coleção $collection no banco de dados $database"
else
    echo "Falha ao importar os dados para o MongoDB"
fi
