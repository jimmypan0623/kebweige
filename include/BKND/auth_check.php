 <?php 
 // 1. 啟動 Session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 2. 嚴格身分驗證
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(array('error' => '未登入或登入逾期'));
    exit;
}  
?>