<?php
  header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");      
   $askfor=$_POST['filename'];
    
	  $mscnt="select F00,F01,F08 FROM a0i where F01='".$askfor."' ORDER BY F08 limit 1 ";	  
        $sql2=mysqli_query($link,$mscnt);
        $rows=@mysqli_num_rows($sql2);
		$list4=mysqli_fetch_array($sql2);
		if ($rows >0 ){					   
			$getNo= $list4['F08'];
			$delNo= $list4['F00'];
			$mscnt2="DELETE FROM a0i where F00=".$delNo;
			mysqli_query($link ,$mscnt2);		 	
		} else {
			$mscnt3="select F01,F02,F03,F04 FROM a09 where F01='".$askfor."'";
			$sql3=mysqli_query($link,$mscnt3);
			$rows=@mysqli_num_rows($sql3);
			$list5=mysqli_fetch_array($sql3);
			if ($rows >0 ){	
			   $newNo=strval(intval($list5['F04'])+1);
               $getNo=trim($list5['F02']).trim($list5['F03']).str_pad($newNo,5,"0",STR_PAD_LEFT); 
			   $mscnt4="update a09 set F04='".str_pad($newNo,5,'0',STR_PAD_LEFT)."' where F01='".$askfor."'";
		       mysqli_query($link ,$mscnt4);
			}else{
				 $scndchr=(substr($askfor,1,5)=='00000'?1:2);
				 $mscnt5="INSERT INTO a09 (F01,F02,F03,F04) VALUES ('".$askfor."','".substr($askfor,0,$scndchr)."'";
				 $mscnt5.=",'".substr($askfor,2,3)."','00001')";
				 mysqli_query($link ,$mscnt5);
				 $getNo=substr($askfor,0,$scndchr).trim(substr($askfor,2,3)).'00001';
			}
				
		 }  
	 mysqli_close($link); 
	 echo $getNo; 

?>
