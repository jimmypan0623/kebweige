 <?php 
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(array('error' => '未登入或登入逾期'));
    exit;
}  
?>