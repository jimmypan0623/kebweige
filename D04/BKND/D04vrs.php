<?php
require_once("../../include/BKND/auth_check.php"); //驗證
  header("Content-Type:text/html; charset=utf-8");   
  require_once("../../include/BKND/mysqli_server.php");   
   $delmsg=$_POST['filename'];
$sql7="select `F04` from `d03` where `F01`='".$delmsg."'"; 
 $sql8=@mysqli_query($link,$sql7);                       
  $list2=mysqli_fetch_assoc($sql8);  //檢查是否已反確認過
if(trim($list2['F04'])=="Y"){   
   
      $lastdate=date('Y'.'-'.'m'.'-'.'d');


     $mscnt="UPDATE `d03` SET `F04`='N',`F10`='".$lastdate.$_SESSION['user_name']."' where `F01`='".$delmsg."'";
	 
                           
    mysqli_query($link ,$mscnt) or die(mysqli_error($link)); 
	 $arr = array ('order_no'=>1,'lastupdate'=>$lastdate.$_SESSION['user_name']);
	    echo json_encode($arr);
}
mysqli_close($link);

?>
