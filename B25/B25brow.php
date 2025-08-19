<?php
   header("Content-Type:text/html; charset=utf-8");   
   include("../include/mysqli_server.php");                              //引用檔   
   $rnddgt=$_COOKIE["INT_069"];
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 月次 
	   $dptno=substr(strrchr($_POST['filename'],'|'),1); // 月次
      
		$sql3="SELECT * FROM b25 WHERE F90='".$pgeno."' AND F01='".$dptno."' ";
		$sql3.="AND !(F03=0 AND F04=0 AND F05=0 AND F06=0 AND F07=0 AND F08=0 AND F09=0 AND F10=0 AND F11=0 AND F13=0 AND F14=0 AND F15=0) ";
		$sql3.="ORDER BY F01,F02 ";	
		     
   }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=getNeedBetween($_POST['filename'],'|','_');  		
	    $pgeno=getNeedBetween($_POST['filename'],'_','~'); // 月次 
		$dptno=substr(strrchr($_POST['filename'],'~'),1);  //部門編號
        $sql3="SELECT * FROM b25		   		
		WHERE F90='".$pgeno."' AND F01='".$dptno."' ";
		$sql3.="AND !(F03=0 AND F04=0 AND F05=0 AND F06=0 AND F07=0 AND F08=0 AND F09=0 AND F10=0 AND F11=0 AND F13=0 AND F14=0 AND F15=0) ";
		$sql3.="AND ".$fieldNo." like '%".trim($filterKey)."%' order by ".$fieldNo;   
             
   }	   
    $sql0="select F07 from a23 where F01="."'".$pgeno."'"; 
     $sql1=@mysqli_query($link,$sql0);                           
     $list4=mysqli_fetch_array($sql1);  //紀錄當前月份是否已結轉月庫存報表   
   
   
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		
					 
		$atr = array('rc_no'=>$list3['F00'],  
                     'stock_no'=>$list3['F02'], 	
					 'mth_init'=>$list3['F03'], 	
					 'shipIn'=>$list3['F04'],
					 'inReject'=>$list3['F05'],  
					 'shipOut'=>$list3['F06'],	
					 'outReject'=>$list3['F07'],	
					 'turnIn'=>$list3['F08'],
		             'turnOut'=>$list3['F09'], 					 
                     'product'=>$list3['F10'],	 
                     'consume'=>$list3['F11'],	 					 
                     'lose'=>$list3['F14'],
					 'wend'=>$list3['F13'],  						
                     'mth_end'=>$list3['F15'],									  
					 'lastupdate'=>$list3['F16']                      				 
					 );                     			 
		array_push($arr,$atr);
		
	}
	mysqli_close($link);
	 //最後使用usort來做排序
        // usort(要排序的陣列,使用的函數) 
      //usort($arr, 'score_sort');  //料號再排序一次        
          $arr = array_values($arr);
       //  $json_string1 = json_encode($arr); 	
         echo json_encode(array ('recdrow'=>$arr,'transcode'=>$list4['F07']));		 
         //echo "getProfile($json_string1,$total_pages)";  	   //
//接著建立一個排序的函數
     /*    function score_sort($a, $b){
                if($a['stockno'] == $b['stockno']) return 0;
                   return ($a['stockno'] > $b['stockno'])? 1 : -1;				 
        }        */
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

 