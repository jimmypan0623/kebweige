<?php
session_start();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 1;

if ($id < 1 || $id > 4) {
    $id = 1;
}

if ($id === 1) {

    $characters = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ';

    $code = '';

    for ($i = 0; $i < 4; $i++) {

        $code .= $characters[
            random_int(0, strlen($characters) - 1)
        ];
    }

    $_SESSION['captcha_code'] = $code;

    session_write_close();

} else {

    $retry = 0;

    while (
        (
            !isset($_SESSION['captcha_code']) ||
            strlen($_SESSION['captcha_code']) < 4
        )
        && $retry < 3
    ) {

        session_write_close();

        usleep(100000);

        session_start();

        $retry++;
    }
}

$char = $_SESSION['captcha_code'][$id - 1] ?? '';

$width = 30;
$height = 40;

$image = imagecreatetruecolor($width, $height);

if (!$image) {
    http_response_code(500);
    exit;
}

$bg_color = imagecolorallocate($image, 240, 240, 240);

$text_color = imagecolorallocate(
    $image,
    random_int(0, 100),
    random_int(0, 100),
    random_int(0, 100)
);

imagefill($image, 0, 0, $bg_color);

$temp_img = imagecreatetruecolor(10, 15);

$temp_bg = imagecolorallocate($temp_img, 240, 240, 240);

imagefill($temp_img, 0, 0, $temp_bg);

imagestring($temp_img, 5, 0, 0, $char, $text_color);

imagecopyresampled(
    $image,
    $temp_img,
    2,
    5,
    0,
    0,
    25,
    35,
    10,
    15
);

for ($i = 0; $i < 40; $i++) {

    imagesetpixel(
        $image,
        random_int(0, $width - 1),
        random_int(0, $height - 1),
        $text_color
    );
}

header('Expires: Tue, 01 Jan 2000 00:00:00 GMT');
header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');

header('Content-Type: image/png');

imagepng($image);

imagedestroy($image);
imagedestroy($temp_img);
?>