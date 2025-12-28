<?php
  header("Content-Type:text/html; charset=utf-8");   
    include("../../include/BKND/mysqli_server.php");                              //引用檔   
   $delmsg=$_POST['filename'];   
   $sql7="SELECT b02.F10,b0b.F00 FROM b02,b0b WHERE b02.F01=b0b.F01 AND b0b.F00='".$delmsg."'"; 
    $sql8=@mysqli_query($link,$sql7);                       
    $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過
	if($list2['F10']!='Y'){
	   
		$d04update="UPDATE d04 set d04.F23=d04.F23+(-1)
		*(SELECT b0b.F04 from b0b where d04.F01=b0b.F07 and d04.F02=b0b.F03 and b0b.F00='".$delmsg."') 
		where CONCAT(d04.F01,d04.F02) in (select CONCAT(F07,F03) from b0b where F00='".$delmsg."')";
		mysqli_query($link ,$d04update) or die(mysqli_error($link));
	   
		  $mscnt="DELETE FROM `b0b` where `F00`='".$delmsg."'";
		 $sql=$mscnt;
							   
		mysqli_query($link ,$sql) or die(mysqli_error($link));  
		mysqli_close($link);
		echo 1;
		//echo json_encode(1);
	}else{
	    echo ("此進貨單已被確認過，無法刪除"); 
	}
?>
