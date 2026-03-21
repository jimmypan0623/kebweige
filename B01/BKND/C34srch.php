<?php
    
 header("Content-Type: application/json; charset=utf-8");
 include("../../include/BKND/mysqli_server.php");                      //引用檔 
	$str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	$cust_no  = mysqli_real_escape_string($link, $str[0]);
    $part_no  = mysqli_real_escape_string($link, $str[1]); 
	$sql3 = "SELECT `F03` FROM `c34` WHERE `F01` = '$cust_no' AND `F02` = '$part_no' LIMIT 1";
	 //$sql3="SELECT `F03` FROM `c34` WHERE `F01` ='".$str[0]."' AND `F02`='".$str[1]."' "	;	 

    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	$rows=@mysqli_num_rows($sql4);
	if($rows>0){
	    while ($list3=mysqli_fetch_assoc($sql4)){
		 
		    $atr = array('custompartno'=>$list3['F03']);                              
		    array_push($arr,$atr);
	    }
	}else{
	    $atr = array('custompartno'=>"");                              
		    array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
       
		 
 		 
          
?>  

 