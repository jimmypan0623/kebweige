<?php
ob_start();

require_once("../../include/BKND/auth_check.php");
require_once("../../include/BKND/mysqli_server.php");

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

// 1. 直接讀取 Session 中的使用者帳號
$searchRecord = $_SESSION['user_account'] ?? '';

// 若 Session 無效或未登入，直接中斷回傳 error
if (empty($searchRecord)) {
    ob_end_clean();
    die(json_encode([
        'recdrow' => [], 
        'pgttl'   => [], 
        'error'   => 'Unauthenticated'
    ], JSON_UNESCAPED_UNICODE));
}

// 2. 清理與容器宣告
$clean = function($val) {
    if ($val === null) return '';
    return str_replace(["\r", "\n", "\t"], '', trim($val));
};

$arg = array(); 
$arr = array();

// 3. 抓取系統參數 (a26)
$sql0 = "SELECT F01, F06, F04 FROM a26 ORDER BY F01";         
$res1 = mysqli_query($link, $sql0);     
if ($res1) {
    while ($list4 = mysqli_fetch_assoc($res1)) {
        $arg[] = [
            'paraNo' => $clean($list4['F01']),
            'cngpra' => $clean($list4['F06'])               
        ];
    }
}

// 4. 查詢該使用者的權限明細 (a02/a03)
$sql3 = "SELECT 
            a02.F03, a03.F02, a02.F04, a02.F05, a02.F06, a02.F07, 
            a02.F08, a02.F09, a02.F10, a02.F11, a02.F12, 
            a03.F03 AS Ftb, a03.F16, a03.F17, a03.F18 
         FROM a02 
         INNER JOIN a03 ON a03.F01 = a02.F03 
         WHERE a02.F01 = ? 
         ORDER BY a02.F03";

$stmt = $link->prepare($sql3);
if ($stmt) {
    $stmt->bind_param("s", $searchRecord);
    $stmt->execute();
    $res3 = $stmt->get_result();

    while ($list3 = $res3->fetch_assoc()) {
        $ftbStr = str_pad($list3['Ftb'] ?? '', 4, " "); 
        $FTB    = mb_str_split($ftbStr);
        
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

// 5. 回傳 JSON
ob_end_clean(); 
echo json_encode([
    'recdrow' => $arr, 
    'pgttl'   => $arg
], JSON_UNESCAPED_UNICODE);
?>