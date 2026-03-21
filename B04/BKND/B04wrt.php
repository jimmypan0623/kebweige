<?php
header('Content-Type: application/json'); // 確保瀏覽器知道回傳的是 JSON

// 1. 取得 JSON 並解碼
$str_json = file_get_contents('php://input');
 $response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);
$data=array();
foreach($cart as $key=>$val){	   
    $data[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}

// 2. 引入必要的資料庫與設定檔
include("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldDOMset.php";

$regex = "/^[A-Z]{2}[0-9]{8}$/";
$lastdate = date('Y-m-d');
$userAccount = $_COOKIE['useraccount'] ?? '';

// 取得陣列最後倒數第二個值作為標記 (Flag)
$mArlth = count($data);
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

// 檢查出貨計劃/客戶編號 (c03/c04)
$rowsPlan = 0;
if ($flag == 0) {
    $sqlPlan = "SELECT F03 FROM c03 WHERE F03 = ? AND F04 = 'Y' 
                AND F01 IN (SELECT F01 FROM c04 WHERE F03-F09-F21-F23 > 0)";
    $stmtP = $link->prepare($sqlPlan);
    $stmtP->bind_param("s", $data[1]);
    $stmtP->execute();
    $rowsPlan = $stmtP->get_result()->num_rows;
} else {
    $rowsPlan = 1; // 修改模式下預設為 1
}

// 錯誤處理
if ($rowsPlan == 0 || !$salesPerson) {
    if (($_COOKIE["INT_099"] ?? '') == "Y") {
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
$stmtOp = $link->prepare("SELECT F03 FROM a01 WHERE F01 = ?");
$stmtOp->bind_param("s", $userAccount);
$stmtOp->execute();
$opData = $stmtOp->get_result()->fetch_assoc();
$opName = $lastdate . ($opData['F03'] ?? '');

$trnarray = fldafterwrite('B04', '1', $link, true);

// ---------------------------------------------------------
// 4. 執行 新增 或 修改
// ---------------------------------------------------------

// 先處理共同的變數邏輯
$f02 = str_pad(trim($data[2]), 2, "0", STR_PAD_LEFT);
$isInvoice = preg_match($regex, $data[6]);
$f22 = $isInvoice ? $data[7] : '30';
$f23 = $isInvoice ? $data[8] : '0';

if ($flag == 0) {
    // 新增前檢查編號是否重複
    $stmtCheck = $link->prepare("SELECT F01 FROM b04 WHERE F01 = ?");
    $stmtCheck->bind_param("s", $data[0]);
    $stmtCheck->execute();
    if ($stmtCheck->get_result()->num_rows > 0) {
        echo json_encode("資料庫已有此編號");
    } else {
        // 執行 INSERT
        $sqlIns = "INSERT INTO b04 (F01, F06, F02, F09, F14, F16, F20, F22, F23, F21, F12, F24, F90, F10, F11) 
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
    $sqlUpd = "UPDATE b04 SET F02=?, F09=?, F14=?, F16=?, F20=?, F22=?, F23=?, F21=?, F12=?, F24=?, F11=? WHERE F00=?";
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
