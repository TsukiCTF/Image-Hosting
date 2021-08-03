# Image-Hosting
*Full-stack project for image hosting web server! It runs on Node.js and uses Express.js framework along with a seperate MySQL server for storing, serving and controlling images. PUG template engine is used for serving web pages to the browser.*

## Main Features
- Anonymous image upload
- User registration, login, logout system
- View images uploaded for registered users

## Install
First, clone this repository to your machine:
```bash
git clone https://github.com/TsukiCTF/Image-Hosting.git
cd Image-Hosting
```
Install Node.js dependencies:
```
npm instasll
```
Then, set up a MySQL server running on port 3306 with following database and tables:
```SQL
CREATE DATABASE Image_hosting;
Use Image_hosting;

CREATE TABLE Users (
        id INT AUTO_INCREMENT,
        email VARCHAR(100),
        name VARCHAR(100),
        password VARCHAR(255),
        PRIMARY KEY (id)
);

CREATE TABLE Images (
        id INT AUTO_INCREMENT,
        user_id INT,
        file_name VARCHAR(100),
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES Users(id)
);
```
Change .env file depending on your configuration:
```
DB_NAME = Image_hosting
DB_HOST = localhost
DB_USER = nodejs
DB_PASS = YOUR_DATABASE_PASSWORD
JWT_SECRET = YOUR_JWT_SECRET
JWT_EXPIRES_IN = 7d
JWT_COOKIE_EXPIRES = 7
```
Finally, run the web server!
```
node app.js
```
Go to http://localhost:3000/ and try to upload an image!

## Contributing
All contributions are welcome!
