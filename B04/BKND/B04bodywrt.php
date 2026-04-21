<?php
header('Content-Type: application/json; charset=utf-8');

// 1. 接收資料並解析
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}

require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldDOMset.php";

// 2. 基礎資訊獲取
$user_account = $_COOKIE['useraccount'] ?? 'system';
$lastdate = date('Y-m-d');
$trnarray = fldafterwrite('B04', '2', $link, true);

try {
    // 開啟事務處理
    $link->begin_transaction();

    // --- 驗證區 ---

    // A. 檢查出貨部門
    $stmt5 = $link->prepare("SELECT F01 FROM a14 WHERE F04='Y' AND F12='Y' AND F01 = ?");
    $stmt5->bind_param("s", $brr[5]);
    $stmt5->execute();
    if ($stmt5->get_result()->num_rows === 0) {
        throw new Exception("無此出貨部門");
    }

    // B. 檢查計畫與庫存餘額
    $sql_plan = "SELECT c04.*, c03.F01 AS F0A 
                 FROM c04 
                 JOIN c03 ON c04.F01 = c03.F01 
                 WHERE c04.F02 = ? AND c04.F01 = ? AND c03.F03 = ? AND c03.F04 = 'Y' 
                 FOR UPDATE"; // 鎖定行，防止併發扣帳錯誤
    $stmt_plan = $link->prepare($sql_plan);
    $stmt_plan->bind_param("sss", $brr[1], $brr[2], $brr[9]);
    $stmt_plan->execute();
    $list1 = $stmt_plan->get_result()->fetch_assoc();

    if (!$list1) {
        throw new Exception("無此出貨計畫");
    }

    // 數量檢查
    if ($list1['F23'] + $list1['F21'] + $list1['F09'] + $brr[3] > $list1['F03']) {
        $over = ($list1['F23'] + $list1['F21'] + $list1['F09'] + $brr[3]) - $list1['F03'];
        throw new Exception("出貨單數量超出本訂單可出數量: " . $over);
    }

    // C. 獲取使用者名稱
    $stmt_user = $link->prepare("SELECT F03 FROM a01 WHERE F01 = ?");
    $stmt_user->bind_param("s", $user_account);
    $stmt_user->execute();
    $user_res = $stmt_user->get_result()->fetch_assoc();
    $update_tag = $lastdate . ($user_res['F03'] ?? '');

    // --- 執行區 ---

    $mArlth = count($brr);
    $mode_id = $brr[$mArlth - 2]; // 判斷新增或修改的 Flag

    if ($mode_id == 0) {
        // 新增模式：檢查重複
        $stmt_check = $link->prepare("SELECT F00 FROM b0d WHERE F01=? AND F03=? AND F07=?");
        $stmt_check->bind_param("sss", $brr[0], $brr[1], $brr[2]);
        $stmt_check->execute();
        if ($stmt_check->get_result()->num_rows > 0) {
            throw new Exception("品號及訂單號碼重複，請至該筆修改數量");
        }

        // 寫入 b0d
        $sql_ins = "INSERT INTO b0d (F01, F03, F07, F04, F15, F05, F08, F09, F25, F11) VALUES (?,?,?,?,?,?,?,?,?,?)";
        $stmt_ins = $link->prepare($sql_ins);
        $stmt_ins->bind_param("ssssssssss", $brr[0], $brr[1], $brr[2], $brr[3], $brr[4], $brr[5], $brr[6], $brr[7], $brr[8], $update_tag);
        $stmt_ins->execute();
        $target_id = $link->insert_id;

        // 更新 c03
        $stmt_upd_c03 = $link->prepare("UPDATE c03 SET F08='Y' WHERE F01=?");
        $stmt_upd_c03->bind_param("s", $brr[2]);
        $stmt_upd_c03->execute();

    } else {
        // 修改模式
        $sql_upd = "UPDATE b0d SET F04=F04+?, F15=?, F05=?, F08=?, F09=?, F25=?, F11=? WHERE F00=?";
        $stmt_upd = $link->prepare($sql_upd);
        $stmt_upd->bind_param("dssssssi", $brr[3], $brr[4], $brr[5], $brr[6], $brr[7], $brr[8], $update_tag, $mode_id);
        $stmt_upd->execute();
        $target_id = $mode_id;
    }

    // 統一更新 c04 數量 (無論新增或修改)
    $stmt_upd_c04 = $link->prepare("UPDATE c04 SET F23 = F23 + ? WHERE F02 = ? AND F01 = ?");
    $stmt_upd_c04->bind_param("dss", $brr[3], $brr[1], $brr[2]);
    $stmt_upd_c04->execute();

    // 提交事務
    $link->commit();

    echo json_encode([
        'order_no' => $target_id, 
        'lastupdate' => $update_tag, 
        'fldsatrr' => $trnarray
    ]);

} catch (Exception $e) {
    // 發生錯誤，撤回所有更動
    $link->rollback();
    echo json_encode($e->getMessage());
}

$link->close();
?>
 