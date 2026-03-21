<?php
header("Content-Type: application/json; charset=utf-8"); // 建議統一使用 JSON header

include("../../include/BKND/mysqli_server.php");           
require_once "../../include/BKND/fieldpreset.php"; 

// 1. 安全取得 POST 資料
$filename = $_POST['filename'] ?? '';
$str = explode('|', $filename);

if (count($str) < 2) {
    echo json_encode(['recdrow' => [], 'pgttl' => [], 'error' => 'Invalid parameters']);
    exit;
}

$searchRecord = mysqli_real_escape_string($link, $str[0]);
$arg = array();	

// 2. 只有在特定條件下抓取參數表 a26
if ((int)$str[1] == 0) {
    $sql0 = "SELECT F01, F06, F04 FROM a26 ORDER BY F01"; 		
    $res1 = mysqli_query($link, $sql0);		
    if ($res1) {
        while ($list4 = mysqli_fetch_assoc($res1)) {
            $arg[] = [
                'paraNo' => $list4['F01'],
                'cngpra' => $list4['F06'],
                'gTYPE'  => $list4['F04']
            ];
        }
    }
}

// 3. 查詢權限明細 a02 & 程式檔 a03
$sql3 = "SELECT 
            a02.F03, a03.F02, a02.F04, a02.F05, a02.F06, a02.F07, 
            a02.F08, a02.F09, a02.F10, a02.F11, a02.F12, 
            a03.F03 AS Ftb, a03.F16, a03.F17, a03.F18 
         FROM a02 
         INNER JOIN a03 ON a03.F01 = a02.F03 
         WHERE a02.F01 = '$searchRecord' 
         ORDER BY a02.F03"; 	    

$arr = array();	
$res3 = mysqli_query($link, $sql3); 

if ($res3) {
    while ($list3 = mysqli_fetch_assoc($res3)) {
        // 確保 Ftb 有值且長度足夠，避免 str_split 錯誤
        $ftbStr = str_pad($list3['Ftb'] ?? '', 4, " "); // 不足4位補空白
        $FTB = str_split($ftbStr);	
        
        $arr[] = [
            'prg_no'    => $list3['F03'],
            'dscrpt'    => $list3['F02'],
            'newauth'   => $list3['F04'],
            'editauth'  => $list3['F05'],
            'delauth'   => $list3['F06'],
            'pntauth'   => $list3['F07'],
            'rmk1'      => $list3['F08'],
            'rmk2'      => $list3['F09'],
            'rmk3'      => $list3['F10'],
            'rmk4'      => $list3['F11'],
            'rmk5'      => $list3['F12'],
            'attbcode1' => $FTB[0] ?? '',
            'attbcode2' => $FTB[1] ?? '',
            'attbcode3' => $FTB[2] ?? '',
            'attbcode4' => $FTB[3] ?? '',
            'page_name1'=> $list3['F16'],
            'page_name2'=> $list3['F17'],
            'page_name3'=> $list3['F18']
        ];
    }
}

mysqli_close($link);

// 4. 回傳 JSON
echo json_encode([
    'recdrow' => $arr, 
    'pgttl'   => $arg
]);
?>