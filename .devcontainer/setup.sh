#!/bin/bash
set -e
echo ">>> Instalando MySQL..."
sudo apt-get update -q
sudo apt-get install -y mysql-server
echo ">>> Iniciando MySQL..."
sudo service mysql start
echo ">>> Criando banco..."
sudo mysql -u root <<SQL
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
CREATE DATABASE IF NOT EXISTS atestados_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SQL
echo ">>> Instalando dependências do backend..."
cd /workspaces/TCC-AtestadosMedicos/backend && npm install
echo ">>> Copiando .env..."
cp /workspaces/TCC-AtestadosMedicos/.devcontainer/.env.codespaces /workspaces/TCC-AtestadosMedicos/backend/.env
echo ">>> Rodando migrations..."
npx prisma migrate deploy
echo ">>> Instalando dependências do frontend..."
cd /workspaces/TCC-AtestadosMedicos/frontend && npm install
echo ">>> Pronto."
