#!/bin/bash
apt-get update -y
apt-get install -y nodejs npm postgresql
systemctl start postgresql
sudo -u postgres psql -c "CREATE DATABASE movies_db;"
mkdir -p /vagrant/inventory-app
cd /vagrant/inventory-app
npm install express pg dotenv sequelize
