<?php
  header("Content-Type:text/html; charset=utf-8");   
    require_once("../../include/BKND/mysqli_server.php");                              //引用檔        
   $delmsg=$_POST['filename'];    
   $sql7="select F10 from b06 where F01='".$delmsg."'"; 
    $sql8=@mysqli_query($link,$sql7);                       
    $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過
    if($list2['F10']!='Y'){ 
	   $mscnt="DELETE FROM b0f where b0f.F01='".$delmsg."'";
	   $sql=$mscnt;                           
		mysqli_query($link ,$sql) or die(mysqli_error($link));  
	   $mscnb="DELETE FROM b06 where b06.F01='".$delmsg."'";
	   $sql1=$mscnb;
							   
		mysqli_query($link ,$sql1) or die(mysqli_error($link));  
		mysqli_close($link);
		echo 1;
		//echo json_encode(1);
	}else{
	    echo ("此移轉單已被確認過，無法刪除"); 
	}
?>
