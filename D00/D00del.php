<?php
  header("Content-Type:text/html; charset=utf-8");   
   include("../include/mysqli_server.php");      
   $delmsg=$_POST['filename'];
   $sql="select * from `d0Z`,`d00` where d0Z.F01=d00.F01 and d00.F00='".$delmsg."'"; 
    $sql2=mysqli_query($link,$sql);
        $rows=@mysqli_num_rows($sql2);
		if($rows>0){			 			
			echo "已有三旬匯率，不得刪除！";
		}else{
	       $mscnt="DELETE FROM `d00` where `F00`='".$delmsg."'";
	       $sql=$mscnt;                           
          mysqli_query($link ,$sql) or die(mysqli_error($link));  
		  echo 1;
		}
	mysqli_close($link);
	
	//echo json_encode(1);
?>
