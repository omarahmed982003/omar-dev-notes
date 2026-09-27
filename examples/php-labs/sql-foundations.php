<?php
declare(strict_types=1);
$db = new PDO('sqlite::memory:', options: [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$db->exec('PRAGMA foreign_keys=ON');
$db->exec(<<<'SQL'
CREATE TABLE learners (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE attempts (
    id INTEGER PRIMARY KEY,
    learner_id INTEGER NOT NULL REFERENCES learners(id),
    score INTEGER NOT NULL CHECK(score BETWEEN 0 AND 100)
);
INSERT INTO learners VALUES (1, 'Omar'), (2, 'Mona'), (3, 'Ali');
INSERT INTO attempts VALUES (1, 1, 80), (2, 1, 100), (3, 2, 60);
SQL);
$rows = $db->query(<<<'SQL'
SELECT l.id, l.name, COUNT(a.id) AS attempts, AVG(a.score) AS average
FROM learners AS l
LEFT JOIN attempts AS a ON a.learner_id = l.id
GROUP BY l.id, l.name
ORDER BY l.id;
SQL)->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($rows, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR), PHP_EOL;
