<?php
   header("Content-Type:text/html; charset=utf-8");   

    include("../../include/BKND/mysqli_server.php");         //引用檔   
	    $searchRecord =$_POST['filename'];
	   
		  $sql3="SELECT `F01`,`F02`,`F04`,`F05`,`F06`,`F07`,`F08`,`F09`,`F10`,`F11`,`F12`,`F15` FROM `a03` WHERE `F01` NOT IN (SELECT `F03` FROM a02 WHERE `F01`=".$searchRecord." ORDER BY F01";
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('prg_no'=>$list3['F01'],  		            	             
		             'prg_name'=>$list3['F02'],					               
                     'new_auth'=>$list3['F04'],
                     'edit_auth'=>$list3['F05'],
					 'del_auth'=>$list3['F06'],
					 'prnt_auth'=>$list3['F07'],
					 'auth1_attch'=>$list3['F08'],
					 'auth2_attch'=>$list3['F09'],
					 'auth3_attch'=>$list3['F10'],
					 'auth4_attch'=>$list3['F11'],
                     'attch5_attch'=>$list3['F12']);          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
       
		 
 		 
          
?>  

 