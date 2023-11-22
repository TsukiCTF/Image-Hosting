# Image-Hosting
Full-stack project for an image hosting web server. It runs on Node.js and uses the Express.js framework, along with a separate MySQL server for storing, serving, and managing images. The Pug template engine is used to serve web pages to the browser.

## Main Features
- Anonymous image upload
- User registration, login, logout system
- View personal profile page with photo gallery for registered users
- Ability to delete images for registered users
- Security measures such as Captcha and anti-CSRF token
- Docker-compose support

## Easy Install
Clone this repository:
```bash
git clone https://github.com/TsukiCTF/Image-Hosting.git
cd Image-Hosting
```

Change `.env` file to configure deployment settings:
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

Execute `start.sh` script to start docker containers:
```
sh ./start.sh
```

Go visit the web page (e.g., http://localhost:3000) and try to upload an image!

## Contributing
All contributions are welcome!


[1]: https://www.google.com/recaptcha/admin/create
[2]: https://app.diagrams.net/
