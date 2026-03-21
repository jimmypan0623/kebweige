<?php
   header('Content-Type: application/json; charset=utf-8');

 include("../../include/BKND/mysqli_server.php");               //引用檔   
	$filename = mysqli_real_escape_string($link, $_POST['filename']);
    $sql3 = "SELECT `F02`, `F00` FROM `a01` WHERE binary `F01` = '$filename'";

    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	$rows=@mysqli_num_rows($sql4);
	if($rows>0){
	    while ($list3=mysqli_fetch_assoc($sql4)){
		 
		    $atr = array('passWord'=>$list3['F02'],'userId'=>$list3['F00']);                              
		    array_push($arr,$atr);
	    }
	}else{
	    $atr = array('passWord'=>"",'userId'=>"");                              
		    array_push($arr,$atr);
	}
	mysqli_free_result($sql4);
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
 
          
?>  

 