<?php
   header("Content-Type:text/html; charset=utf-8");   

 require_once("../../include/BKND/mysqli_server.php");                                 //引用檔
  require_once "../../include/BKND/fieldpreset.php"; // 引入      
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
	   
		
		$sql3="select c0Z.* from c0Z where F01='".$str[0]."' and ".$str[1]." like '%".trim($str[2])."%' order by F02 desc";     
   	  $wthary=fldwdthpre('C00','2',$link);  	
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){		 
		$atr = array('rc_no'.$wthary[0]=>$list3['F00'],		           
					 'dte3h'.$wthary[1]=>$list3['F02'], 
					 'rate'.$wthary[2]=>$list3['F03'],							
                     'lastupdate'.$wthary[3]=>$list3['F04']);                      						 
		array_push($arr,$atr);
	}
	mysqli_close($link);
	    
          $arr = array_values($arr);
          
		  echo json_encode(array ('recdrow'=>$arr,'pgttl'=>12));
          
?>  

 