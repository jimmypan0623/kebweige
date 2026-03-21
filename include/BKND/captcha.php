<?php
session_start();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 1;

if ($id === 1) {
    // 只有 id=1 負責重寫答案
    $characters = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ';
    $code = '';
    for ($i = 0; $i < 4; $i++) {
        $code .= $characters[mt_rand(0, strlen($characters) - 1)];
    }
    $_SESSION['captcha_code'] = $code;
    // 強制將 Session 數據寫入磁碟並鎖定解除，確保下一張圖讀到的是新的
    session_write_close(); 
} else {
    // id=2~4 僅讀取
    // 增加一個小循環，如果 Session 還沒準備好，最多等 0.3 秒
    $retry = 0;
    while (!isset($_SESSION['captcha_code']) && $retry < 3) {
        session_write_close();
        usleep(100000); // 等 0.1 秒
        session_start();
        $retry++;
    }
}

// 再次確認抓取字元
$char = isset($_SESSION['captcha_code'][$id - 1]) ? $_SESSION['captcha_code'][$id - 1] : '';


// --- 繪製邏輯開始 ---
$width = 30;
$height = 40;
$image = imagecreatetruecolor($width, $height);
$bg_color = imagecolorallocate($image, 240, 240, 240);
$text_color = imagecolorallocate($image, mt_rand(0, 100), mt_rand(0, 100), mt_rand(0, 100));
imagefill($image, 0, 0, $bg_color);

$temp_img = imagecreatetruecolor(10, 15);
$temp_bg = imagecolorallocate($temp_img, 240, 240, 240);
imagefill($temp_img, 0, 0, $temp_bg);
imagestring($temp_img, 5, 0, 0, $char, $text_color);

imagecopyresampled($image, $temp_img, 2, 5, 0, 0, 25, 35, 10, 15);

for($i=0; $i<40; $i++) {
    imagesetpixel($image, mt_rand(0,$width), mt_rand(0,$height), $text_color);
}

// 修正重點 3：加入 Header 防止瀏覽器快取舊圖片
header('Cache-Control: no-cache, must-revalidate');
header('Content-Type: image/png');
imagepng($image);
imagedestroy($image);
imagedestroy($temp_img);
?>