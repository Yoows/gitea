#!/bin/bash
echo "export INVENTORY_SERVICE_URL=${INVENTORY_SERVICE_URL}" >> /etc/profile
echo "export RABBITMQ_URL=${RABBITMQ_URL}" >> /etc/profile
echo "export BILLING_QUEUE=${BILLING_QUEUE}" >> /etc/profile
echo "export PORT=${PORT}" >> /etc/profile
export INVENTORY_SERVICE_URL="$INVENTORY_SERVICE_URL"
export RABBITMQ_URL="$RABBITMQ_URL"
export BILLING_QUEUE="$BILLING_QUEUE"
export PORT="$PORT"
sudo apt-get update -y
sudo apt-get install -y nodejs npm
sudo apt install rabbitmq-server -y
sudo npm install pm2 -g

sudo systemctl enable rabbitmq-server
sudo systemctl start rabbitmq-server

cd /apps/api-gateway

sudo npm install
pm2 start server.js