<?php
  header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
   $delmsg=$_POST['filename'];   
   $sql7="select k08.F10,k0h.F00 from k08,k0h where k08.F01=k0h.F01 and k0h.F00='".$delmsg."'"; 
    $sql8=@mysqli_query($link,$sql7);                       
    $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過
	if($list2['F10']!='Y'){
		
		
       $k25update="UPDATE k25 SET k25.F28=k25.F28+(-1)
       *(SELECT k0h.F05 FROM k0h WHERE k25.F15=k0h.F03 AND k0h.F00='".$delmsg."') 
       WHERE k25.F15 IN (SELECT F03 FROM k0h WHERE F00='".$delmsg."')";
 
       mysqli_query($link ,$k25update) or die(mysqli_error($link));   
   
	   $mscnt="DELETE FROM `k0h` WHERE `F00`='".$delmsg."'";
	   $sql=$mscnt;                           
       mysqli_query($link ,$sql) or die(mysqli_error($link));  
	   mysqli_close($link);
	   echo 1;
	}else{
	   echo ("此沖銷單已被確認過，無法刪除"); 
	}
	//echo json_encode(1);
?>
