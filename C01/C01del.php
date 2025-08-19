<?php
  header("Content-Type:text/html; charset=utf-8");   
   include("../include/mysqli_server.php");      
   $delmsg=$_POST['filename'];
   $sql="select * from `c02`,`c01` where c02.F01=c01.F44 and c01.F00='".$delmsg."'"; 
        $sql2=mysqli_query($link,$sql);
        $rows=@mysqli_num_rows($sql2);
		if($rows>0){			 			
			echo "已有報價紀錄，不得刪除！";
        }else{
	         $mscnt="DELETE FROM `c01` where `F00`='".$delmsg."'";
	         $sql=$mscnt;                           
             mysqli_query($link ,$sql) or die(mysqli_error($link));  
	         echo 1;
		}
		mysqli_close($link);
	//echo json_encode(1);
?>
