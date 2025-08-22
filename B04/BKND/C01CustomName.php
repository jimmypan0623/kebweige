<?php
   header("Content-Type:text/html; charset=utf-8");   

  include("../../include/BKND/mysqli_server.php");                              //引用檔    
	 
	 $sql3="SELECT `c01`.`F04`,`c01`.`F05`,`c01`.`F10`,`c01`.`F12`,`c01`.`F13`,`c01`.`F33`,`a01`.`F03`,";
	 $sql3.="`c01`.`F39`,`c00`.`F02`,`c01`.`F29`,`c01`.`F30`,`c01`.`F15`,`c01`.`F36`,`c01`.`F07`,`c01`.`F32` ";
	 $sql3.="FROM `c01` ";
	 $sql3.="LEFT OUTER JOIN `c00` ON `c00`.`F01`=`c01`.`F39` ";
     $sql3.="LEFT OUTER JOIN `a01` ON `a01`.`F01`=`c01`.`F33` ";	
	 $sql3.="WHERE binary `c01`.`F01` ='".$_POST['filename']."' AND `c01`.`F03`!='X' ";	 	 

    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	$rows=@mysqli_num_rows($sql4);
	if($rows>0){
	    while ($list3=mysqli_fetch_array($sql4)){
		 
		    $atr = array('customname'=>$list3['F05'],
		  	             'customfullname'=>$list3['F04'],
						 'unitno'=>$list3['F10'],
						 'winname'=>$list3['F12'],
						 'telNo'=>$list3['F13'],
						 'whono'=>$list3['F33'],
						 'whonameEx'=>$list3['F03'],
						 'crntopt'=>$list3['F39'],
						 'curncy'=>$list3['F02'],
						 'invtype'=>$list3['F29'],
						 'taxtype'=>$list3['F30'],
						 'howpay'=>howpay($list3['F15']).($list3['F36']>0?$list3['F36']."天":""),						
						 'dlvrplace'=>$list3['F07'],
						 'shipdirect'=>$list3['F32']
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
					 'invtype'=>"31",
					 'taxtype'=>"1",
					 'howpay'=>"現結",					 
					 'dlvrplace'=>"",
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

 