<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../include/mysqli_server.php");                              //引用檔   
	$str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列 
     $sql3="SELECT `F03` FROM c0z WHERE `F01` ='".$str[0]."' AND `F02`='".$str[1]."-".nouem($str[2])."'";	 	 	 
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	$rows=@mysqli_num_rows($sql4);
	if($rows>0){
	    while ($list3=mysqli_fetch_array($sql4)){
		 
		    $atr = array('curncy'=>$list3['F03']);                              
		    array_push($arr,$atr);
	    }
	}else{
	    $atr = array('curncy'=>0);                              
		    array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
  
       
		 
function nouem($flg){
	$td='01';
	if((int)$flg<11){
		$td='01';
	}else if((int)$flg>20){
	    $td='21';
	}else{
	    $td='11';
	}
	return $td;
} 	 		 
          
?>  

 