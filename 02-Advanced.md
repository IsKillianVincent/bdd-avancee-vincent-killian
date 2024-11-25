
# 02-Advanced

### Nombre de posts par auteur
```
SELECT 
	a.first_name, 
	a.last_name, 
	COUNT(p.id) AS post_count
FROM 
	authors a
LEFT JOIN 
	posts p 
ON 
	a.id = p.author_id
GROUP BY 
	a.id;
```

### Nombre de post moyen par auteur
```
SELECT 
	AVG(post_count) AS average_posts_per_author
FROM (
    SELECT 
		COUNT(p.id) AS post_count
    FROM 
		authors a
    LEFT JOIN 
		posts p 
    ON 
        a.id = p.author_id
    GROUP BY 
		a.id
) AS post_counts;
```

### Liste des auteurs (nom et prenom) dont les posts sont supérieurs à 10 avec la clause having
```
SELECT 
    a.first_name, 
    a.last_name
FROM 
    authors a
LEFT JOIN 
    posts p 
ON 
    a.id = p.author_id
GROUP BY 
    a.id
HAVING 
    COUNT(p.id) > 10;
```

### Liste des auteurs (nom et prenom) dont les posts sont supérieurs à 10 avec une sous-requête
```
SELECT 
    a.first_name, 
    a.last_name
FROM 
    authors a
WHERE (
    SELECT 
        COUNT(p.id)
    FROM 
        posts p
    WHERE 
        p.author_id = a.id
) > 10;
```

### Liste des auteurs qui ont créé plus de post que la moyenne.
```
SELECT 
    a.first_name, 
    a.last_name
FROM 
    authors a
LEFT JOIN 
    posts p 
ON 
    a.id = p.author_id
GROUP BY 
    a.id
HAVING 
    COUNT(p.id) > (
    SELECT 
        AVG(post_count)
    FROM (
        SELECT 
            COUNT(p.id) AS post_count
        FROM 
            authors a
        LEFT JOIN 
            posts p 
        ON 
            a.id = p.author_id
        GROUP BY 
            a.id
    ) AS post_counts
);
```

### Liste des 5 auteurs ayant créé le plus de posts, triés par nombre de posts. (*Bonus*)
```
SELECT 
    a.first_name, 
    a.last_name, 
    COUNT(p.id) AS post_count
FROM 
    authors a
LEFT JOIN 
    posts p 
ON 
    a.id = p.author_id
GROUP BY 
    a.id
ORDER BY 
    post_count DESC
LIMIT 5;
```

### Liste des posts et de leurs auteurs pour chaque post, en tenant compte du nombre de posts des auteurs. (*Bonus*)
```
SELECT 
    p.title, 
    p.description, 
    a.first_name, 
    a.last_name, 
    COUNT(p.id) 
        OVER (PARTITION BY a.id) AS author_post_count
FROM 
    posts p
JOIN 
    authors a 
ON 
    p.author_id = a.id
ORDER BY 
    author_post_count DESC;
```

### Liste des auteurs ayant écrit des posts dans toutes les années depuis leur première publication. (*Bonus*)
```
SELECT 
    a.first_name, 
    a.last_name
FROM 
    authors a
JOIN 
    posts p 
ON 
    a.id = p.author_id
WHERE 
    NOT EXISTS (
        SELECT 
            1
        FROM 
            posts p2
        WHERE 
            p2.author_id = a.id
        AND 
            YEAR(p2.date) < YEAR(p.date)
    )
GROUP BY 
    a.id;
```
