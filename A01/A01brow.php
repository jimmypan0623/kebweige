<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../include/mysqli_server.php");                                 //引用檔
  $rows=0;
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 頁次 
       $rows=(int)substr(strrchr($_POST['filename'],'|'),1);	
	   $pagerows=$_COOKIE['INT_RCD'] ;  //每頁筆數         
	   $total_pages=ceil($rows/$pagerows);   //如果非初始畫面則應有大於等於1的數字	   
	  if($total_pages<=1){
		  $sqlK="SELECT F01 FROM `a03` WHERE 1 "; 
	      $sql2=mysqli_query($link,$sqlK);
   	      $rows=@mysqli_num_rows($sql2);	   	      //主要是在此先算有幾筆資料而不再join處算
	      $total_pages=ceil($rows/$pagerows);
       }    
	   $sql="SELECT * FROM a03 ORDER by F01 "; 	   
	  
	   $start_rowrecord=$pagerows*($pgeno-1);	
	   $sql3=$sql." LIMIT ".$start_rowrecord.",".$pagerows;  
	    
   }else{
	    $fieldNo=substr($_POST['filename'],0,7);
		$filterKey=substr(strrchr($_POST['filename'],'|'),1);
	    //$searchRecord =$_POST['filename'];
		$sql="SELECT * FROM a03 "; 	   		 
		$sql3=$sql." WHERE ".$fieldNo." like '%".trim($filterKey)."%' order by ".$fieldNo ; 
   }	   
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_array($sql4)){
		 
		$atr = array('rc_no'=>$list3['F00'],
		             'prg_no'=>$list3['F01'], 
					 'prg_name'=>$list3['F02'],	        					
                     'new_auth'=>$list3['F04'],
                     'edit_auth'=>$list3['F05'],
					 'del_auth'=>$list3['F06'],
					 'prnt_auth'=>$list3['F07'],
					 'auth1_attch'=>$list3['F08'],
					 'auth2_attch'=>$list3['F09'],
					 'auth3_attch'=>$list3['F10'],
					 'auth4_attch'=>$list3['F11'],
                     'attch5_attch'=>$list3['F12'],
					  'attr_auth'=>$list3['F03'],
					 'lastupdate'=>$list3['F15'] 
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

 