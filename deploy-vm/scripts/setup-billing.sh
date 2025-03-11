#!/bin/bash
sudo apt-get update -y
sudo apt-get install -y nodejs npm postgresql rabbitmq-server

sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server
sudo rabbitmq-plugins enable rabbitmq_management

sudo rabbitmqctl add_user admin admin
sudo rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
sudo rabbitmqctl set_user_tags admin administrator
sudo systemctl restart rabbitmq-server


sudo -u postgres psql -c "CREATE DATABASE billing_db;"
sudo -u postgres psql -c "CREATE USER billing WITH ENCRYPTED PASSWORD 'billing';"
sudo -u postgres psql -c "ALTER ROLE billing SUPERUSER;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE billing_db TO billing;"

sudo -u postgres psql -d billing_db -c "
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    number_of_items INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL
);"

cd /apps/billing-app
sudo npm install pm2 -g
sudo npm install
sudo pm2 start server.js
