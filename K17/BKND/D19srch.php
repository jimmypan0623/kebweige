<?php
   header("Content-Type:text/html; charset=utf-8");   

 require_once("../../include/BKND/mysqli_server.php");                              //引用檔    
 require_once "../../include/BKND/fieldpreset.php";
    $str1=$_POST['filename'];
	$sql3="SELECT * FROM d19 WHERE d19.F02='".$str1."' ORDER BY d19.F05";			  
	$arr=array();	
	$wthary = fldwdthpre('K17', 'A', $link);
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){		  
	     //var array = ['料號','憑證單號','異動數量','單價', '幣別','匯率','小計'];
		/* $atr = array('料號_ISL_025'=>$list3['F05'],
		             '憑證單號_ISC_012'=>$list3['F02'] ,
		             '異動數量_ISR_012'=>$list3['F06'] ,
		             '單價_ISR_012'=>$list3['F07'],
		              '幣別_ISC_005'=>$list3['F13'], 
					  '匯率_ISR_012'=>$list3['F14'],		         
					  '小計_ISR_012'=>$list3['F06']*$list3['F07']*$list3['F14']);        
		array_push($arr,$atr); */
		$mapping = [
		            $list3['F05'],  //料號
		            $list3['F02'] ,  //憑證單號
		            $list3['F06'] , //異動數量
		            $list3['F07'],   //單價
		            $list3['F13'],   //幣別
					$list3['F14'],    //匯率
		            $list3['F06']*$list3['F07']*$list3['F14']   //小計
	    ];
		$atr = [];
		$i = 0;
		foreach ($mapping as  $db_col) { 
			$atr[$wthary[$i]] = $db_col ?? '';
			$i++;
		}
		$arr[] = $atr;	
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 

?>  

 