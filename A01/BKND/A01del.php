<?php
 header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");     
   $delmsg=$_POST['filename'];
        $sql="SELECT * FROM `a02`,`a03` WHERE a02.F03=a03.F01 AND a03.F00='".$delmsg."'"; 
        $sql2=mysqli_query($link,$sql);
        $rows=@mysqli_num_rows($sql2);
		if($rows>0){			 			
			echo "已授權人員使用此功能，不得刪除！";
		}else{	
			$sq3="SELECT * FROM `a04`,`a03` WHERE a04.F01=a03.F01 AND a03.F00='".$delmsg."'"; 
            $sql4=mysqli_query($link,$sq3);
            $rows1=@mysqli_num_rows($sql4);
			if($rows1>0){
				echo "已設定該功能畫面欄位，請先至頁籤「畫面欄位設定」全部刪除後再至表頭刪除此筆紀錄！";
			}else{
				 $mscnt="DELETE FROM `a03` WHERE `F00`='".$delmsg."'";
				 $sql=$mscnt;                          
				 mysqli_query($link ,$sql) or die(mysqli_error($link));  	 
				 echo 1;
			}
		}
	mysqli_close($link);
?>
