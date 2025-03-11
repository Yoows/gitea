#!/bin/bash
sudo apt-get update -y
sudo apt-get install -y nodejs npm
sudo apt install rabbitmq-server -y

sudo systemctl enable rabbitmq-server
sudo systemctl start rabbitmq-server

cd /apps/api-gateway
sudo npm install pm2 -g
sudo npm install
sudo pm2 start server.js