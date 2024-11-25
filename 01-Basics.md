
# 01-Basics

### Selectionner toutes les classes et afficher le libellé de celle-ci.
```
SELECT 
    classe_libelle_court AS Libelle court, 
    classe_libelle_long AS Libelle long 
FROM 
    classe;
```

### Selectionner toutes les classes dont le titre professionnel est CDA.
```
SELECT 
    *
FROM 
    classe c
JOIN 
    titre_professionnel tp 
ON 
    c.titre_professionnel_id = tp.titre_professionnel_id
WHERE 
    tp.titre_professionnel_libelle = 'CDA';
```

### Selectionner toutes les classes qui n'ont pas de titre professionnel lié.
```
SELECT 
    *
FROM 
    classe
WHERE 
    c.titre_professionnel_id IS NULL;
```

### Selectionner touts les titres professionnels qui n'ont pas de classe liée.
```
SELECT 
    tp.titre_professionnel_libelle
FROM 
    titre_professionnel tp
LEFT JOIN 
    classe c 
ON 
    tp.titre_professionnel_id = c.titre_professionnel_id

WHERE c.titre_professionnel_id IS NULL;
```

### Selectionner tous les tous les tuteurs (Nom et prénom) dont les étudiants sont en CDA
```
SELECT DISTINCT 
    t.tuteur_nom, 
    t.tuteur_prenom
FROM 
    tuteur t
JOIN 
    etudiant e 
ON 
    t.tuteur_id = e.tuteur_id
JOIN 
    integrer i 
ON 
    e.etudiant_id = i.etudiant_id
JOIN 
    classe c 
ON 
    i.classe_code = c.classe_code
JOIN 
    titre_professionnel tp 
ON 
    c.titre_professionnel_id = tp.titre_professionnel_id
WHERE 
    tp.titre_professionnel_libelle = 'CDA';
```