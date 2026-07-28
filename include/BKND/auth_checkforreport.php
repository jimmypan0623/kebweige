<?php 
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 檢查 Session（請確認 key 名稱是否與登入頁設定的一致）
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    // 1. 如果是 AJAX 請求，才回傳 JSON
    if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
        header('HTTP/1.1 401 Unauthorized');
        echo json_encode(array('error' => '未登入或登入逾期'));
        exit;
    } else {
        // 2. 一般網頁或 PDF 請求，直接導頁至登入頁（請依實際登入頁路徑修改）
        header('Location: ../../index.html');
        exit;
    }
}  
?>