<?php
   header("Content-Type:text/html; charset=utf-8");   

  require_once("../../include/BKND/mysqli_server.php");                              //引用檔    
	 
	 $sql3="SELECT `d01`.`F03`,`d01`.`F04`,`d01`.`F06`,`d01`.`F08`,`d01`.`F09`,`d01`.`F39`,`a01`.`F03` AS F0C,";
	 $sql3.="`d01`.`F25`,`d00`.`F02`,`d01`.`F13`,`d01`.`F36`,`d01`.`F19` ";
	 $sql3.="FROM `d01` ";
	 $sql3.="LEFT OUTER JOIN `d00` ON `d00`.`F01`=`d01`.`F25` ";
     $sql3.="LEFT OUTER JOIN `a01` ON `a01`.`F01`=`d01`.`F39` ";	
	 $sql3.="WHERE binary `d01`.`F01` ='".$_POST['filename']."' AND `d01`.`F12`!='X' ";	 	 

    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	$rows=@mysqli_num_rows($sql4);
	if($rows>0){
	    while ($list3=mysqli_fetch_assoc($sql4)){
		 
		    $atr = array('vendorname'=>$list3['F04'],
		  	             'vendorfullname'=>$list3['F03'],
						 'unitno'=>$list3['F06'],
						 'winname'=>$list3['F08'],
						 'whono'=>$list3['F39'],
						 'whonameEx'=>$list3['F0C'],
						 'crntopt'=>$list3['F25'],
						 'curncy'=>$list3['F02'],
						
						 'howpay'=>howpay($list3['F13']).($list3['F36']>0?$list3['F36']."天":""),						
						
						 'shipdirect'=>$list3['F19']
						 );                              
		    array_push($arr,$atr);
	    }
	}else{
	    $atr = array('customname'=>"",
		             'customfullname'=>"",
					 'unitno'=>"",
					 'winname'=>"",
					 'telNo'=>"",
					 'whono'=>"",
					 'whonameEx'=>"",
					 'crntopt'=>"NTD",
					 'curncy'=>1,
					
					 'taxtype'=>"1",
					 'howpay'=>"現結",					 
					 
					 'shipdirect'=>""
					 );                              
		    array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
       
		 
function howpay($flg){
	 
	switch ($flg) {
        case '0':
            $payment='現結';
            break;
        case '1':
             $payment='月結';
            break;
        case '2':
	       $payment='次月結';
	       break;
	    case  '3':
	        $payment='T/T';
		    break;
        default:
	       $payment='現結';
	}
	return $payment;
} 	 		 
          
?>  

 