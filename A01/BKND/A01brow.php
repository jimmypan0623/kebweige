<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                                  //引用檔
 require_once "../../include/BKND/fieldpreset.php"; // 引入
  $rows=0;
   if (substr($_POST['filename'],0,3)=="PGE"){	  
	   $pgeno=getNeedBetween($_POST['filename'],'E','|'); // 頁次 
       //$rows=(int)substr(strrchr($_POST['filename'],'|'),1);	
	   $rows=(int)getNeedBetween($_POST['filename'],'|','_') ;	
	  // $pagerows=$_COOKIE['INT_RCD'] ;  //每頁筆數      
	   $pagerows=(int)substr(strrchr($_POST['filename'],'_'),1);	
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
    $wthary=fldwdthpre('A01','1',$link);
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){
		$atr = array('rc_no'.$wthary[0]=>$list3['F00'],      //_DHL_000
		             'prg_no'.$wthary[1]=>$list3['F01'],      //_DSC_007
					 'prg_name'.$wthary[2]=>$list3['F02'],	        		//_DSL_017			
                     'new_auth'.$wthary[3]=>$list3['F04'],      //_DSC_005
                     'edit_auth'.$wthary[4]=>$list3['F05'],       //_DSC_005
					 'del_auth'.$wthary[5]=>$list3['F06'],        //_DSC_005
					 'prnt_auth'.$wthary[6]=>$list3['F07'],            //_DSC_005
					 'auth1_attch'.$wthary[7]=>$list3['F08'],          //_DSL_010
					 'auth2_attch'.$wthary[8]=>$list3['F09'],            //_DSL_010
					 'auth3_attch'.$wthary[9]=>$list3['F10'],          //_DSL_010
					 'auth4_attch'.$wthary[10]=>$list3['F11'],                 //_DSL_010
                     'attch5_attch'.$wthary[11]=>$list3['F12'],          //_DSL_010
					 'attr_auth'.$wthary[12]=>$list3['F03'],          //_DSL_005
					  'page_nme1'.$wthary[13]=>$list3['F16'],             //_DSL_010
					  'page_nme2'.$wthary[14]=>$list3['F17'],          //_DSL_010
					 'page_nme3'.$wthary[15]=>$list3['F18'],            //_DSL_010
					 'lastupdate'.$wthary[16]=>$list3['F15']          //_DHC_000
					 );                      						 
		array_push($arr,$atr);
	}
	mysqli_close($link);	  
    $arr = array_values($arr);                   		  
    echo json_encode(array ('recdrow'=>$arr,'pgttl'=>$rows));		
	///////////
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

 