# Image-Hosting
Full-stack project for an image hosting web server! It runs on Node.js and uses the Express.js framework, along with a separate MySQL server for storing, serving, and managing images. The Pug template engine is used to serve web pages to the browser. It now supports docker-compose.

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
Change `.env` file for docker-compose:
```
# MySQL config
DB_HOST = mysql
DB_ROOT_PASS = <CHOOSE YOUR MYSQL ROOT PASSWORD>
DB_NAME = <CHOOSE YOUR MYSQL DATABASE NAME>
DB_USER = <CHOOSE YOUR MYSQL USER NAME>
DB_PASS = <CHOOSE YOUR MYSQL USER PASSWORD>

# App config
NODE_ENV = production
NODE_PORT = 3000
SERVER_URL = <CHOOSE YOUR SERVER URL>
CAPTCHA_SECRET = <PASTE YOUR CAPTCHA SECRET>
CAPTCHA_SITEKEY = <PASTE YOUR CAPTCHA SITEKEY>
JWT_SECRET = <CHOSOE YOUR JWT SECRET>
JWT_EXPIRES_IN = 7d
JWT_COOKIE_EXPIRES = 7

```

Start docker-compose:
```
docker-compose up -d --force-recreate
```
Access `mysql` container's shell and add the following tables in your database:
```SQL
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

Go visit the web page (e.g., http://localhost:3000) and try to upload an image!

## Contributing
All contributions are welcome!


[1]: https://www.google.com/recaptcha/admin/create
[2]: https://app.diagrams.net/
