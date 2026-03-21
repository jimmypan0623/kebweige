<?php
   header("Content-Type: application/json; charset=utf-8");

 include("../../include/BKND/mysqli_server.php");                      //引用檔 
  
/* 	$str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	 $sql3="SELECT `F04` FROM `b11` WHERE `F01` ='".$str[0]."' AND `F03`='".$str[1]."' "	;	 
	 

    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	$rows=@mysqli_num_rows($sql4);
	if($rows>0){
	    while ($list3=mysqli_fetch_assoc($sql4)){
		 
		    $atr = array('QtyOnHand'=>$list3['F04']);                              
		    array_push($arr,$atr);
	    }
	}else{
	    $atr = array('QtyOnHand'=>0);                              
		    array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";   */  
       
		 
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

 