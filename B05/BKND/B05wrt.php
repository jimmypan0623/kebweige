<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header('Content-Type: application/json; charset=utf-8'); // 確保回傳 JSON 格式

// 1. 取得 JSON 並解碼
$str_json = file_get_contents('php://input');

// 對齊修法：前端已改為單次 stringify(真實物件)，直接一次解碼
$cart = json_decode($str_json, true);
if ($cart === null) {
    echo json_encode("payload 解碼失敗");
    exit;
}

$brr = array();
foreach ($cart as $key => $val) {
    $brr[] = addslashes($val); // 避免單引號造成字串錯亂
}

$mArlth = count($brr);
if ($mArlth < 2) {
    echo json_encode("傳入資料筆數不足，無法判斷新增/修改模式");
    exit;
}

// 2. 引入必要的資料庫與設定檔
require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldDOMset.php";

$sq20 = "SELECT * FROM a26 WHERE F01='INT_099'"; 
$sql7 = @mysqli_query($link, $sq20);                        
$list8 = mysqli_fetch_assoc($sql7);  // 紀錄參數  	
$INT_099 = $list8["F06"] ?? '';

$lastdate = date('Y-m-d');

$flag = $brr[$mArlth - 2]; // 取得倒數第二個值作為標記 Flag

$trnarray = fldafterwrite('B05', '1', $link, true);

// ---------------------------------------------------------
// 3. 驗證資料合法性 (使用 Prepared Statements)
// ---------------------------------------------------------

// A. 檢查業務人員 (a01)
$stmtSales = $link->prepare("SELECT F03 FROM a01 WHERE F01 = ?");
$stmtSales->bind_param("s", $brr[3]);
$stmtSales->execute();
$resSales = $stmtSales->get_result();
$salesPerson = $resSales->fetch_assoc();

// B. 檢查原出貨月份紀錄 (b04)
$rows1 = 0;
if ($flag == 0) {
    $stmtB04 = $link->prepare("SELECT F01 FROM b04 WHERE F01 = ? AND F20 = ? AND F06 = ?");
    $stmtB04->bind_param("sss", $brr[5], $brr[6], $brr[1]);
    $stmtB04->execute();
    $rows1 = $stmtB04->get_result()->num_rows;
} else {
    $rows1 = 1; // 修改模式下預設驗證通過
}

// 錯誤處理與 Log 寫入
if ($rows1 == 0 || !$salesPerson) {
    if ($INT_099 == "Y") {
        $shortId = substr($brr[0], 0, 5);
        $stmtLog = $link->prepare("INSERT INTO a0i (F01, F08) VALUES (?, ?)");
        $stmtLog->bind_param("ss", $shortId, $brr[0]);
        $stmtLog->execute();
    }
    
    if ($rows1 == 0) echo json_encode("原出貨月份無此出貨紀錄"); 	   
    if (!$salesPerson) echo json_encode("業務人員資料錯誤");  
    exit;
}

// 取得當前操作者姓名

$opName = $lastdate . ($_SESSION['user_name'] ?? '');

// ---------------------------------------------------------
// 4. 執行 新增 或 修改
// ---------------------------------------------------------

$f02 = str_pad(trim($brr[2]), 2, "0", STR_PAD_LEFT);

if ($flag == 0) {
    // 新增模式：檢查編號是否重複
    $stmtCheck = $link->prepare("SELECT F01 FROM b05 WHERE F01 = ?");
    $stmtCheck->bind_param("s", $brr[0]);
    $stmtCheck->execute();
    if ($stmtCheck->get_result()->num_rows > 0) {
        echo json_encode("資料庫已有此編號");
    } else {
        // 執行 INSERT INTO b05
        $sqlIns = "INSERT INTO b05 (F01, F06, F02, F09, F08, F21, F20, F22, F23, F14, F16, F24, F25, F90, F10, F13) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'N', ?)";
        $stmtIns = $link->prepare($sqlIns);
        $stmtIns->bind_param("sssssssssssssss", 
            $brr[0], $brr[1], $f02, $brr[3], $brr[4], $brr[5], $brr[6], 
            $brr[7], $brr[8], $brr[9], $brr[10], $brr[11], $brr[12], $brr[13], $opName
        );
        $stmtIns->execute();
        $last_id = $link->insert_id;

        echo json_encode([
            'order_no' => $last_id,
            'lastupdate' => $opName,
            'fldsatrr' => $trnarray
        ]);
    }
} else {
    // 修改模式
    
    // 特殊狀態處理：當 F24 > 3 (退變折或折變退轉換)
    $f24_val = intval($brr[11]);
    if ($f24_val > 3) {
        if ($f24_val == 9) {
            // 退變折：扣回 c04 的累計銷退量
            $sqlC04 = "UPDATE c04 SET c04.F24 = c04.F24 - 
                       (SELECT b0e.F04 FROM b0e WHERE c04.F01 = b0e.F07 AND c04.F02 = b0e.F03 AND b0e.F01 = ?) 
                       WHERE CONCAT(c04.F01, c04.F02) IN (SELECT CONCAT(F07, F03) FROM b0e WHERE F01 = ?)";
        } else {
            // 折變退：補回 c04 的累計銷退量
            $sqlC04 = "UPDATE c04 SET c04.F24 = c04.F24 + 
                       (SELECT b0e.F04 FROM b0e WHERE c04.F01 = b0e.F07 AND c04.F02 = b0e.F03 AND b0e.F01 = ?) 
                       WHERE CONCAT(c04.F01, c04.F02) IN (SELECT CONCAT(F07, F03) FROM b0e WHERE F01 = ?)";
        }
        $stmtC04 = $link->prepare($sqlC04);
        $stmtC04->bind_param("ss", $brr[0], $brr[0]);
        $stmtC04->execute();

        // 調整扣除後的狀態碼
        $f24_str = strval($f24_val - 6);
    } else {
        $f24_str = $brr[11];
    }

    // 執行 UPDATE b05
    $sqlUpd = "UPDATE b05 SET F02 = ?, F09 = ?, F22 = ?, F23 = ?, F14 = ?, F16 = ?, F24 = ?, F25 = ?, F13 = ? WHERE F00 = ?";
    $stmtUpd = $link->prepare($sqlUpd);
    $stmtUpd->bind_param("sssssssssi", 
        $f02, $brr[3], $brr[7], $brr[8], $brr[9], $brr[10], 
        $f24_str, $brr[12], $opName, $flag
    );
    $stmtUpd->execute();

    echo json_encode([
        'order_no' => $flag,
        'lastupdate' => $opName,
        'fldsatrr' => $trnarray
    ]);
}

$link->close();
?>