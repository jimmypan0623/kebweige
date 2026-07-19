<?php
 
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";
// --- 輔助函式：白名單檢查欄位名 (與 C04 風格一致) ---
function isValidField($field) {
    // 限制欄位格式，防止 SQL 注入
    return preg_match('/^((b01|c02|c20)\.)?F[0-9]{2}$/i', $field);
}

// 取得傳入參數
$filename = isset($_POST['filename']) ? $_POST['filename'] : '';
$str = explode(',', $filename);

// 基本檢查：確保參數完整 (搜尋欄位, 關鍵字, 客戶編號, 類別代碼)
if (count($str) < 4) {
    echo json_encode(array());
    exit;
}

$searchField  = trim($str[0]); 
$searchRecord = trim($str[1]); 
$customno     = trim($str[2]); 
$categoryCode = trim($str[3]); // 用於子查詢 c02 的 F06
$filterKey    = "%$searchRecord%";

// 1. 取得該客戶之群組編號 (F44) - 使用預處理
$groupNo = "";
$sql0 = "SELECT F44 FROM c01 WHERE F01 = ?";
$stmt0 = mysqli_prepare($link, $sql0);
mysqli_stmt_bind_param($stmt0, "s", $customno);
mysqli_stmt_execute($stmt0);
$res0 = mysqli_stmt_get_result($stmt0);
if ($row0 = mysqli_fetch_assoc($res0)) {
    $groupNo = $row0['F44'];
}
////chtgpt
if (empty($groupNo)) {
    echo json_encode([
        "error" => "groupNo empty",
        "customno" => $customno
    ]);
    exit;
}
/////
mysqli_stmt_close($stmt0);

// 2. 構建主要 SQL 語句
$columns = "b01.F01, b01.F02, b01.F04, b01.F28, b01.F31, b01.F05, 
            c02A.F13, c02A.F08, c02A.F04 AS F0D, c02A.F07, c02A.F15, 
            c20.F03 AS F0C, c20.F15 AS F1E";

// 子查詢與 Join 邏輯
$joins = "FROM b01 
          LEFT OUTER JOIN (
              SELECT F01, F02, F03, F04, F06, F07, F08, F13, F15 
              FROM c02 
             
			  
			  WHERE F06 = ? AND F01 = ? AND (F02 IS NULL OR F15 IS NULL OR CURDATE() BETWEEN F02 AND F15)
			  
          ) AS c02A ON c02A.F03 = b01.F01  
          LEFT OUTER JOIN c20 ON c20.F01 = b01.F01";


// 處理搜尋欄位安全
if (!isValidField($searchField)) {
    $searchField = "F01"; 
}

// 補上前綴防止欄位模糊 (Ambiguous)
$dbField = (stripos($searchField, '.') === false) ? "b01." . $searchField : $searchField;

// 組合條件
//$where = " WHERE (RIGHT(b01.F98, 1) = 'Y' OR b01.F98 = 'NNN')";
$where ="WHERE (RIGHT(IFNULL(b01.F98,''),1)='Y' OR b01.F98='NNN')";
if (strlen($searchRecord) > 0) {
    $where .= " AND $dbField LIKE ?";
}

$sqlFinal = "SELECT $columns $joins $where ORDER BY $dbField";

// 3. 執行主查詢
$stmt = mysqli_prepare($link, $sqlFinal);

if (strlen($searchRecord) > 0) {
    // 參數綁定順序：子查詢(categoryCode, groupNo) + WHERE(filterKey)
    mysqli_stmt_bind_param($stmt, "sss", $categoryCode, $groupNo, $filterKey);
} else {
    mysqli_stmt_bind_param($stmt, "ss", $categoryCode, $groupNo);
}

mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$wthary = fldwdthpre('C04', 'M', $link);
$arr = array();

while ($list3 = mysqli_fetch_assoc($result)) {
   
	$mapping=[
	    $list3['F01'],
        $list3['F02'],
        $list3['F04'],
        // 價格與數量邏輯判斷 (特價檔優先)
        $list3['F13'] > 0 ? $list3['F13'] : $list3['F0C'],
        $list3['F08'] > 0 ? $list3['F08'] : $list3['F1E'],
        $list3['F0D'],
        $list3['F15'],
        $list3['F07'] > 0 ? $list3['F07'] : $list3['F05'],
        (int)$list3['F28'] + (int)$list3['F31']
    ];
	$atr = [];
	$i = 0;
	foreach ($mapping as  $db_col) { 
		$atr[$wthary[$i]] = $db_col ?? '';
		$i++;
	}
	$arr[] = $atr;			
}

mysqli_stmt_close($stmt);
mysqli_close($link);

// 輸出 JSON (不使用 array_values 因為 $arr[] 本身就是索引陣列)
if (ob_get_length()) ob_clean(); 
echo json_encode($arr, JSON_UNESCAPED_UNICODE);
?>