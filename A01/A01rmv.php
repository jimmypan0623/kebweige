<?php
  header("Content-Type:text/html; charset=utf-8");   
   include("../include/mysqli_server.php");      
   $delmsg=$_POST['filename'];
    $sql1="select * from `a02` where F03='".$delmsg."'"; 
        $sql2=mysqli_query($link,$sql1);
        $rows1=@mysqli_num_rows($sql2);
		if($rows1==0){			 			
			echo "此功能授尚未權任何人，無需再解除！";
        }else{	
	        $mscnt="DELETE FROM a02 where F03='".$delmsg."'";
	       $sql=$mscnt;                          
           mysqli_query($link ,$sql) or die(mysqli_error($link));  
	       echo 1;
		}
	mysqli_close($link);
	
	//echo json_encode(1);
?>
