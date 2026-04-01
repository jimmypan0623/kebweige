<?php
/**
 * 權限明細查詢 API (a02/a03)
 * 功能：根據使用者代號查詢對應的程式權限與屬性
 */

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

include("../../include/BKND/mysqli_server.php");           
require_once "../../include/BKND/fieldpreset.php"; 

// 1. 取得並解析輸入參數
$filename = $_POST['filename'] ?? '';
$str = explode('|', $filename);

if (count($str) < 2) {
    die(json_encode([
        'recdrow' => [], 
        'pgttl' => [], 
        'error' => 'Invalid parameters'
    ]));
}

$searchRecord = trim($str[0]); // 使用者代號或群組代號
$fetchParam   = (int)$str[1];   // 是否抓取 a26 參數 (0: 是)

// 定義清理函式：移除不可見字元與換行
$clean = function($val) {
    if ($val === null) return '';
    return str_replace(["\r", "\n", "\t"], '', trim($val));
};

// 2. 抓取參數表 a26 (選用)
$arg = array(); 
if ($fetchParam === 0) {
    $sql0 = "SELECT F01, F06, F04 FROM a26 ORDER BY F01";         
    $res1 = mysqli_query($link, $sql0);     
    if ($res1) {
        while ($list4 = mysqli_fetch_assoc($res1)) {
            $arg[] = [
                'paraNo' => $clean($list4['F01']),
                'cngpra' => $clean($list4['F06']),
                'gTYPE'  => $clean($list4['F04'])
            ];
        }
    }
}

// 3. 查詢權限明細 (a02 關聯 a03)
$sql3 = "SELECT 
            a02.F03, a03.F02, a02.F04, a02.F05, a02.F06, a02.F07, 
            a02.F08, a02.F09, a02.F10, a02.F11, a02.F12, 
            a03.F03 AS Ftb, a03.F16, a03.F17, a03.F18 
         FROM a02 
         INNER JOIN a03 ON a03.F01 = a02.F03 
         WHERE a02.F01 = ? 
         ORDER BY a02.F03";

$arr = array(); 
$stmt = $link->prepare($sql3);
if ($stmt) {
    $stmt->bind_param("s", $searchRecord);
    $stmt->execute();
    $res3 = $stmt->get_result();

    while ($list3 = $res3->fetch_assoc()) {
        // 處理 Ftb (屬性字串)，確保為 4 位長度以供拆解
        $ftbStr = str_pad($list3['Ftb'] ?? '', 4, " "); 
        $FTB = mb_str_split($ftbStr); // 使用 mb_str_split 處理多位元組字元安全性更好
        
        $arr[] = [
            'prg_no'     => $clean($list3['F03']),
            'dscrpt'     => $clean($list3['F02']),
            'newauth'    => $clean($list3['F04']),
            'editauth'   => $clean($list3['F05']),
            'delauth'    => $clean($list3['F06']),
            'pntauth'    => $clean($list3['F07']),
            'rmk1'       => $clean($list3['F08']),
            'rmk2'       => $clean($list3['F09']),
            'rmk3'       => $clean($list3['F10']),
            'rmk4'       => $clean($list3['F11']),
            'rmk5'       => $clean($list3['F12']),
            'attbcode1'  => $FTB[0] ?? '',
            'attbcode2'  => $FTB[1] ?? '',
            'attbcode3'  => $FTB[2] ?? '',
            'attbcode4'  => $FTB[3] ?? '',
            'page_name1' => $clean($list3['F16']),
            'page_name2' => $clean($list3['F17']),
            'page_name3' => $clean($list3['F18'])
        ];
    }
    $stmt->close();
}

mysqli_close($link);

// 4. 回傳結果
echo json_encode([
    'recdrow' => $arr, 
    'pgttl'   => $arg
], JSON_UNESCAPED_UNICODE);
?>