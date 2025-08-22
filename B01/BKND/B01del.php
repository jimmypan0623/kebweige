<?php
  header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                      //引用檔    
   $delmsg=$_POST['filename'];
        $sql1="select * from `c02`,`b01` where c02.F03=b01.F01 and b01.F00='".$delmsg."'"; 
        $sql2=mysqli_query($link,$sql1);
        $rows1=@mysqli_num_rows($sql2);
		if($rows1>0){			 			
			echo "已有報價紀錄，不得刪除！";
        }else{
			 $sql3="select * from `d02`,`b01` where d02.F03=b01.F01 and b01.F00='".$delmsg."'"; 
             $sql4=mysqli_query($link,$sql3);
             $rows2=@mysqli_num_rows($sql4);
		     if($rows2>0){			 			
			    echo "已有詢價紀錄，不得刪除！";
             }else{
	            $mscnt="DELETE FROM `b01` where `F00` ='".$delmsg."'";  //先把準備刪除的SQL 語法後半段先寫在字串中
	 
	            $sql=$mscnt;
                           
                mysqli_query($link ,$sql) or die(mysqli_error($link));  
			    echo 1;
			 }
		}
	mysqli_close($link);
	
	//echo json_encode(1);
?>
