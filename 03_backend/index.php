<?php

define('DB_HOST', 'db-group1.crhso94tou3n.eu-west-2.rds.amazonaws.com');
define('DB_USER', 'postgres');
define('DB_PASS', 'p5my2ndc684k7zw84k7zw!Cariniliapippr2t0qdni6md');
define('DB_NAME', 'postgres');

try {
    $dbHandle = new PDO('pgsql:host=' .DB_HOST .'; dbname=' .DB_NAME, DB_USER, DB_PASS);
} catch (PDOException $e) {
    echo "Failed to connect to db!";
    die();
}

$S_get_pred = $dbHandle->prepare("SELECT * FROM sbb.prediction WHERE date > ? ORDER BY date ASC LIMIT 12");
$S_get_pred->execute(array(htmlentities($_GET['date'])));

$data = $S_get_pred->fetchAll(PDO::FETCH_ASSOC);
$payload = array();

// time is hard coded as this information was lost when importing.
$time = 13;

foreach ($data as $value) {
    array_push($payload, array("date" => $value['date'] ." " .$time .":00", "occupancy" => $value['occupancy_rate']));
    $time += 1;
}

header('Content-Type: application/json');
echo json_encode($payload);

?>