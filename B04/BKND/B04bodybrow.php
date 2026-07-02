<?php
/**
 * 單據明細查詢 API (b0d)
 * 功能：根據主單號與關鍵字過濾銷貨明細內容 (B04 模組)
 */

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

// 引入資料庫連線與欄位預設值
require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

// 1. 取得並解析輸入參數
$filename = $_POST['filename'] ?? '';
$params = explode('|', $filename);

if (count($params) < 3) {
    die(json_encode([
        'recdrow' => [], 
        'pgttl' => 0, 
        'error' => '參數格式錯誤，需包含單號、欄位與關鍵字'
    ]));
}

$mainOrderNo = trim($params[0]); // 主單號 (b0d.F01)
$rawField    = trim($params[1]); // 欲搜尋的欄位
$keyword     = "%" . trim($params[2]) . "%"; // 模糊查詢

// 2. 安全檢查：驗證欄位名稱合法性 (防止 SQL 注入)
function isValidDetailField($field) {
    // 限制格式為 F01, F02... 或帶有指定表名的格式
    return preg_match('/^((b0d|b01|a14)\.)?F[0-9]{2}$/i', $field);
}

if (!isValidDetailField($rawField)) {
    die(json_encode(['error' => '不合法的搜尋欄位名稱: ' . $rawField]));
}

// 處理欄位歧義 (Ambiguous)：若無指定表名，預設補上主表 b0d.
$searchField = (strpos($rawField, '.') !== false) ? $rawField : "b0d." . $rawField;

// 3. 建立 SQL 語句
$sql = "SELECT b0d.*, b01.F02 AS F0B, a14.F02 AS F0C 
        FROM `b0d` 
        LEFT OUTER JOIN `b01` ON b0d.F03 = b01.F01 
        LEFT OUTER JOIN `a14` ON b0d.F05 = a14.F01 
        WHERE b0d.F01 = ? AND $searchField LIKE ? 
        ORDER BY b0d.F03 ASC";

$stmt = $link->prepare($sql);
if (!$stmt) {
    die(json_encode(['error' => 'SQL 準備失敗: ' . $link->error]));
}

$stmt->bind_param("ss", $mainOrderNo, $keyword);
$stmt->execute();
$result = $stmt->get_result();

// 4. 取得前端欄位寬度設定 (B04 模組)
$wthary = fldwdthpre('B04', '2', $link);

// 5. 整理回傳資料
 

// 清理函式：移除換行符號防止撐開 Grid 高度
$clean = function($val) {
    if ($val === null) return '';
    return str_replace(["\r", "\n", "\t"], '', trim($val));
};
$arr=array();
$afld=['F00','F03','F0B','F07','F04','F15','F05','F0C','F08','F09','F25','F11'];
$arr=afldcont($result,$afld,$wthary);

// 6. 釋放資源並輸出 JSON
$stmt->close();
mysqli_close($link);

echo json_encode([
    'recdrow' => $arr,
    'pgttl'   => count($arr)
], JSON_UNESCAPED_UNICODE);
?>