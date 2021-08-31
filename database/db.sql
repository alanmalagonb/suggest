CREATE DATABASE dblinks;

USE dblinks;

-- TABLE STATUS

create TABLE status(
    id INT(11) NOT NULL AUTO_INCREMENT,
    concept VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO status(concept) values("En espera");
INSERT INTO status(concept) values("Aceptada");
INSERT INTO status(concept) values("Denegada");

-- TABLE SUGGESTIONS
create TABLE links(
    id INT(11) NOT NULL AUTO_INCREMENT,
    title VARCHAR(2000) NOT NULL,
    body VARCHAR(2000) NOT NULL,
    player_id MEDIUMINT(8) unsigned NOT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    status_id INT(11) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    FOREIGN KEY (status_id) REFERENCES status(id) ON UPDATE CASCADE ON DELETE NO ACTION
);

-- TABLE IMAGES

create TABLE images(
    player_id MEDIUMINT(8) unsigned NOT NULL PRIMARY KEY,
    filename VARCHAR(2000) NOT NULL,
    nick VARCHAR(50) NOT NULL 
);

-- TABLE COMMENTS

create TABLE comments(
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    text VARCHAR(2000) NOT NULL,
    links_id INT(11) NOT NULL,
    player_id MEDIUMINT(8) unsigned NOT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    FOREIGN KEY (links_id) REFERENCES links(id) ON UPDATE CASCADE ON DELETE CASCADE
);

create TABLE reply(
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    text VARCHAR(2000) NOT NULL,
    comment_id INT(11) NOT NULL,
    player_id MEDIUMINT(8) unsigned NOT NULL,
    reply_id INT(11),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (reply_id) REFERENCES reply(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- TABLE ADMIN

create TABLE admin(
    id INT(11) NOT NULL AUTO_INCREMENT,
    realname VARCHAR(25) NOT NULL,
    PRIMARY KEY (id)
);

create TABLE votingType(
    id INT(1) NOT NULL,
    concept VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO votingType(id,concept) values(1,"Like");
INSERT INTO votingType(id,concept) values(-1,"Dislike");

create TABLE votingSuggest(
    id INT(11) NOT NULL AUTO_INCREMENT,
    player_id MEDIUMINT(8) unsigned NOT NULL,
    suggest_id INT(11) NOT NULL,
    voting_id INT(11) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (suggest_id) REFERENCES links(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (voting_id) REFERENCES votingType(id) ON UPDATE CASCADE ON DELETE NO ACTION
);

create TABLE votingComment(
    id INT(11) NOT NULL AUTO_INCREMENT,
    player_id MEDIUMINT(8) unsigned NOT NULL,
    comment_id INT(11) NOT NULL,
    voting_id INT(11) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (voting_id) REFERENCES votingType(id) ON UPDATE CASCADE ON DELETE NO ACTION
);

create TABLE votingReply(
    id INT(11) NOT NULL AUTO_INCREMENT,
    player_id MEDIUMINT(8) unsigned NOT NULL,
    reply_id INT(11) NOT NULL,
    voting_id INT(11) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (reply_id) REFERENCES reply(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (voting_id) REFERENCES votingType(id) ON UPDATE CASCADE ON DELETE NO ACTION
);

create TABLE lastlogin(
    player_id MEDIUMINT(8) unsigned NOT NULL PRIMARY KEY,
    last_con timestamp NOT NULL
);

INSERT INTO admin(realname) values("Arrow");

ALTER TABLE links CONVERT TO CHARACTER SET utf8mb4;