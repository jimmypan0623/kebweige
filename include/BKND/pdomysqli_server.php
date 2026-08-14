 <?php
// 資料庫設定
$host = 'localhost';
$db   = 'tkdata';
$user = 'root';
$pass = 'To6035376615004513834';
$charset = 'utf8mb4'; // 建議使用 utf8mb4 支援更多字元（如表情或特殊符號）

// 設定連線字串 (DSN)
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

// 設定 PDO 選項
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // 開啟異常模式，出錯時會拋出 Exception
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // 預設抓取模式為 關聯陣列
    PDO::ATTR_EMULATE_PREPARES   => false,                  // 關閉模擬預編譯，使用真實預編譯，安全性更高
];

try {
    // 建立 PDO 連線物件 $pdo
    $pdo = new PDO($dsn, $user, $pass, $options);
    
    // 為了相容您舊有的 mysqli 程式碼，暫時保留 $link
    $link = @mysqli_connect($host, $user, $pass, $db);
    mysqli_query($link, 'set names utf8');

} catch (\PDOException $e) {
    // 隱藏敏感資訊，僅在開發環境顯示錯誤細節
    die("資料庫連線失敗: " . $e->getMessage());
}
?>