<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");               //引用檔   
	$fieldNo=substr($_POST['filename'],0,3);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);
	  $searchRecord =trim($filterKey);		
	// $sql3="SELECT * FROM `a02` WHERE binary `F03` ='".$fieldNo."' AND `F01`='".$searchRecord."'";	 	 
     $sql3="select a02.F03,a03.F02,a02.F04,a02.F05,a02.F06,a02.F07,a02.F08,a02.F09,a02.F10,a02.F11,a02.F12,a03.F03 AS Ftb from a02,a03 where a03.F01=a02.F03 and a02.F01='".$searchRecord."' AND a02.F03='".$fieldNo."' order by a02.F03"; 	   
    $arr=array();	
	$sql4=@mysqli_query($link,$sql3); 
	$rows=@mysqli_num_rows($sql4);
	if($rows==0){
		echo json_encode("NO"); 
	}else{	
	    while ($list3=mysqli_fetch_assoc($sql4)){	
             $FTB=str_split($list3['Ftb']);		
		    $atr = array('prg_no'=>$list3['F03'].'.'.$list3['F02'],				 
				 'newauth'=>$list3['F04'],
				 'editauth'=>$list3['F05'],
				 'delauth'=>$list3['F06'],
				 'pntauth'=>$list3['F07'],
				 'rmk1'=>$list3['F08'],
				 'rmk2'=>$list3['F09'],
				 'rmk3'=>$list3['F10'],
				 'rmk4'=>$list3['F11'],
				 'rmk5'=>$list3['F12'],
				 'attbcode1'=>$FTB[0],
				 'attbcode2'=>$FTB[1],
				 'attbcode3'=>$FTB[2],
				 'attbcode4'=>$FTB[3] 
				 );       
				
		    array_push($arr,$atr);
	    }
		$arr = array_values($arr);     
        $json_string1 = json_encode($arr); 
         echo $json_string1;	 
	}
	mysqli_close($link);
	    
         
       
		 
 		 
          
?>  

 