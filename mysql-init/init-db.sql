CREATE DATABASE IF NOT EXISTS `__DB_NAME__`; 
USE `__DB_NAME__`;

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
