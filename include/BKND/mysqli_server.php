 <?php 
 // 避免重複定義，確保系統穩定
 if (!isset($link)) {
    // 1. 建立連線
    $link = @mysqli_connect('localhost', 'root', 'To6035376615004513834', 'tkdata');
    
    // 2. 檢查連線
    if (!$link) {
		header('Content-Type: application/json');
        // 在正式環境建議記錄在 Log，而不是直接 echo 噴在畫面上
        error_log("DB Connection Error: " . mysqli_connect_error());
        die("系統維護中，請稍後再試。"); 
    }
    
    // 3. 設定正確的編碼 (推薦方式)
    mysqli_set_charset($link, 'utf8');
}  
?>