<?php
  header("Content-Type:text/html; charset=utf-8");   
  include("../../include/BKND/mysqli_server.php");         
   $delmsg=$_POST['filename'];
$sql7="select `F04` from `c26` where `F01`='".$delmsg."'"; 
 $sql8=@mysqli_query($link,$sql7);                       
  $list2=mysqli_fetch_array($sql8);  //檢查是否已反確認過
if(trim($list2['F04'])=="Y"){   
   
   $sql0="select * from a01 where F01="."'".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
     $rows1=@mysqli_num_rows($sql1);                       
     $list4=mysqli_fetch_array($sql1);  //紀錄當前操作者姓名   
     $lastdate=date('Y'.'-'.'m'.'-'.'d');

	  $mscnt="DELETE FROM `c02` where `F11`='".$delmsg."'";
	 $sql=$mscnt;
                           
    mysqli_query($link ,$sql) or die(mysqli_error($link)); 
     $mscnt="UPDATE `c26` SET `F04`='N',`F05`='".$lastdate.$list4['F03']."' where `F01`='".$delmsg."'";
	 $sql=$mscnt;
                           
    mysqli_query($link ,$sql) or die(mysqli_error($link)); 
	 $arr = array ('order_no'=>1,'lastupdate'=>$lastdate.$list4['F03']);
	    echo json_encode($arr);
}		
	mysqli_close($link);

?>
