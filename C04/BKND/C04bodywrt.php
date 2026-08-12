<?php
require_once("../../include/BKND/auth_check.php");

$str_json = file_get_contents('php://input');
$response = json_decode($str_json, true);   // 前端已修正為單次 stringify(真實物件)，這裡可以直接一次解碼

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
$trnarray = fldafterwrite('C04', '2', $link, true);

$sql5 = "select * from b01 where BINARY F01='" . $brr[1] . "'";
$sql6 = mysqli_query($link, $sql5) or die(mysqli_error($link));
$rows2 = @mysqli_num_rows($sql6);

if ($rows2 == 0) {
    echo json_encode("料品編號錯誤");
} else {
    
    $lastdate = date('Y-m-d');
    $mArlth = count($brr);

    // F07 是 JSON 欄位（分批出貨明細），來源是 elem5；做一次格式驗證再存入
    $f07_raw = isset($response['elem5']) ? $response['elem5'] : '';
    if (json_decode($f07_raw) === null) {
        echo json_encode("分批出貨資料格式錯誤");
        exit;
    }
    $f07_json = addslashes($f07_raw);

    if ($brr[$mArlth - 2] == 0) {
        $sql = "select * from c04 where F01='" . $brr[0] . "' and F02='" . $brr[1] . "'";
        $sql2 = mysqli_query($link, $sql);
        $rows = @mysqli_num_rows($sql2);
        if ($rows > 0) {
            echo json_encode("資料庫已有此紀錄");
        } else {
            $mscnt = "INSERT INTO c04(F01, F02, F03, F04, F05, F06, F07, F12) VALUES (";
            $mscnt .= "'" . $brr[0] . "',";
            $mscnt .= "'" . $brr[1] . "',";
            $mscnt .= "'" . $brr[2] . "',";
            $mscnt .= "'" . $brr[3] . "',";
            $mscnt .= "'" . $brr[4] . "',";
            $mscnt .= "'" . $brr[5] . "',";
            $mscnt .= "'" . $f07_json . "',";
            $mscnt .= "'" . $lastdate . $_SESSION['user_name'] . "')";
            mysqli_query($link, $mscnt) or die(mysqli_error($link));
            $last_id = mysqli_insert_id($link);
            echo json_encode(array(
                'order_no' => $last_id,
                'lastupdate' => $lastdate . $_SESSION['user_name'],
                'fldsatrr' => $trnarray
            ));
        }
    } else {
        $mscnt  = "UPDATE c04 SET F03='" . $brr[2] . "',";
        $mscnt .= "F04='" . $brr[3] . "',";
        $mscnt .= "F05='" . $brr[4] . "',";
        $mscnt .= "F06='" . $brr[5] . "',";
        $mscnt .= "F07='" . $f07_json . "',";
        $mscnt .= "F12='" . $lastdate . $_SESSION['user_name'] . "'";
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