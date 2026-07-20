<?php
require_once("../../include/BKND/auth_check.php"); //驗證
  header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");        
   $delmsg=$_POST['filename'];
    $sql="select * from `d02`,`d01` where d02.F01=d01.F01 and d01.F00='".$delmsg."'"; 
        $sql2=mysqli_query($link,$sql);
        $rows=@mysqli_num_rows($sql2);
		if($rows>0){			 			
			echo "已有詢價紀錄，不得刪除！";
        }else{
			$sql3="SELECT * FROM `d11`,`d01` WHERE d11.F02=d01.F01 AND d01.F00='".$delmsg."'"; 
			 $sql4=mysqli_query($link,$sql3);
			 $rows2=@mysqli_num_rows($sql4); 
			 if($rows2>0){			 			
				echo "已有進貨紀錄，不得刪除！";
			}else{
				 $mscnt="DELETE FROM `d01` where `F00`='".$delmsg."'";
				 $sql=$mscnt;                           
				 mysqli_query($link ,$sql) or die(mysqli_error($link));  
				 echo 1;
			}
		}
		mysqli_close($link);

?>
