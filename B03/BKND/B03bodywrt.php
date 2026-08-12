<?php
require_once("../../include/BKND/auth_check.php"); //驗證
header('Content-Type: application/json; charset=utf-8');

// 1. 接收資料並解析
$str_json = file_get_contents('php://input'); // ($_POST doesn't work here)

// 對齊 B04bodywrt.php 修法：前端改為單次 stringify(真實物件)，這裡直接一次解碼
$cart = json_decode($str_json, true);
if ($cart === null) {
    echo json_encode("payload 解碼失敗");
    exit;
}

$brr = array();
foreach ($cart as $key => $val) {
    $brr[] = addslashes($val); // 避免單引號字串錯亂
}

require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldDOMset.php";

// 2. 基礎資訊獲取
$lastdate = date('Y-m-d');
$trnarray = fldafterwrite('B03', '2', $link, true);

// 【新增防呆】陣列長度檢查，避免存取超出範圍出現 Warning
if (count($brr) < 10) {
    echo json_encode("傳入資料筆數不足");
    exit;
}

try {
    // 開啟事務處理
    $link->begin_transaction();

    // --- 驗證區 ---

    // A. 檢查退貨部門 (F13='Y')
    $stmt5 = $link->prepare("SELECT F01 FROM a14 WHERE F04='Y' AND F13='Y' AND F01 = ?");
    $stmt5->bind_param("s", $brr[5]);
    $stmt5->execute();
    if ($stmt5->get_result()->num_rows === 0) {
        throw new Exception("無此退貨部門");
    }

    // B. 檢查進貨紀錄與可退/可折讓數量 (串接 b0b 與 d04，FOR UPDATE 鎖定行防止併發問題)
    $sql_plan = "SELECT b0b.*, d04.F01 AS F0A, d04.F09 AS F0I, d04.F24 
                 FROM b0b 
                 JOIN d04 ON d04.F01 = b0b.F07 AND d04.F02 = b0b.F03
                 WHERE b0b.F03 = ? AND b0b.F07 = ? AND (d04.F09 - d04.F24) >= 0 AND d04.F01 = ? AND d04.F02 = ?
                 FOR UPDATE";
    $stmt_plan = $link->prepare($sql_plan);
    $stmt_plan->bind_param("ssss", $brr[1], $brr[2], $brr[2], $brr[1]);
    $stmt_plan->execute();
    $list1 = $stmt_plan->get_result()->fetch_assoc();

    if (!$list1) {
        throw new Exception("此出貨紀錄無可退或可折讓數量");
    }

    // 檢查退出數量是否超過已進數量上限
    $qty_diff = $list1['F0I'] - $list1['F24'] - $brr[3];
    if ($qty_diff < 0) {
        throw new Exception("此筆退出數量超過已進數量:" . strval(abs($qty_diff)));
    }

    // C. 獲取使用者名稱
    
    $update_tag = $lastdate . ($_SESSION['user_name'] ?? '');

    // D. 查詢表頭狀態 (確認 F24 是否為折讓單)
    $stmt_b03 = $link->prepare("SELECT F24 FROM b03 WHERE F01 = ?");
    $stmt_b03->bind_param("s", $brr[0]);
    $stmt_b03->execute();
    $list5 = $stmt_b03->get_result()->fetch_assoc();

    // --- 執行區 ---

    $mArlth = count($brr);
    $mode_id = $brr[$mArlth - 2]; // 判斷新增 (0) 或修改 (F00)

    if ($mode_id == 0) {
        // 新增模式：檢查重複品號與單號
        $stmt_check = $link->prepare("SELECT F00 FROM b0c WHERE F01 = ? AND F03 = ? AND F07 = ?");
        $stmt_check->bind_param("sss", $brr[0], $brr[1], $brr[2]);
        $stmt_check->execute();
        if ($stmt_check->get_result()->num_rows > 0) {
            throw new Exception("品號及訂單號碼重複，請至該筆修改數量");
        }

        // 寫入進貨退出明細表 b0c
        $sql_ins = "INSERT INTO b0c (F01, F03, F07, F04, F15, F05, F08, F09, F12, F13) VALUES (?,?,?,?,?,?,?,?,?,?)";
        $stmt_ins = $link->prepare($sql_ins);
        $stmt_ins->bind_param("ssssssssss", $brr[0], $brr[1], $brr[2], $brr[3], $brr[4], $brr[5], $brr[6], $brr[7], $brr[8], $update_tag);
        $stmt_ins->execute();
        $target_id = $link->insert_id;

    } else {
        // 修改模式：更新 b0c 明細
        if (!empty($brr[8])) {
            $sql_upd = "UPDATE b0c SET F04 = F04 + ?, F15 = ?, F05 = ?, F08 = ?, F09 = ?, F12 = ?, F13 = ? WHERE F00 = ?";
            $stmt_upd = $link->prepare($sql_upd);
            $stmt_upd->bind_param("dssssssi", $brr[3], $brr[4], $brr[5], $brr[6], $brr[7], $brr[8], $update_tag, $mode_id);
        } else {
            $sql_upd = "UPDATE b0c SET F04 = F04 + ?, F15 = ?, F05 = ?, F08 = ?, F09 = ?, F13 = ? WHERE F00 = ?";
            $stmt_upd = $link->prepare($sql_upd);
            $stmt_upd->bind_param("dsssssi", $brr[3], $brr[4], $brr[5], $brr[6], $brr[7], $update_tag, $mode_id);
        }
        $stmt_upd->execute();
        $target_id = $mode_id;
    }

    // 非折讓單（F24 < 3）時，回寫進貨單明細 d04 累計退貨量
    if (isset($list5['F24']) && intval($list5['F24']) < 3) {
        $stmt_upd_d04 = $link->prepare("UPDATE d04 SET F24 = F24 + ? WHERE F02 = ? AND F01 = ?");
        $stmt_upd_d04->bind_param("dss", $brr[3], $brr[1], $brr[2]);
        $stmt_upd_d04->execute();
    }

    // 提交事務
    $link->commit();

    echo json_encode([
        'order_no' => $target_id,
        'lastupdate' => $update_tag,
        'fldsatrr' => $trnarray
    ]);

} catch (Exception $e) {
    // 發生例外，撤回資料庫變更
    $link->rollback();
    echo json_encode($e->getMessage());
}

$link->close();
?>