<?php
    header("Content-Type:text/html; charset=utf-8");   
    require_once("../../include/BKND/mysqli_server.php");     
    $delmsg=$_POST['filename'];
    $sql="SELECT * FROM `c02`,`c01` WHERE c02.F01=c01.F44 AND c01.F00='".$delmsg."'"; 
	$sql2=mysqli_query($link,$sql);
	$rows=@mysqli_num_rows($sql2);
	if($rows>0){			 			
		echo "已有報價紀錄，不得刪除！";
	}else{
		 $sql3="SELECT * FROM `c10`,`c01` WHERE c10.F02=c01.F01 AND c01.F00='".$delmsg."'"; 
	     $sql4=mysqli_query($link,$sql3);
	     $rows2=@mysqli_num_rows($sql4); 
		 if($rows2>0){			 			
		    echo "已有出貨紀錄，不得刪除！";
	    }else{
		     $mscnt="DELETE FROM `c01` WHERE `F00`='".$delmsg."'";
		     $sql=$mscnt;                           
		     mysqli_query($link ,$sql) or die(mysqli_error($link));  
		     echo 1;
	    }
	}
	mysqli_close($link);
?>
