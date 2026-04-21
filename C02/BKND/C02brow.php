<?php
   header("Content-Type:text/html; charset=utf-8");   
   require_once("../../include/BKND/mysqli_server.php");                          //引用檔  
   require_once "../../include/BKND/fieldpreset.php"; // 引入      
   $rows=0;
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 頁次 
       
	    $rows=(int)getNeedBetween($_POST['filename'],'|','_') ;		
	 
	   $pagerows=(int)substr(strrchr($_POST['filename'],'_'),1);	
	   $total_pages=ceil($rows/$pagerows);   //如果非初始畫面則應有大於等於1的數字	   
	  if($total_pages<=1){
		  $sqlK="SELECT F01 FROM `c02` WHERE 1 "; 
	      $sql2=mysqli_query($link,$sqlK);
   	      $rows=@mysqli_num_rows($sql2);	   	      //主要是在此先算有幾筆資料而不再join處算
	      $total_pages=ceil($rows/$pagerows);
       }    
	   $sql="SELECT c02.F00,c02.F01,c02.F02,c02.F03,c02.F04,c02.F06,c02.F07,c02.F08,c02.F10,c02.F11,c02.F13,c02.F15,c02.F16,c02.F99,c01.F05 as F0E FROM c02"; 	   
	   $sql.=" left outer join c01 on c01.F01=c02.F01"; 	
	   $sql.=" ORDER BY c02.F03,c02.F01,c02.F02 desc";	   
	   $start_rowrecord=$pagerows*($pgeno-1);	
	   $sql3=$sql." LIMIT ".$start_rowrecord.",".$pagerows;  
	    
   }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);
	     
		$sql="SELECT c02.F00,c02.F01,c02.F02,c02.F03,c02.F04,c02.F06,c02.F07,c02.F08,c02.F10,c02.F11,c02.F13,c02.F15,c02.F16,c02.F99,c01.F05 as F0E FROM c02"; 	   
	    $sql.=" left outer join c01 on c01.F01=c02.F01"; 	  
		$sql3=$sql." WHERE ".$fieldNo." like '%".trim($filterKey)."%' order by ".$fieldNo ; 
   }	   
  
	$wthary=fldwdthpre('C02','1',$link);  
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	
	while ($list3=mysqli_fetch_assoc($sql4)){		 
		$atr = array('rc_no'.$wthary[0]=>$list3['F00'],  		        //_DHL_000       	             
		             'stock_no'.$wthary[1]=>$list3['F03'],                         //_DSL_015            				                     				                                       
					 'custom_no'.$wthary[2]=>$list3['F01'],             //_DSL_007
					 'custom_name'.$wthary[3]=>$list3['F0E'],               //_ISL_007
					 'custom_partno'.$wthary[4]=>$list3['F04'],             //_DSL_012
					 'current'.$wthary[5]=>$list3['F06'],             //_DSC_004
					 'price'.$wthary[6]=>$list3['F07'],                           //_DSR_007
					 'minorder'.$wthary[7]=>$list3['F08'],              //_DSR_007
					 'basicpack'.$wthary[8]=>$list3['F13'],                  //_DSR_007
					 'payment'.$wthary[9]=>$list3['F10'],            //_DSL_009
					  'quotation'.$wthary[10]=>$list3['F11'],              //_DSL_009
					 'origin_date'.$wthary[11]=>$list3['F02'],                //_DSL_008
                     'invalid_date'.$wthary[12]=>$list3['F15'],		                   //_DSL_008
					  'remark'.$wthary[13]=>$list3['F16'],              //_DSL_015
					 'lastupdate'.$wthary[14]=>$list3['F99']                      			 //_DHL_000	 
					 );                      			
		array_push($arr,$atr);
	}
	mysqli_close($link);
	  
          $arr = array_values($arr);
     
         echo json_encode(array ('recdrow'=>$arr,'pgttl'=>$rows));		 
          
 
function getNeedBetween($kw1,$mark1,$mark2){  //抓取兩個字元間的字串函數
   $kw=$kw1; 
   $st =stripos($kw,$mark1);
   $ed =stripos($kw,$mark2);
   if(($st==false||$ed==false)||$st>=$ed)
      return 0;
   $kw=substr($kw,($st+1),($ed-$st-1));
return $kw;
}
?>  

 