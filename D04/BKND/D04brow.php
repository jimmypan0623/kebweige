<?php
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

// --- 輔助函數：抓取兩個字元間的字串 ---
function getNeedBetween($kw1, $mark1, $mark2) {
    $st = stripos($kw1, $mark1);
    $ed = stripos($kw1, $mark2);
    if (($st === false || $ed === false) || $st >= $ed) return 0;
    return substr($kw1, ($st + 1), ($ed - $st - 1));
}

// --- 輔助函數：白名單檢查欄位名 ---
function isValidField($field) {
    return preg_match('/^((d03|d01|a01)\.)?F[0-9]{2}$/i', $field);
}

$filename = isset($_POST['filename']) ? $_POST['filename'] : '';
$arr = array();
$total_rows = 0;

// 1. 判斷模式：PGE 代表分頁導覽，否則為搜尋模式
if (substr($filename, 0, 3) == "PGE") {
    // 解析分頁參數: PGE頁碼|總筆數_每頁筆數
    $pgeno = (int)getNeedBetween($filename, 'E', '|'); 
    $total_rows = (int)getNeedBetween($filename, '|', '_');
    $pagerows = (int)substr(strrchr($filename, '_'), 1);
    
    // 如果總筆數為0，重新計算總量
    if ($total_rows <= 0) {
        $sqlK = "SELECT COUNT(F00) as cnt FROM d03";
        $resK = mysqli_query($link, $sqlK);
        $rowK = mysqli_fetch_assoc($resK);
        $total_rows = (int)$rowK['cnt'];
    }

    $start_row = $pagerows * ($pgeno - 1);

    $sql = "SELECT d03.F00, d03.F01, d03.F02, d03.F03, d03.F04, d03.F06, d03.F07, d03.F08, d03.F10, d03.F12, d03.F14, d03.F13,
                   d01.F04 as F0D, d01.F03 AS F0C, a01.F03 as F0G 
            FROM d03 
            LEFT OUTER JOIN d01 ON d01.F01 = d03.F03
            LEFT OUTER JOIN a01 ON a01.F01 = d03.F07 
            ORDER BY d03.F01 DESC 
            LIMIT ?, ?";
    
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $start_row, $pagerows);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

} else {
    // 搜尋模式
    $fieldNo = trim(substr($filename, 0, 7));
    $filterKey = substr(strrchr($filename, '|'), 1);
    $searchValue = "%" . trim($filterKey) . "%";

    if (!isValidField($fieldNo)) { $fieldNo = "d03.F01"; }
    if (stripos($fieldNo, '.') === false) { $fieldNo = "d03." . $fieldNo; }

    $sql = "SELECT d03.F00, d03.F01, d03.F02, d03.F03, d03.F04, d03.F06, d03.F07, d03.F08, d03.F10, d03.F12, d03.F14, d03.F13,
                   d01.F04 as F0D, d01.F03 AS F0C, a01.F03 as F0G 
            FROM d03 
            LEFT OUTER JOIN d01 ON d01.F01 = d03.F03
            LEFT OUTER JOIN a01 ON a01.F01 = d03.F07 
            WHERE $fieldNo LIKE ? 
            ORDER BY $fieldNo ASC, d03.F01 DESC";
    
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "s", $searchValue);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $total_rows = mysqli_num_rows($result); // 搜尋模式下的總筆數
}

// 2. 處理欄位預設寬度
$wthary = fldwdthpre('D04', '1', $link);

// 3. 封裝結果
while ($list3 = mysqli_fetch_assoc($result)) {
    $arr[] = array(
        'rc_no' . $wthary[0]         => $list3['F00'],
        'query_no' . $wthary[1]      => $list3['F01'],
        'vendor_no' . $wthary[2]     => $list3['F03'],
        'vendor_name' . $wthary[3]   => $list3['F0D'],
        'vendor_fullname' . $wthary[4] => $list3['F0C'],
        'query_date' . $wthary[5]    => $list3['F02'],
        'sales_no' . $wthary[6]      => $list3['F07'],
        'sales_name' . $wthary[7]    => $list3['F0G'],
        'crncy_type' . $wthary[8]    => $list3['F12'],
        'vendor_po' . $wthary[9]     => $list3['F14'],
        'shipplace' . $wthary[10]    => $list3['F06'],
        'shipdirect' . $wthary[11]   => $list3['F13'],
        'trns' . $wthary[12]         => $list3['F08'],
        'shure' . $wthary[13]        => $list3['F04'],
        'lastupdate' . $wthary[14]   => $list3['F10']
    );
}

mysqli_stmt_close($stmt);
mysqli_close($link);

// 4. 輸出 JSON
if (ob_get_length()) ob_clean();
echo json_encode(array('recdrow' => $arr, 'pgttl' => (int)$total_rows), JSON_UNESCAPED_UNICODE);
?>