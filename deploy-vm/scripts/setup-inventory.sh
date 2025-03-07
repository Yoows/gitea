#!/bin/bash
sudo apt-get update -y
sudo apt-get install -y nodejs npm postgresql
sudo systemctl start postgresql
sudo -u postgres psql -c "CREATE DATABASE movies_db;"
sudo -u postgres psql -c "create user inventory with encrypted password 'inventory';"
sudo -u postgres psql -c "ALTER ROLE inventory SUPERUSER;"
sudo -u postgres psql -c "grant all privileges on database movies_db to inventory ;"
cd /apps/inventory-app
sudo npm install
sudo node app/models/sync.js 
sudo node server.js