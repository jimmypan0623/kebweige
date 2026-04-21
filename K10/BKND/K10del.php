<?php
  header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
   $delmsg=$_POST['filename'];    
   $sql7="select F10 from k08 where F01='".$delmsg."'"; 
    $sql8=@mysqli_query($link,$sql7);                       
    $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過
	if($list2['F10']!='Y'){
       $k25update="UPDATE k25 SET k25.F28=k25.F28+(-1)
       *(SELECT k0h.F05 FROM k0h WHERE k25.F15=k0h.F03 AND k0h.F01='".$delmsg."') 
       WHERE k25.F15 IN (SELECT F03 FROM k0h WHERE F01='".$delmsg."')";
       mysqli_query($link ,$k25update) or die(mysqli_error($link));    	  
       $mscnt="DELETE FROM k0h WHERE k0h.F01='".$delmsg."'";
       $sql=$mscnt;                           
       mysqli_query($link ,$sql) or die(mysqli_error($link));  
       $mscnb="DELETE FROM k08 WHERE k08.F01='".$delmsg."'";
       $sql1=$mscnb;                          
       mysqli_query($link ,$sql1) or die(mysqli_error($link));  
	   mysqli_close($link);
	   echo 1;
	}else{
	    echo ("此沖銷單已被確認過，無法刪除"); 
	}
	//echo json_encode(1);
?>
