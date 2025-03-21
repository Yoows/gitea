#!/bin/bash
echo "export DB_NAME=${DB_NAME}" >> /etc/profile
echo "export DB_USER=${DB_USER}" >> /etc/profile
echo "export DB_PASSWORD=${DB_PASSWORD}" >> /etc/profile
echo "export DB_HOST=${DB_HOST}" >> /etc/profile
sudo apt-get update -y
sudo apt-get install -y nodejs npm postgresql
sudo npm install pm2 -g
sudo systemctl start postgresql
sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME};"
sudo -u postgres psql -c "create user ${DB_USER} with encrypted password '${DB_PASSWORD}';"
sudo -u postgres psql -c "ALTER ROLE inventory SUPERUSER;"
sudo -u postgres psql -c "grant all privileges on database ${DB_NAME} to inventory ;"
cd /apps/inventory-app
sudo npm install
 
pm2 start server.js