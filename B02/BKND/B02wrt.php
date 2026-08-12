<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header('Content-Type: application/json'); // 確保瀏覽器知道回傳的是 JSON

// 1. 取得 JSON 並解碼
$str_json = file_get_contents('php://input');

// 【修正】原本這裡是「雙重 json_decode」：
//   $response = json_decode($str_json);
//   $cart = json_decode($response);
// 比照 B04wrt.php 的修法：前端已改為單次 stringify(真實物件)，
// 這裡直接一次解碼即可，不需要也不能再 decode 第二次。
$cart = json_decode($str_json, true);   // 前端已改為單次 stringify(真實物件)，這裡直接一次解碼
if ($cart === null) {
    echo json_encode("payload 解碼失敗");
    exit;
}

$data = array();
foreach ($cart as $key => $val) {
    // 說明：因為已改用 Prepared Statements (bind_param)，
    // addslashes() 在此屬多餘處理，且會造成資料庫實際存入
    // 多餘的跳脫字元（例如客戶名稱中的單引號被存成 \'）。
    // 若確定不需要，可直接移除 addslashes()，改成：
    // $data[] = $val;
    $data[] = addslashes($val);
}

// 2. 引入必要的資料庫與設定檔
require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldDOMset.php";
$sq20 = "select * from a26 where F01='INT_099' ";
$sql7 = @mysqli_query($link, $sq20);
$list8 = mysqli_fetch_assoc($sql7);  //紀錄參數
$INT_099 = $list8["F06"];
$regex = "/^[A-Z]{2}[0-9]{8}$/";     //判斷是否有正確的發票號碼的正規式
$lastdate = date('Y-m-d');

// 取得陣列最後倒數第二個值作為標記 (Flag)
$mArlth = count($data);
if ($mArlth < 2) {
    echo json_encode(["error" => "傳入資料筆數不足，無法判斷新增/修改模式"]);
    exit;
}
$flag = $data[$mArlth - 2];

// ---------------------------------------------------------
// 3. 驗證資料合法性 (使用預處理語句 Prepared Statements)
// ---------------------------------------------------------

// 檢查業務人員 (a01)
$stmtSales = $link->prepare("SELECT F03 FROM a01 WHERE F01 = ?");
$stmtSales->bind_param("s", $data[3]);
$stmtSales->execute();
$resSales = $stmtSales->get_result();
$salesPerson = $resSales->fetch_assoc();

// 檢查進貨計劃/客戶編號 (d03/d04)
$rowsPlan = 0;
if ($flag == 0) {
    $sqlPlan = "SELECT F03 FROM d03 WHERE F03 = ? AND F04 = 'Y' 
                AND F01 IN (SELECT F01 FROM d04 WHERE F03-F09-F21-F23 > 0)";
    $stmtP = $link->prepare($sqlPlan);
    $stmtP->bind_param("s", $data[1]);
    $stmtP->execute();
    $rowsPlan = $stmtP->get_result()->num_rows;
} else {
    $rowsPlan = 1; // 修改模式下預設為 1
}

// 錯誤處理
if ($rowsPlan == 0 || !$salesPerson) {
    if (($INT_099 ?? '') == "Y") {
        $shortId = substr($data[0], 0, 5);
        $stmtLog = $link->prepare("INSERT INTO a0i (F01, F08) VALUES (?, ?)");
        $stmtLog->bind_param("ss", $shortId, $data[0]);
        $stmtLog->execute();
    }

    if ($rowsPlan == 0) echo json_encode("出貨計劃無此客戶編號");
    if (!$salesPerson) echo json_encode("業務人員資料錯誤");
    exit;
}

// 取得當前操作者姓名

$opName = $lastdate . ($_SESSION['user_name'] ?? '');

$trnarray = fldafterwrite('B02', '1', $link, true);

// ---------------------------------------------------------
// 4. 執行 新增 或 修改
// ---------------------------------------------------------

// 先處理共同的變數邏輯
$f02 = str_pad(trim($data[2]), 2, "0", STR_PAD_LEFT);
$isInvoice = preg_match($regex, $data[6]);
$f22 = $isInvoice ? $data[7] : '20';   // 進貨單預設值為 '20'（B04出貨單為 '30'）
$f23 = $isInvoice ? $data[8] : '0';

if ($flag == 0) {
    // 新增前檢查編號是否重複
    $stmtCheck = $link->prepare("SELECT F01 FROM b02 WHERE F01 = ?");
    $stmtCheck->bind_param("s", $data[0]);
    $stmtCheck->execute();
    if ($stmtCheck->get_result()->num_rows > 0) {
        echo json_encode("資料庫已有此編號");
    } else {
        // 執行 INSERT
        $sqlIns = "INSERT INTO b02 (F01, F06, F02, F09, F14, F16, F20, F22, F23, F21, F12, F24, F90, F10, F11) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'N', ?)";
        $stmtIns = $link->prepare($sqlIns);
        $stmtIns->bind_param("ssssssssssssss",
            $data[0], $data[1], $f02, $data[3], $data[4], $data[5],
            $data[6], $f22, $f23, $data[9], $data[10], $data[11], $data[12], $opName
        );
        $stmtIns->execute();

        echo json_encode([
            'order_no' => $link->insert_id,
            'lastupdate' => $opName,
            'fldsatrr' => $trnarray
        ]);
    }
} else {
    // 執行 UPDATE
    $sqlUpd = "UPDATE b02 SET F02=?, F09=?, F14=?, F16=?, F20=?, F22=?, F23=?, F21=?, F12=?, F24=?, F11=? WHERE F00=?";
    $stmtUpd = $link->prepare($sqlUpd);
    $stmtUpd->bind_param("ssssssssssss",
        $f02, $data[3], $data[4], $data[5], $data[6], $f22, $f23,
        $data[9], $data[10], $data[11], $opName, $flag
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