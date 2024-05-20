CREATE DATABASE IF NOT EXISTS MangawebDB;
USE MangawebDB;

CREATE TABLE Manga (
    mangaID INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    author VARCHAR(255),
    title VARCHAR(255),
    published_date DATE
);


CREATE TABLE Chapter (
    mangaID INT,
    chapterNumber INT,
    all_chapter_images_folder_location VARCHAR(500),
    FOREIGN KEY (mangaID) REFERENCES Manga(mangaID),
    PRIMARY KEY(mangaID, chapterNumber)
);

CREATE TABLE Individual_Chapter_Images (
    mangaID INT,
    chapterNumber INT,
    imageNumber INT,
    imageLocation VARCHAR(500),
    PRIMARY KEY (mangaID, chapterNumber, imageNumber),
    FOREIGN KEY (mangaID, chapterNumber) REFERENCES Chapter(mangaID, chapterNumber)
);

CREATE TABLE Category (
    categoryName VARCHAR(255) PRIMARY KEY,
    description TEXT
);

CREATE TABLE MangaCategory (
    mangaID INT NOT NULL,
    categoryName VARCHAR(255) NOT NULL,
    PRIMARY KEY (mangaID, categoryName),
    FOREIGN KEY (mangaID) REFERENCES Manga(mangaID),
    FOREIGN KEY (categoryName) REFERENCES Category(categoryName)
);

create table User(
    userID INT PRIMARY KEY,
    name VARCHAR(255),
    password VARCHAR(255),
    profile_pic VARCHAR(300)
);