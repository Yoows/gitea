#!/bin/bash
apt-get update -y
apt-get install -y rabbitmq-server nodejs npm postgresql
systemctl start rabbitmq-server
sudo -u postgres psql -c "CREATE DATABASE billing_db;"
mkdir -p /vagrant/billing-app
cd /vagrant/billing-app
npm install pg amqplib dotenv
