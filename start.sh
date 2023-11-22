#!/bin/sh
set -e

echo "Preparing init-db.sql script..."
DB_NAME=$(grep DB_NAME .env | cut -d '=' -f2 | sed 's/^[ \t]*//;s/[ \t]*$//') # remove leading and trailing whitespaces
sed -i "s/__DB_NAME__/$DB_NAME/g" mysql-init/init-db.sql

echo "Installing node dependencies..."
npm install

echo "Starting the Docker containers..."
docker-compose up -d
