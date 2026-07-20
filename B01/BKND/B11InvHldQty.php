<?php
require_once("../../include/BKND/auth_check.php"); //驗證
   header("Content-Type: application/json; charset=utf-8");

 require_once("../../include/BKND/mysqli_server.php");                      //引用檔 
	 
// 檢查是否有 POST 傳值
if (!isset($_POST['filename'])) {
    echo json_encode([['QtyOnHand' => 0, 'error' => 'No data received']]);
    exit;
}

$str = explode('|', $_POST['filename']);
$dptno = mysqli_real_escape_string($link, $str[0]);
$stockno = mysqli_real_escape_string($link, $str[1]);

$sql = "SELECT `F04` FROM `b11` WHERE `F01` = '$dptno' AND `F03` = '$stockno' LIMIT 1";
$result = @mysqli_query($link, $sql);

$arr = array();
if ($result && mysqli_num_rows($result) > 0) {
    $list = mysqli_fetch_assoc($result);
    $arr[] = ['QtyOnHand' => (float)$list['F04']];
} else {
    $arr[] = ['QtyOnHand' => 0];
}

mysqli_close($link);
echo json_encode($arr); 		 
          
?>  

 