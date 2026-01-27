<?php
header("Content-Type:text/html; charset=utf-8");   
   include("../../include/BKND/mysqli_server.php");                              //引用檔      
   $delmsg=$_POST['filename'];
   $sql7="SELECT `F07` FROM `a23` where `F01`='".$delmsg."'"; 
   $sql8=@mysqli_query($link,$sql7);                       
   $list2=mysqli_fetch_assoc($sql8);  //檢查是否已反確認過
if(trim($list2['F07'])=="Y"){   
       $NbMthtrn2=(int)substr(trim($delmsg), 0, 4);
	      $NbDaytrn2=(int)substr(trim($delmsg),-2);
		  $NbDaytrn2=$NbDaytrn2+1;
		 if($NbDaytrn2>12){
			 $NbDaytrn2=1;
			 $NbMthtrn2=$NbMthtrn2+1;
		 }
		 $nextMth=(string)$NbMthtrn2.'-'.str_pad((string)$NbDaytrn2,2,"0",STR_PAD_LEFT);
	 $sqla="SELECT F07 FROM a23 where F07='Y' AND F01='".$nextMth."'"; 
     $sqlb=@mysqli_query($link,$sqla); 
	 $rows1=@mysqli_num_rows($sqlb);  
	 if($rows1>0){
		echo json_encode($nextMth."月份庫存尚未反結轉");  
	 }else{
		 
	    $mscnt="UPDATE b25 SET F15=F04-F05-F06+F07+F08-F09+F10-F11+F13-F14,F03=0";	    	  		 
		$mscnt.=" WHERE F90="."'".$nextMth."'";
		$sql=$mscnt;                                                 //寫入MySQL 	 
		mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
	 
	 
			$mscnt="UPDATE `a23` SET `F07`='N'  WHERE `F01`='".$delmsg."'";								   
			mysqli_query($link ,$mscnt) or die(mysqli_error($link)); 
			$arr = array ('order_no'=>1,'lastupdate'=>'');
			echo json_encode($arr);
		
	 }
}else{
	 echo json_encode("此月份庫存已被反結轉過)"); 
}	
	mysqli_close($link);
?>
