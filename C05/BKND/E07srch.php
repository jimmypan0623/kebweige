<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header("Content-Type: application/json; charset=utf-8");
require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

// 1. 確保接收到資料且格式正確
if (!isset($_POST['filename']) || empty($_POST['filename'])) {
    echo json_encode(["error" => "缺少參數"]);
    exit;
}

$str = explode('|', $_POST['filename']);
$stock_no = trim($str[0]);
$running_qty = isset($str[1]) ? (float)$str[1] : 0.0;

if (empty($stock_no)) {
    echo json_encode([]);
    exit;
}

// 2. 查詢指定料號之未結案進出貨計畫明細 (結合 c04 出貨與 d04 進貨)
$sql = "(SELECT CONCAT(c04.F00, jt_c.json_date) AS F00, c04.F01, c04.F02, jt_c.json_date AS F0F, (jt_c.json_qty) * (-1) AS RST,
        c03.F03, c01.F05 AS ABR FROM c04 
        JOIN JSON_TABLE(
            c04.F07,
            '$[*]' COLUMNS (
                json_date VARCHAR(50) PATH '$.date',
                json_qty  INT         PATH '$.qty'
            )
        ) AS jt_c
        LEFT JOIN c03 ON c03.F01 = c04.F01 
        LEFT JOIN c01 ON c01.F01 = c03.F03
        WHERE c04.F02 = ? AND (c04.F03 - c04.F09 - c04.F21) > 0 AND jt_c.json_qty > 0 AND c03.F04 = 'Y')
       UNION ALL
       (SELECT CONCAT(d04.F00, jt_d.json_date) AS F00, d04.F01, d04.F02, jt_d.json_date AS F06, (jt_d.json_qty) AS RST, 
        d03.F03, d01.F04 AS ABR FROM d04 
        JOIN JSON_TABLE(
            d04.F07,
            '$[*]' COLUMNS (
                json_date VARCHAR(50) PATH '$.date',
                json_qty  INT         PATH '$.qty'
            )
        ) AS jt_d
        LEFT JOIN d03 ON d03.F01 = d04.F01 
        LEFT JOIN d01 ON d01.F01 = d03.F03
        WHERE d04.F02 = ? AND (d04.F03 - d04.F09 - d04.F21) > 0 AND jt_d.json_qty > 0 AND d03.F04 = 'Y') 
       ORDER BY F0F ASC, RST DESC";

$stmt = mysqli_prepare($link, $sql);
mysqli_stmt_bind_param($stmt, "ss", $stock_no, $stock_no);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

// 3. 處理資料與逐筆累計預期結餘
$arr = array();
$wthary = fldwdthpre('C05', 'B', $link); // 開窗明細欄位定義

while ($row = mysqli_fetch_assoc($result)) {
    $change = (float)$row['RST'];
    $running_qty = round($running_qty + $change, 4); // 防止浮點數累加誤差

    $prefix = substr($row['F01'], 0, 2);
    $action_type = ($change < 0) ? '出貨' : '進貨'; // 以正負數判斷進出貨異動，相容所有單別字軌
    
    $mapping = [
        $prefix . $row['F00'],   // 序號
        $row['F01'],             // 單據號碼
        $action_type,            // 異動類別 (進貨/出貨)
        $row['F0F'],             // 異動日期
        $change,                 // 異動數量
        $running_qty,            // 預期結餘
        $row['F03'],             // 對象編號
        $row['ABR']              // 對象簡稱
    ];
    
    $atr = [];
    $i = 0;
    foreach ($mapping as $db_col) { 
        $atr[$wthary[$i]] = $db_col ?? '';
        $i++;
    }
    $arr[] = $atr;		
}

// 4. 釋放資源與關閉連線
mysqli_stmt_close($stmt);
mysqli_close($link);

// 5. 輸出 JSON 結果
echo json_encode($arr);
//echo json_encode(['recdrow' => $arr, 'pgttl' => (int)$running_qty], JSON_UNESCAPED_UNICODE);
?>