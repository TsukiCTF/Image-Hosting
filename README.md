# Image-Hosting
*Full-stack project for image hosting web server! It runs on Node.js and uses Express.js framework along with a seperate MySQL server for storing, serving and controlling images. Pug template engine is used for serving web pages to the browser.*

## Main Features
- Anonymous image upload
- User registration, login, logout system
- View personal profile page with photo gallery for registered users
- Ability to delete images for registered users
- Security measures such as Captcha and anti-CSRF token

## System Architecture
Current system architecture of **fully deployed** version of this project is depicted as below (created with [draw.io][2])

![image](https://user-images.githubusercontent.com/32463233/130900465-b1dd185b-e1e7-4216-b876-3e327a3a09ce.png)

## Install
First, clone this repository to your machine:
```bash
git clone https://github.com/TsukiCTF/Image-Hosting.git
cd Image-Hosting
```
Install Node.js dependencies:
```bash
npm install 
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
DB_PASS = YOUR_DB_PASSWORD
JWT_SECRET = YOUR_JWT_SECRET
JWT_EXPIRES_IN = 7d
JWT_COOKIE_EXPIRES = 7
NODE_ENV = production
PORT = 3000
```
Modify below to your configuration (*you can generate reCAPTCHA v2 keys from [here][1]*):
- FQDN variable in /routes/helpers/pagesUtil.js
- Captcha secret in /controllers/auth.js
- Captcha data-sitekey in /views/login.pug

Finally, run the web server!
```
node app.js
```
Go to http://localhost:3000/ and try to upload an image!

## Contributing
All contributions are welcome!


[1]: https://www.google.com/recaptcha/admin/create
[2]: https://app.diagrams.net/
