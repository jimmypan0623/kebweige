<?php
require_once("../../include/BKND/auth_check.php"); //驗證
  header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");         //引用檔     
   $delmsg=$_POST['filename'];
        $sql1="SELECT * FROM `a02`,`a01` WHERE a02.F01=a01.F01 AND a01.F00='".$delmsg."'"; 
        $sql2=mysqli_query($link,$sql1);
        $rows1=@mysqli_num_rows($sql2);
		if($rows1>0){			 			
			echo "此人員已授權，不得刪除！";
        }else{
			 $sql3="SELECT * FROM `c01`,`a01` WHERE (c01.F33=a01.F01 or c01.F23=a01.F01 ) AND a01.F00='".$delmsg."'"; 
             $sql4=mysqli_query($link,$sql3);
             $rows2=@mysqli_num_rows($sql4);
		     if($rows2>0){			 			
			    echo "此人已擔當某些客戶，不得刪除！";
             }else{
			      $sql5="SELECT * FROM `d01`,`a01` WHERE d01.F39=a01.F01 AND a01.F00='".$delmsg."'"; 
                  $sql6=mysqli_query($link,$sql5);
                  $rows3=@mysqli_num_rows($sql6);
		          if($rows3>0){			 			
			          echo "此人已負責某些廠商的採購，不得刪除！";
                  }else{
	                  $mscnt="DELETE FROM `a01` WHERE `F00`='".$delmsg."'";
	                  $sql=$mscnt;
                      mysqli_query($link ,$sql) or die(mysqli_error($link));  
			          echo 1;
				  }
			 }
		}	 
	mysqli_close($link);
?>
