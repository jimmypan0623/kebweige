<?php
require_once("../../include/BKND/auth_check.php"); //驗證
   header("Content-Type:text/html; charset=utf-8");   

 require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
	 $str = explode('|', $_POST['filename']);  //$_POST['filename']

	 $sql3="SELECT `F02` FROM `a14` WHERE binary `F01` ='".trim($str[0])."' AND `F04`='Y' AND `F01`<>'".trim($str[1])."'";	 	 

    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	$rows=@mysqli_num_rows($sql4);
	if($rows>0){
	    while ($list3=mysqli_fetch_assoc($sql4)){
		 
		    $atr = array('departname'=>$list3['F02']);                              
		    array_push($arr,$atr);
	    }
	}else{
	    $atr = array('departname'=>"");                              
		    array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
       
		 
 		 
          
?>  

 