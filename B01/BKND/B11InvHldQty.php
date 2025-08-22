<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                      //引用檔 
  
	$str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	 $sql3="SELECT `F04` FROM `b11` WHERE `F01` ='".$str[0]."' AND `F03`='".$str[1]."' "	;	 
	 

    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	$rows=@mysqli_num_rows($sql4);
	if($rows>0){
	    while ($list3=mysqli_fetch_array($sql4)){
		 
		    $atr = array('QtyOnHand'=>$list3['F04']);                              
		    array_push($arr,$atr);
	    }
	}else{
	    $atr = array('QtyOnHand'=>0);                              
		    array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
       
		 
 		 
          
?>  

 