# 03-Prog

### Une fonction fullname_short qui prend en paramètre deux chaines de caractères (un prénom et un nom) et qui retourne une chaine de caractères composée de la première lettre du prénom en majuscule puis un point puis un espace puis le nom le famille avec la première lettre en majuscule. 
 
> Ex:
> fullname_short("STEVE", "CARELL") => "S. Carell"
```SQL
DELIMITER $$

CREATE FUNCTION fullname_short(first_name VARCHAR(50), last_name VARCHAR(50))
RETURNS VARCHAR(100)
DETERMINISTIC
BEGIN
    RETURN CONCAT(UPPER(SUBSTRING(first_name, 1, 1)), '. ', CONCAT(UPPER(SUBSTRING(last_name, 1, 1)), LOWER(SUBSTRING(last_name, 2))));
END $$

DELIMITER ;
```
```SQL
SELECT fullname_short(a.first_name, a.last_name) AS Shortname
FROM authors a;
```


### Une procédure stockée last_post_from_author qui prend en paramètre un id d'auteur et qui retourne le dernier post de cet auteur.
```SQL
DELIMITER $$

CREATE PROCEDURE last_post_from_author(IN author_id INT)
BEGIN
    SELECT 
        id AS post_id, 
        title, 
        description, 
        content, 
        date 
    FROM 
        posts 
    WHERE 
        author_id = author_id
    ORDER BY 
        date DESC
    LIMIT 1;
END $$

DELIMITER ;
```
```SQL
CALL last_post_from_author(1);
```

### Une procédure stockée is_top_author qui prend en paramètre l'id d'un auteur et retourne un booléen. Ce booléen sera à vrai si cet auteur fait partie des 5 auteurs les plus prolifiques.
```SQL
DELIMITER $$

CREATE PROCEDURE is_top_author(IN author_id INT, OUT is_top TINYINT(1))
BEGIN
    DECLARE author_rank INT;

    SELECT 
        COUNT(*) 
    INTO 
        author_rank
    FROM (
        SELECT 
            a.id, COUNT(p.id) AS post_count
        FROM 
            authors a
        LEFT JOIN 
            posts p ON a.id = p.author_id
        GROUP BY 
            a.id
        ORDER BY 
            post_count DESC
        LIMIT 5
    ) AS top_authors
    WHERE id = author_id;

    IF author_rank > 0 THEN
        SET is_top = TRUE;
    ELSE
        SET is_top = FALSE;
    END IF;
END $$

DELIMITER ;
```
```SQL
CALL is_top_author(3, @is_top);
SELECT @is_top;
```

### Un trigger d'historisation des posts qui lors d'une suppression remplira une table deleted_posts avec les infos des posts supprimés.
```SQL
CREATE TABLE deleted_posts (
    id INT NOT NULL,
    author_id INT NOT NULL,
    title VARCHAR(255),
    description VARCHAR(500),
    content TEXT,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$

CREATE TRIGGER posts_after_delete
AFTER DELETE ON posts
FOR EACH ROW
BEGIN
    INSERT INTO deleted_posts (id, author_id, title, description, content, deleted_at)
    VALUES (OLD.id, OLD.author_id, OLD.title, OLD.description, OLD.content, NOW());
END $$

DELIMITER ;
```

### Un (des) trigger(s) de journalisation des actions sur les auteurs. Qui viendra peupler un table authors_logs qui fera état des insertions, modifications et suppressions de la table authors, avec l'ID de l'utilisateur de base de donnée qui a initié les changements.
```SQL
CREATE TABLE authors_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    action_type ENUM('INSERT', 'UPDATE', 'DELETE'),
    author_id INT,
    old_first_name VARCHAR(50),
    old_last_name VARCHAR(50),
    new_first_name VARCHAR(50),
    new_last_name VARCHAR(50),
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    executed_by_user VARCHAR(100)
);

DELIMITER $$

CREATE TRIGGER authors_after_insert
AFTER INSERT ON authors
FOR EACH ROW
BEGIN
    INSERT INTO authors_logs (action_type, author_id, new_first_name, new_last_name, executed_by_user)
    VALUES ('INSERT', NEW.id, NEW.first_name, NEW.last_name, USER());
END $$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER authors_after_update
AFTER UPDATE ON authors
FOR EACH ROW
BEGIN
    INSERT INTO authors_logs (action_type, author_id, old_first_name, old_last_name, new_first_name, new_last_name, executed_by_user)
    VALUES ('UPDATE', OLD.id, OLD.first_name, OLD.last_name, NEW.first_name, NEW.last_name, USER());
END $$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER authors_after_delete
AFTER DELETE ON authors
FOR EACH ROW
BEGIN
    INSERT INTO authors_logs (action_type, author_id, old_first_name, old_last_name, executed_by_user)
    VALUES ('DELETE', OLD.id, OLD.first_name, OLD.last_name, USER());
END $$

DELIMITER ;
```