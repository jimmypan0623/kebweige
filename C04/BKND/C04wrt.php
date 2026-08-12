<?php
require_once("../../include/BKND/auth_check.php"); //驗證
$str_json = file_get_contents('php://input');
$response = json_decode($str_json, true);   // 前端已改為單次 stringify(真實物件)，這裡直接一次解碼

if ($response === null) {
    echo json_encode("payload 解碼失敗");
    exit;
}

$brr = array();
foreach ($response as $key => $val) {
    $brr[] = addslashes($val);
}

require_once("../../include/BKND/mysqli_server.php");
require_once "../../include/BKND/fieldDOMset.php";

// 合併成一筆 SQL，只查詢需要的欄位 (F01, F06)，避免用 select *
$sq20 = "SELECT F01, F06 FROM a26 WHERE F01 IN ('INT_013', 'INT_099')";
$sql20 = @mysqli_query($link, $sq20);

$INT_013 = null;
$INT_099 = null;
while ($list8 = mysqli_fetch_assoc($sql20)) {
    if ($list8['F01'] == 'INT_013') {
        $INT_013 = $list8['F06'];
    } elseif ($list8['F01'] == 'INT_099') {
        $INT_099 = $list8['F06'];
    }
}

$trnarray = fldafterwrite('C04', '1', $link, true);

// $sql5/$rows2 查業務人員 (a01)，$sql3/$rows1 查客戶 (c01)
$sql5 = "select * from a01 where BINARY F01='" . $brr[3] . "'";
$sql6 = mysqli_query($link, $sql5) or die(mysqli_error($link));
$rows2 = @mysqli_num_rows($sql6);

$sql3 = "select * from c01 where BINARY F01='" . $brr[1] . "'";
$sql4 = mysqli_query($link, $sql3) or die(mysqli_error($link));
$rows1 = @mysqli_num_rows($sql4);

if ($rows1 == 0 || $rows2 == 0) {
    if ($INT_013 == "Y" && $INT_099 == "Y") {
        $sql7 = "INSERT a0i(F01,F08) values ('" . substr($brr[0], 0, 5) . "','" . $brr[0] . "')";
        $sql8 = mysqli_query($link, $sql7) or die(mysqli_error($link));
    }
    if ($rows1 == 0) echo json_encode("客戶資料錯誤");
    if ($rows2 == 0) echo json_encode("業務人員資料錯誤");   // 修正：原本寫成 $rows1==2
} else {
    
    $lastdate = date('Y-m-d');
    $mArlth = count($brr);

    if ($brr[$mArlth - 2] == 0) {   // 新增
        $sql = "select * from c03 where F01='" . $brr[0] . "'";
        $sql2 = mysqli_query($link, $sql);
        $rows = @mysqli_num_rows($sql2);
        if ($rows > 0) {
            echo json_encode("資料庫已有此編號");
        } else {
            $mscnt = "INSERT INTO c03(F01,F03,F02,F07,F12,F14,F06,F13,F10) VALUES (";
            $mscnt .= "'" . $brr[0] . "',";
            $mscnt .= "'" . $brr[1] . "',";
            $mscnt .= "'" . $brr[2] . "',";
            $mscnt .= "'" . $brr[3] . "',";
            $mscnt .= "'" . $brr[4] . "',";
            $mscnt .= "'" . $brr[5] . "',";
            $mscnt .= "'" . $brr[6] . "',";
            $mscnt .= "'" . $brr[7] . "',";
            $mscnt .= "'" . $lastdate . $_SESSION['user_name'] . "')";
            mysqli_query($link, $mscnt) or die(mysqli_error($link));
            $last_id = mysqli_insert_id($link);
            echo json_encode(array(
                'order_no' => $last_id,
                'lastupdate' => $lastdate . $_SESSION['user_name'],
                'fldsatrr' => $trnarray
            ));
        }
    } else {   // 修改
        $mscnt  = "UPDATE c03 SET F03='" . $brr[1] . "',";
        $mscnt .= "F02='" . $brr[2] . "',";
        $mscnt .= "F07='" . $brr[3] . "',";
        $mscnt .= "F12='" . $brr[4] . "',";
        $mscnt .= "F14='" . $brr[5] . "',";
        $mscnt .= "F06='" . $brr[6] . "',";
        $mscnt .= "F13='" . $brr[7] . "',";
        $mscnt .= "F10='" . $lastdate . $_SESSION['user_name'] . "'";
        $mscnt .= " WHERE F00='" . $brr[$mArlth - 2] . "'";
        mysqli_query($link, $mscnt) or die(mysqli_error($link));
        echo json_encode(array(
            'order_no' => $brr[$mArlth - 2],
            'lastupdate' => $lastdate . $_SESSION['user_name'],
            'fldsatrr' => $trnarray
        ));
    }
}
mysqli_close($link);