#!/bin/bash

sudo apt update -y

sudo apt upgrade -y

# Install nodejs and npm
sudo apt install nodejs -y
sudo apt install npm -y

# Install MongoDB
sudo apt-get install gnupg
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

sudo apt-get update

sudo apt-get install -y mongodb-org
# Change permission settings
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown mongodb:mongodb /tmp/mongodb-27017.sock
# Start MongoDB on system reboot
sudo systemctl enable mongod
# Start MongoDB
sudo systemctl start mongod