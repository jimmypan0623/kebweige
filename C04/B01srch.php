<?php
 header("Content-Type:text/html; charset=utf-8");   
 include("../include/mysqli_server.php");          //引用檔   
        $str=explode(',',$_POST['filename']);  //將上面字串以逗號分割成陣列		 
		 $customno=trim($str[2]);
	  $searchRecord =trim($str[1]);		
	  $sql0="select F44 from c01 where F01='".$customno."'"; 
     $sql1=@mysqli_query($link,$sql0);                      
     $list4=mysqli_fetch_array($sql1);  //紀錄當前客戶之群組編號
	 $sql3="SELECT b01.F01,b01.F02,b01.F04,b01.F28,b01.F31,b01.F38,c02A.F13,c02A.F08,c02A.F04 as F0D,c02A.F07,c02A.F15 FROM b01 ";	 	
	 //$sql3.="left outer join (select F01,F02,F03,F04,F06,F07,F08,F13,F15 from c02 where F06='".$str[3]."' AND F01='". ."'AND (CURDATE() BETWEEN F02 AND F15) order by F15 ) as c02A on c02A.F03=b01.F01 AND c02A.F01='".$list4['F44']."' ";	
	 $sql3.="left outer join (select F01,F02,F03,F04,F06,F07,F08,F13,F15 from c02 where F06='".$str[3]."' AND F01='".$list4['F44']."' AND (CURDATE() BETWEEN F02 AND F15) order by F15 ) as c02A on c02A.F03=b01.F01  ";	
	 if(strlen($searchRecord)==0) {	  
         $sql3=$sql3."WHERE RIGHT(F98,1)='Y' OR F98='NNN' ";		
	 }else{

		$sql3=$sql3."WHERE ".$str[0]." like '%".$searchRecord."%' AND (RIGHT(F98,1)='Y' OR F98='NNN') "   ; 
	 }
	 $sql3=$sql3."order by ".$str[0];
    $arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	$itemno=0;
	while ($list3=mysqli_fetch_array($sql4)){
		$itemno++; 
		$atr = array('item_no'=>$itemno,
		             'stock_no'=>$list3['F01'],  		            	             
		             'stock_name'=>$list3['F02'],
					 'unit_name'=>$list3['F04'],
					 'basic_qty'=>$list3['F13'],
					 'minum_qty'=>$list3['F08'],
					 'custom_part'=>$list3['F0D'],	
					 'invalid_date'=>$list3['F15'],
					 'order_price'=>($list3['F07']>0?$list3['F07']:$list3['F38']),
					 'leadtime'=>($list3['F28']+$list3['F31'])
					 );    
					                          
		array_push($arr,$atr);
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
  
?>  

 