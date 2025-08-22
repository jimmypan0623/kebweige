<?php
 header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");     
   $delmsg=$_POST['filename'];
    $sql="select * from `a02`,`a03` where a02.F03=a03.F01 and a03.F00='".$delmsg."'"; 
        $sql2=mysqli_query($link,$sql);
        $rows=@mysqli_num_rows($sql2);
		if($rows>0){			 			
			echo "已授權人員使用此功能，不得刪除！";
        }else{
	         $mscnt="DELETE FROM `a03` where `F00`='".$delmsg."'";
	         $sql=$mscnt;
                           
             mysqli_query($link ,$sql) or die(mysqli_error($link));  
	 
	         echo 1;
		}
	mysqli_close($link);
?>
