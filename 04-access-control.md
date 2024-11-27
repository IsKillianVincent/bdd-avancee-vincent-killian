# 04-access-control

### App user
```SQL
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'password123';
GRANT EXECUTE ON Blog.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
```

### JeAdmin
```SQL
CREATE USER 'jeadmin'@'localhost' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON Blog.* TO 'jeadmin'@'localhost';
FLUSH PRIVILEGES;
```

### LeStagiaire
```SQL
CREATE USER 'lestagiaire'@'192.160.0.34' IDENTIFIED BY 'readonly';
GRANT SELECT ON Blog.* TO 'lestagiaire'@'192.160.0.34';
FLUSH PRIVILEGES;
```

### DumpUser
```SQL
CREATE USER 'dumb_user'@'localhost' IDENTIFIED BY 'dummy123';
GRANT EXECUTE ON PROCEDURE Blog.is_top_author TO 'dumb_user'@'localhost';
FLUSH PRIVILEGES;
```

### Visualization
```SQL
SHOW GRANTS FOR 'app_user'@'localhost';
SHOW GRANTS FOR 'jeadmin'@'localhost';
SHOW GRANTS FOR 'lestagiaire'@'192.160.0.34';
SHOW GRANTS FOR 'dumb_user'@'localhost';
```

