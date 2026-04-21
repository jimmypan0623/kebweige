<?php   
require_once("../../include/BKND/mysqli_server.php");                              //引用檔      
    $delmsg=$_POST['filename'];
   $sql7="SELECT `F10` FROM `k08` where `F01`='".$delmsg."'"; 
   $sql8=@mysqli_query($link,$sql7);                       
   $list2=mysqli_fetch_assoc($sql8);  //檢查是否已反確認過
 if($list2['F10']=='Y'){
     $sql0="select * from a01 where F01="."'".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
     $rows1=@mysqli_num_rows($sql1);                       
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前操作者姓名   
     $lastdate=date('Y'.'-'.'m'.'-'.'d');
     $mscnt[]="DELETE FROM `k09` where `F05`='".$delmsg."'";	        
	 foreach ($mscnt as $delvalue){
		    mysqli_query($link ,$delvalue) or die(mysqli_error($link)); 
	 }
        $k25update1="UPDATE k25 SET k25.F27=k25.F27+(-1)
       *(SELECT k0h.F05 FROM k0h WHERE k25.F15=k0h.F03 AND k0h.F01='".$delmsg."') 
	   WHERE k25.F15 IN (SELECT F03 FROM k0h WHERE F01='".$delmsg."')";
       mysqli_query($link ,$k25update1) or die(mysqli_error($link));    
	   
          $k25update2="UPDATE k25 SET k25.F28=k25.F28+(1)
       *(SELECT k0h.F05 FROM k0h WHERE k25.F15=k0h.F03 AND k0h.F01='".$delmsg."') 
	   WHERE k25.F15 IN (SELECT F03 FROM k0h WHERE F01='".$delmsg."')";
       mysqli_query($link ,$k25update2) or die(mysqli_error($link));    
	   
	$mscnt="UPDATE `k08` SET `F10`='N',`F13`='".$lastdate.$list4['F03']."' WHERE `F01`='".$delmsg."'";								   
		mysqli_query($link ,$mscnt) or die(mysqli_error($link)); 
		$arr = array ('order_no'=>1,'lastupdate'=>$lastdate.$list4['F03']);
		echo json_encode($arr);
}else{
	   echo json_encode("此沖銷單已被反確認過"); 
} 
mysqli_close($link);	
 	
?>
 