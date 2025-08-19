<?php
 header("Content-Type:text/html; charset=utf-8");   
   include("../include/mysqli_server.php");      
   $delmsg=$_POST['filename'];
        $sql1="select * from `a01`,`a14` where a01.F04=a14.F01 and a14.F00='".$delmsg."'"; 
        $sql2=mysqli_query($link,$sql1);
        $rows1=@mysqli_num_rows($sql2);
		if($rows1>0){			 			
			echo "已有人員屬於此部門，不得刪除！";
        }else{
			 $sql3="select * from `b11`,`a14` where b11.F01=a14.F01 and a14.F00='".$delmsg."'"; 
             $sql4=mysqli_query($link,$sql3);
             $rows2=@mysqli_num_rows($sql4);
		     if($rows2>0){			 			
			    echo "此部門有庫存紀錄，不得刪除！";
             }else{
			
	             $mscnt="DELETE FROM `a14` where `F00`='".$delmsg."'";
	             $sql=$mscnt;
                 mysqli_query($link ,$sql) or die(mysqli_error($link));  
			     echo 1;
			 }
		}	 
	mysqli_close($link);
	
?>
