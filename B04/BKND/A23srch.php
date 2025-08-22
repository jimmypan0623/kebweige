<?php
   header("Content-Type:text/html; charset=utf-8");   

  include("../../include/BKND/mysqli_server.php");                              //引用檔     
		
	    $searchRecord =$_POST['filename'];
	    $sql1="SELECT * FROM `a23` WHERE F01='".$searchRecord."' "; 
		$sql2=mysqli_query($link,$sql1);
		$rows1=@mysqli_num_rows($sql2);
		if ($rows1==0){			
			$sql5="INSERT INTO `a23` ( `F01`) VALUES ('".$searchRecord."')";
			$sql6=mysqli_query($link,$sql5);
		}
		$sql3="SELECT * FROM `a23` WHERE 1 order by F01 DESC"; 
         
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('crnt_no'=>$list3['F01'],  		            	             
		             'crnt_name'=>'');                      						 
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);

 		echo json_encode(array ('recdrow'=>$arr,'crntkey'=>$searchRecord));		 
          
?>  

 