<?php
   header("Content-Type: application/json; charset=utf-8");
   include("../../include/BKND/mysqli_server.php");                     //引用檔   
    require_once "../../include/BKND/fieldpreset.php"; // 引入  
	
   $rows=0;
   //////////// //將進貨計畫先存入預期結餘計算		
	$sql7="(SELECT d04.F00,d04.F01,d04.F02,d04.F06,d04.F03-d04.F09-d04.F21 AS RST FROM d04 ";
	$sql7.=" LEFT JOIN d03 ON d03.F01=d04.F01 "; 
	$sql7.="WHERE d04.F03-d04.F09-d04.F21>0 AND d03.F04='Y' ";			 
	$sql7.=") UNION(SELECT c04.F00,c04.F01,c04.F02,c04.F06,(c04.F03-c04.F09-c04.F21)*(-1) AS RST FROM c04 LEFT JOIN c03 ON c03.F01=c04.F01 ";
	$sql7.=" WHERE c04.F03-c04.F09-c04.F21>0 AND c03.F04='Y' AND c04.F02 IN (SELECT c04.F02 FROM c04 ";
	$sql7.=" LEFT JOIN c03 ON c03.F01=c04.F01 "; 
	$sql7.=" WHERE c04.F03-c04.F09-c04.F21>0 AND c03.F04='Y' ";		
	$sql7.=" )) order by F02,F06,RST DESC";
   
    if (substr($_POST['filename'],0,3)=="PGE"){	  
	    $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 頁次 
        //$rows=(int)substr(strrchr($_POST['filename'],'|'),1);	
		 $rows=(int)getNeedBetween($_POST['filename'],'|','_') ;
	    //$pagerows=$_COOKIE['INT_RCD'] ;  //每頁筆數   
		$pagerows=(int)substr(strrchr($_POST['filename'],'_'),1);	
	    $total_pages=ceil($rows/$pagerows);   //如果非初始畫面則應有大於等於1的數字	   
	    if($total_pages<=1){
		    $sqlK="SELECT d04.F01 FROM d04 LEFT JOIN d03 ON d03.F01=d04.F01 WHERE d04.F03-d04.F09-d04.F21>0 AND d03.F04='Y' "; 
	        $sql2=mysqli_query($link,$sqlK);
   	        $rows=@mysqli_num_rows($sql2);	   	      //主要是在此先算有幾筆資料而不再join處算
	        $total_pages=ceil($rows/$pagerows);
        }    	 	   
	    $sql="SELECT `d04`.`F00`,`d04`.`F02`,`b01`.`F02` AS `F0B`,`d04`.`F01`,`d04`.`F06`,`d04`.`F03`-`d04`.`F09`-`d04`.`F21` AS NSH,`d04`.`F23`,`d03`.`F03`,`d01`.`F04` As F0D,`d04`.`F05`,`d03`.`F14`,`d03`.`F07`,`a01`.`F03` AS F0C,`d04`.`F12`,b11B.nTqty,DATEDIFF(CURDATE( ),`d04`.`F06`) AS diffdate FROM `d04`";
	    $sql.=" LEFT JOIN `b01` ON `b01`.`F01`=`d04`.`F02`"; 
	    $sql.=" LEFT JOIN `d03` ON `d03`.`F01`=`d04`.`F01`"; 
	    $sql.=" LEFT JOIN `d01` ON `d01`.`F01`=`d03`.`F03`"; 
	    $sql.=" LEFT JOIN `a01` ON `a01`.`F01`=`d03`.`F07`"; 
		$sql.=" LEFT JOIN (SELECT b11.F03,SUM(b11.F04) AS nTqty FROM b11 LEFT JOIN a14 ON a14.F01=b11.F01 WHERE (a14.F04='Y' AND a14.F12='Y') GROUP BY b11.F03 ) AS b11B ON b11B.F03=d04.F02 ";
	    $sql.=" WHERE `d04`.`F03`-`d04`.`F09`-`d04`.`F21` >0 AND `d03`.`F04`='Y' ORDER BY `d04`.`F02`,`d04`.`F06`";
	    $start_rowrecord=$pagerows*($pgeno-1);	
	    $sql3=$sql." LIMIT ".$start_rowrecord.",".$pagerows;  	        
    }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);	 	    
	    $sql="SELECT `d04`.`F00`,`d04`.`F02`,`b01`.`F02` AS F0B,`d04`.`F01`,`d04`.`F06`,`d04`.`F03`-`d04`.`F09`-`d04`.`F21` AS NSH,`d04`.`F23`,`d03`.`F03`,`d01`.`F04` As F0D,`d04`.`F05`,`d03`.`F14`,`d03`.`F07`,`a01`.`F03` AS F0C,`d04`.`F12`,b11B.nTqty,DATEDIFF(CURDATE( ),`d04`.`F06`) AS diffdate FROM `d04`";
	    $sql.=" LEFT JOIN `b01` ON `b01`.`F01`=`d04`.`F02`"; 
	    $sql.=" LEFT JOIN `d03` ON `d03`.`F01`=`d04`.`F01`"; 
	    $sql.=" LEFT JOIN `d01` ON `d01`.`F01`=`d03`.`F03`"; 
	    $sql.=" LEFT JOIN `a01` ON `a01`.`F01`=`d03`.`F07`"; 
		$sql.=" LEFT JOIN (SELECT b11.F03,SUM(b11.F04) AS nTqty FROM b11 LEFT JOIN a14 ON a14.F01=b11.F01 WHERE (a14.F04='Y' AND a14.F12='Y') GROUP BY b11.F03 ) AS b11B ON b11B.F03=d04.F02 ";
	    $sql3=$sql." WHERE ".$fieldNo." like '%".trim($filterKey)."%' AND `d04`.`F03`-`d04`.`F09`-`d04`.`F21` >0 AND `d03`.`F04`='Y' order by ".$fieldNo.",`d04`.`F06`" ; 
	}	  
	$sql8=@mysqli_query($link,$sql7); 
	$initleft=0;
	$initstockno='';
	$amr=array();
	while ($list8=mysqli_fetch_assoc($sql8)){
	   if($list8['F02']!=$initstockno){
		   $initleft=0;
	   }
	   $initleft=$initleft+$list8['RST'];
	   $amr[substr($list8['F01'],0,2).$list8['F00']]=$initleft;
	   $initstockno=$list8['F02'];
	}
    $wthary=fldwdthpre('D08','1',$link);
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		$atr = array('rc_no'.$wthary[0]=>$list3['F00'],  		            	             
		             'stock_no'.$wthary[1]=>$list3['F02'], 
					 'stock_name'.$wthary[2]=>$list3['F0B'], 
                     'order_no'.$wthary[3]=>$list3['F01'],                     				                     				                                       
					 'shipdate'.$wthary[4]=>$list3['F06'],
					 'order_qty'.$wthary[5]=>$list3['NSH'], 
					 'readyship_qty'.$wthary[6]=>$list3['F23'], 	
					 'avlqty'.$wthary[7]=>$amr[substr($list3['F01'],0,2).$list3['F00']]+$list3['nTqty'],
					 'invTotal'.$wthary[8]=>$list3['nTqty'], 
					 'customer_no'.$wthary[9]=>$list3['F03'], 	
					 'customer_name'.$wthary[10]=>$list3['F0D'], 
					 'customer_partno'.$wthary[11]=>$list3['F05'], 
					  'customer_po'.$wthary[12]=>$list3['F14'], 
					 'sales_no'.$wthary[13]=>$list3['F07'], 
					 'sales_name'.$wthary[14]=>$list3['F0C'], 		
					 'diffdate'.$wthary[15]=>$list3['diffdate'], 			
					 'lastupdate'.$wthary[16]=>$list3['F12']                      				 
					 );                      			

		array_push($arr,$atr);
	}
	mysqli_close($link);
	 //最後使用usort來做排序
        // usort(要排序的陣列,使用的函數) 
      //usort($arr, 'score_sort');  //料號再排序一次        
          $arr = array_values($arr);
       //  $json_string1 = json_encode($arr); 	
         echo json_encode(array ('recdrow'=>$arr,'pgttl'=>$rows));		 
         //echo "getProfile($json_string1,$total_pages)";  	   //
//接著建立一個排序的函數
     /*    function score_sort($a, $b){
                if($a['stockno'] == $b['stockno']) return 0;
                   return ($a['stockno'] > $b['stockno'])? 1 : -1;				 
        }        */
/* function getNeedBetween($kw1,$mark1,$mark2){  //抓取兩個字元間的字串函數
   $kw=$kw1; 
   $st =stripos($kw,$mark1);
   $ed =stripos($kw,$mark2);
   if(($st==false||$ed==false)||$st>=$ed)
      return 0;
   $kw=substr($kw,($st+1),($ed-$st-1));
return $kw;
} */
function getNeedBetween($kw1, $mark1, $mark2) {
    $st = stripos($kw1, $mark1);
    $ed = stripos($kw1, $mark2);
    // 使用強型別比較，避免索引為 0 時判定為 false
    if ($st === false || $ed === false || $st >= $ed) return "";
    return substr($kw1, ($st + 1), ($ed - $st - 1));
}
?>  

 