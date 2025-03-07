#!/bin/bash
apt-get update -y
apt-get install -y nodejs npm
mkdir -p /vagrant/gateway-app
cd /vagrant/gateway-app
npm install express axios amqplib
