#!/bin/bash

# Define a URL da API SpaceX
url="https://api.spacexdata.com/v5/launches/"

# Obter a data atual no formato YYYY-MM-DD
data=$(date "+%Y-%m-%d")

# Define o nome do arquivo com a data e a extensão JSON
nome_arquivo="spacex_launches_$data.json"

# Usar o curl para fazer o pedido e salvar a saída em um arquivo JSON
curl -s "$url" > "$nome_arquivo"

# Verifica se a solicitação foi bem-sucedida (código de status 200)
if [ $? -eq 0 ]; then
    echo "Os dados da SpaceX foram salvos em $nome_arquivo"
else
    echo "Falha ao recuperar os dados da SpaceX"
fi
