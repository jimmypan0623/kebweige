<?php
header('Content-Type: application/json; charset=utf-8');
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
require_once("../../include/BKND/mysqli_server.php"); // 引入設定檔
require_once "../../include/BKND/fieldpreset.php";
$rows = 0;
$arr = array();

// --- 輔助函式：白名單檢查欄位名 (比照 B01) ---
function isValidField($field) {
    // 限制欄位格式，允許 c03, c01, a01 的前綴
    return preg_match('/^((c03|c01|a01)\.)?F[0-9]{2}$/i', $field);
}

// 統一的欄位與 JOIN 選取
$columns = "c03.F00, c03.F01, c03.F02, c03.F03, c03.F04, c03.F06, c03.F07, c03.F08, c03.F10, c03.F12, c03.F14, c03.F13,
            c01.F05 as F0E, c01.F04 AS F0D, a01.F03 as F0C,c00.F04 AS F0H";

$joins = "FROM c03 
          LEFT OUTER JOIN c01 ON c01.F01 = c03.F03
          LEFT OUTER JOIN a01 ON a01.F01 = c03.F07 
          LEFT OUTER JOIN c00 ON c00.F01 = c03.F12";
// 判斷模式
if (substr($_POST['filename'], 0, 3) == "PGE") {
    
    // 1. 分頁模式處理
    $pgeno = (int)getNeedBetween($_POST['filename'], 'E', '|');
    $rows = (int)getNeedBetween($_POST['filename'], '|', '_');
    $pagerows = (int)substr(strrchr($_POST['filename'], '_'), 1);
    
    // 計算總筆數 (初次載入時)
    if ($rows <= 0) {        
        $resK = mysqli_query($link, "SELECT COUNT(*) as total FROM `c03` ");
        $rowK = mysqli_fetch_assoc($resK);
        $rows = (int)$rowK['total'];
    }

    $start_row = ($pgeno - 1) * $pagerows;

    $sql = "SELECT $columns $joins ORDER BY c03.F01 DESC LIMIT ?, ?";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $start_row, $pagerows);

} else {    
    // 2. 搜尋模式 (比照 B01 explode 邏輯)
    $parts = explode('|', $_POST['filename']);
    $fieldNo = $parts[0];
    $filterValue = trim($parts[1] ?? '');
    $filterKey = "%$filterValue%";

    if (!isValidField($fieldNo)) {
        die(json_encode(array('error' => 'Invalid Field: ' . $fieldNo)));
    }

    // 確保 $fieldNo 有 c03 前綴以防止 Ambiguous error
    if (stripos($fieldNo, '.') === false) {
        $fieldNo = "c03." . $fieldNo;
    }

    $sql = "SELECT $columns $joins WHERE BINARY $fieldNo LIKE ? ORDER BY $fieldNo, c03.F01 DESC";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "s", $filterKey);
    
    // 搜尋模式下通常回傳前 100 筆或根據需求調整，這裡設定不限制但建議前端處理
    // 如果需要搜尋模式也分頁，則需要額外處理 $rows
    $rows = 100; // 預設給一個搜尋顯示上限
}

// 執行並獲取結果
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

// 獲取欄位寬度設定
$wthary = fldwdthpre('C04', '1', $link);

while ($list3 = mysqli_fetch_assoc($result)) {
    $atr = array(
        'rc_no' . $wthary[0]        => $list3['F00'],
        'query_no' . $wthary[1]     => $list3['F01'],
        'custom_no' . $wthary[2]    => $list3['F03'],
        'custom_name' . $wthary[3]  => $list3['F0E'],
        'custom_fullname' . $wthary[4] => $list3['F0D'],
        'query_date' . $wthary[5]   => $list3['F02'],
        'sales_no' . $wthary[6]     => $list3['F07'],
        'sales_name' . $wthary[7]   => $list3['F0C'],
        'crncy_type' . $wthary[8]   => $list3['F12'],
		'crncy_name' . $wthary[9]   => $list3['F0H'],
        'customer_po' . $wthary[10]  => $list3['F14'],
        'shipplace' . $wthary[11]   => $list3['F06'],
        'shipdirect' . $wthary[12]  => $list3['F13'],
        'trns' . $wthary[13]        => $list3['F08'],
        'shure' . $wthary[14]       => $list3['F04'],
        'lastupdate' . $wthary[15]  => $list3['F10']
    );
    $arr[] = $atr;
}

mysqli_stmt_close($stmt);
mysqli_close($link);

$json_output = array('recdrow' => $arr, 'pgttl' => (int)$rows);

// 清除緩衝區防止多餘輸出
if (ob_get_length()) ob_clean(); 

echo json_encode($json_output, JSON_UNESCAPED_UNICODE);

// --- 輔助函式 ---
function getNeedBetween($kw, $mark1, $mark2) {
    $st = stripos($kw, $mark1);
    $ed = stripos($kw, $mark2);
    if (($st === false || $ed === false) || $st >= $ed) return 0;
    return substr($kw, ($st + 1), ($ed - $st - 1));
}
?>