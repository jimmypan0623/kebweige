<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header("Content-Type: application/json; charset=utf-8");
require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldpreset.php";

// 1. 初始化變數與取得分頁參數
$rows = 0;
$filename = $_POST['filename'] ?? '';

// 2. 庫存預期結餘計算 (c04 與 d04 皆改用 JSON_TABLE 解析 F07 欄位)
$sql7 = "(SELECT CONCAT(c04.F00, jt_c.json_date) AS F00, c04.F01, c04.F02, jt_c.json_date AS F0F, (jt_c.json_qty) * (-1) AS RST 
          FROM c04 
          JOIN JSON_TABLE(
              c04.F07,
              '$[*]' COLUMNS (
                  json_date VARCHAR(50) PATH '$.date',
                  json_qty  INT         PATH '$.qty'
              )
          ) AS jt_c
          LEFT JOIN c03 ON c03.F01 = c04.F01 
          WHERE (c04.F03 - c04.F09 - c04.F21) > 0 AND jt_c.json_qty > 0 AND c03.F04 = 'Y')
         UNION ALL
         (SELECT CONCAT(d04.F00, jt_d.json_date) AS F00, d04.F01, d04.F02, jt_d.json_date AS F0F, (jt_d.json_qty) AS RST 
          FROM d04 
          JOIN JSON_TABLE(
              d04.F07,
              '$[*]' COLUMNS (
                  json_date VARCHAR(50) PATH '$.date',
                  json_qty  INT         PATH '$.qty'
              )
          ) AS jt_d
          LEFT JOIN d03 ON d03.F01 = d04.F01 
          WHERE (d04.F03 - d04.F09 - d04.F21) > 0 AND jt_d.json_qty > 0 AND d03.F04 = 'Y' 
          AND d04.F02 IN (
              SELECT c04.F02 FROM c04 LEFT JOIN c03 ON c03.F01 = c04.F01 
              WHERE (c04.F03 - c04.F09 - c04.F21) > 0 AND c03.F04 = 'Y'
          )) 
         ORDER BY F02, F0F, RST DESC";

// 3. 處理不同類型的查詢邏輯 (PGE 分頁模式 vs 搜尋模式)
if (substr($filename, 0, 3) == "PGE") {
    $pgeno = (int)getNeedBetween($filename, 'E', '|');
    $rows = (int)getNeedBetween($filename, '|', '_');
    $pagerows = (int)substr(strrchr($filename, '_'), 1);
    
    // 如果是初始畫面，重新計算總筆數
    if ($rows <= 0) {
        $sqlK = "SELECT COUNT(*) as total FROM `c04` 
                 JOIN JSON_TABLE(
                     `c04`.`F07`,
                     '$[*]' COLUMNS (
                         json_qty INT PATH '$.qty'
                     )
                 ) AS jt
                 LEFT JOIN c03 ON c03.F01 = c04.F01 
                 WHERE (c04.F03 - c04.F09 - c04.F21) > 0 AND jt.json_qty > 0 AND `c03`.`F04` = 'Y'";
        $resK = mysqli_query($link, $sqlK);
        $rowK = mysqli_fetch_assoc($resK);
        $rows = (int)$rowK['total'];
    }

    $start_rowrecord = $pagerows * ($pgeno - 1);

    $sqlMain = "SELECT CONCAT(`c04`.`F00`, jt.json_date) AS F00, `c04`.`F02`, `b01`.`F02` AS `F0B`, `c04`.`F01`, 
                jt.json_date AS F0F, 
                jt.json_qty AS NSH, 
                `c04`.`F23`, `c03`.`F03`, `c01`.`F05` As F0E, 
                `c04`.`F05`, `c03`.`F14`, `c03`.`F07`, `a01`.`F03` AS F0C, `c04`.`F12`, b11B.nTqty, 
                DATEDIFF(CURDATE(), jt.json_date) AS diffdate FROM `c04`
                JOIN JSON_TABLE(
                    `c04`.`F07`,
                    '$[*]' COLUMNS (
                        json_date VARCHAR(50) PATH '$.date',
                        json_qty  INT         PATH '$.qty'
                    )
                ) AS jt
                LEFT JOIN `b01` ON `b01`.`F01` = `c04`.`F02`
                LEFT JOIN `c03` ON `c03`.`F01` = `c04`.`F01`
                LEFT JOIN `c01` ON `c01`.`F01` = `c03`.`F03`
                LEFT JOIN `a01` ON `a01`.`F01` = `c03`.`F07`
                LEFT JOIN (SELECT b11.F03, SUM(b11.F04) AS nTqty FROM b11 
                           LEFT JOIN a14 ON a14.F01 = b11.F01 
                           WHERE (a14.F04 = 'Y' AND a14.F12 = 'Y') GROUP BY b11.F03) AS b11B ON b11B.F03 = c04.F02
                WHERE (c04.F03 - c04.F09 - c04.F21) > 0 AND jt.json_qty > 0 AND `c03`.`F04` = 'Y' 
                ORDER BY `c04`.`F02`, jt.json_date LIMIT ?, ?";
    
    $stmt = $link->prepare($sqlMain);
    $stmt->bind_param("ii", $start_rowrecord, $pagerows);

} else {
    // 搜尋模式處理
    $rawField = trim(substr($filename, 0, strpos($filename, '|') !== false ? strpos($filename, '|') : 7));
    $filterKey = "%" . trim(substr(strrchr($filename, '|'), 1)) . "%";

    // 安全檢查：限制欄位名稱格式
    if (!preg_match('/^[a-zA-Z0-9._]+$/', $rawField)) {
        die(json_encode(["error" => "Invalid Field Format"]));
    }

    // 將前端欄位對應至完整的 SQL 資料表與欄位名稱（避免 Ambiguous 錯誤）
    $fieldMap = [
        'F01' => 'c04.F01',
        'F02' => 'c04.F02',
        'F0B' => 'b01.F02',
        'F03' => 'c03.F03',
        'F0E' => 'c01.F05',
        'F07' => 'c03.F07',
        'F0C' => 'a01.F03',
        'F0F' => 'jt.json_date'
    ];

    $whereColumn = $fieldMap[$rawField] ?? (strpos($rawField, '.') !== false ? $rawField : "`c04`.`{$rawField}`");

    $sqlMain = "SELECT CONCAT(`c04`.`F00`, jt.json_date) AS F00, `c04`.`F02`, `b01`.`F02` AS `F0B`, `c04`.`F01`, 
                jt.json_date AS F0F, 
                jt.json_qty AS NSH, 
                `c04`.`F23`, `c03`.`F03`, `c01`.`F05` As F0E, 
                `c04`.`F05`, `c03`.`F14`, `c03`.`F07`, `a01`.`F03` AS F0C, `c04`.`F12`, b11B.nTqty, 
                DATEDIFF(CURDATE(), jt.json_date) AS diffdate FROM `c04`
                JOIN JSON_TABLE(
                    `c04`.`F07`,
                    '$[*]' COLUMNS (
                        json_date VARCHAR(50) PATH '$.date',
                        json_qty  INT         PATH '$.qty'
                    )
                ) AS jt
                LEFT JOIN `b01` ON `b01`.`F01` = `c04`.`F02`
                LEFT JOIN `c03` ON `c03`.`F01` = `c04`.`F01`
                LEFT JOIN `c01` ON `c01`.`F01` = `c03`.`F03`
                LEFT JOIN `a01` ON `a01`.`F01` = `c03`.`F07`
                LEFT JOIN (SELECT b11.F03, SUM(b11.F04) AS nTqty FROM b11 
                           LEFT JOIN a14 ON a14.F01 = b11.F01 
                           WHERE (a14.F04 = 'Y' AND a14.F12 = 'Y') GROUP BY b11.F03) AS b11B ON b11B.F03 = c04.F02
                WHERE $whereColumn LIKE ? AND (c04.F03 - c04.F09 - c04.F21) > 0 AND jt.json_qty > 0 AND `c03`.`F04` = 'Y' 
                ORDER BY `c04`.`F02`, jt.json_date";
    
    $stmt = $link->prepare($sqlMain);
    $stmt->bind_param("s", $filterKey);
}

// 4. 執行查詢
$stmt->execute();
$mainResult = $stmt->get_result();

// 5. 處理 $sql7 的結餘邏輯
$res8 = mysqli_query($link, $sql7);
$initleft = 0;
$initstockno = '';

$amr = array();
while ($list8 = mysqli_fetch_assoc($res8)) {
    if ($list8['F02'] != $initstockno) {
        $initleft = 0;		
    }
    $initleft += $list8['RST'];
    $amr[substr($list8['F01'], 0, 2) . $list8['F00']] = $initleft;	
    $initstockno = $list8['F02'];
}

// 6. 整理回傳資料
$wthary = fldwdthpre('C05', '1', $link);
$arr = array();
while ($list3 = $mainResult->fetch_assoc()) {
    $key = substr($list3['F01'], 0, 2) . $list3['F00'];
    $avl_qty = (isset($amr[$key]) ? $amr[$key] : 0) + ($list3['nTqty'] ?? 0);       
    $mapping = [
        $list3['F00'],
        $list3['F02'],
        $list3['F0B'],
        $list3['F01'],
        $list3['F0F'],      // 已綁定 jt.json_date
        $list3['NSH'],      // 已綁定 jt.json_qty
        $list3['F23'],
        $avl_qty,
        $list3['nTqty'],
        $list3['F03'],
        $list3['F0E'],      // 出貨對應 c01.F05
        $list3['F05'],
        $list3['F14'],
        $list3['F07'],
        $list3['F0C'],
        $list3['diffdate'], // 使用 jt.json_date 計算天數差
        $list3['F12']
    ];
    $atr = [];
    $i = 0;
    foreach ($mapping as $db_col) { 
        $atr[$wthary[$i]] = $db_col ?? '';
        $i++;
    }
    $arr[] = $atr;          
}

// 7. 關閉並輸出 JSON
$stmt->close();
mysqli_close($link);

// 若為搜尋模式，回傳總筆數設定為實際搜尋結果筆數
$totalRows = ($rows > 0) ? $rows : count($arr);
echo json_encode(array('recdrow' => $arr, 'pgttl' => $totalRows));

// 輔助函式
function getNeedBetween($kw1, $mark1, $mark2) {
    $st = stripos($kw1, $mark1);
    $ed = stripos($kw1, $mark2);
    if ($st === false || $ed === false || $st >= $ed) return "";
    return substr($kw1, ($st + 1), ($ed - $st - 1));
}
?>