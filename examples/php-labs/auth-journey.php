<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
// Local in-memory reference flow. No mail is sent and no credentials are logged.
$db = Lessons\connectInventory(); Lessons\initializeInventory($db);
$db->exec('ALTER TABLE users ADD COLUMN password_hash TEXT');
$db->exec('CREATE TABLE login_sessions (token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), expires_at INTEGER NOT NULL)');
$db->exec('CREATE TABLE password_resets (token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), expires_at INTEGER NOT NULL)');
$now = 1800000000;
$hash = password_hash('lesson-only-passphrase', PASSWORD_DEFAULT);
$db->prepare('UPDATE users SET password_hash=? WHERE id=1')->execute([$hash]);
function requireCheck(bool $valid): void { if (!$valid) throw new RuntimeException('Journey check failed'); }
function login(PDO $db, int $id, string $password, int $now): ?string {
    $query=$db->prepare('SELECT password_hash FROM users WHERE id=?'); $query->execute([$id]);
    $hash=$query->fetchColumn();
    if (!is_string($hash) || !password_verify($password,$hash)) return null;
    $token=bin2hex(random_bytes(32));
    $db->prepare('INSERT INTO login_sessions VALUES(?,?,?)')->execute([hash('sha256',$token),$id,$now+900]);
    return $token;
}
function sessionUser(PDO $db, string $token, int $now): ?int {
    $query=$db->prepare('SELECT user_id FROM login_sessions WHERE token_hash=? AND expires_at>?');
    $query->execute([hash('sha256',$token),$now]); $id=$query->fetchColumn();
    return $id===false ? null : (int)$id;
}
function resetPassword(PDO $db, string $token, string $password, int $now): bool {
    // Deliberately tiny demonstration policy; production also needs breached-password checks.
    if (strlen($password)<15 || strlen($password)>64) throw new InvalidArgumentException('Password length');
    $hash=password_hash($password,PASSWORD_DEFAULT);
    $db->beginTransaction();
    try {
        $consume=$db->prepare('DELETE FROM password_resets WHERE token_hash=? AND expires_at>? RETURNING user_id');
        $consume->execute([hash('sha256',$token),$now]); $id=$consume->fetchColumn(); $consume->closeCursor();
        if ($id===false) { $db->rollBack(); return false; }
        $db->prepare('UPDATE users SET password_hash=? WHERE id=?')->execute([$hash,$id]);
        $db->prepare('DELETE FROM login_sessions WHERE user_id=?')->execute([$id]);
        $db->prepare('DELETE FROM password_resets WHERE user_id=?')->execute([$id]);
        $db->commit(); return true;
    } catch (Throwable $error) { if($db->inTransaction())$db->rollBack(); throw $error; }
}
requireCheck(login($db,1,'wrong',$now)===null);
$session=login($db,1,'lesson-only-passphrase',$now);
requireCheck(is_string($session));
$user=sessionUser($db,$session,$now); requireCheck($user===1);
requireCheck(sessionUser($db,$session,$now+901)===null);
$order=Lessons\purchase($db,'journey-order',$user,1,2);
$duplicate=Lessons\purchase($db,'journey-order',$user,1,2);
requireCheck($duplicate['order_id']===$order['order_id'] && $duplicate['duplicate']);
$read=$db->prepare('SELECT id FROM orders WHERE id=? AND user_id=?');
$read->execute([$order['order_id'],2]); requireCheck($read->fetchColumn()===false);
// Simulate delivery over a separate trusted channel by keeping the raw token in memory.
$reset=bin2hex(random_bytes(32));
$db->prepare('INSERT INTO password_resets VALUES(?,?,?)')->execute([hash('sha256',$reset),1,$now+300]);
requireCheck(resetPassword($db,$reset,'a different lesson passphrase',$now));
requireCheck(!resetPassword($db,$reset,'a different lesson passphrase',$now));
requireCheck(sessionUser($db,$session,$now)===null);
requireCheck(login($db,1,'lesson-only-passphrase',$now)===null);
requireCheck(is_string(login($db,1,'a different lesson passphrase',$now)));
requireCheck((int)$db->query('SELECT COUNT(*) FROM outbox')->fetchColumn()===1);
echo "auth-journey: login, expiry, ownership, duplicate, reset, revocation = PASS\n";
fwrite(STDERR,json_encode(['timestamp'=>gmdate(DATE_ATOM,$now),'level'=>'info','request_id'=>'local-journey','message'=>'password reset completed','user_id'=>1],JSON_THROW_ON_ERROR).PHP_EOL);
