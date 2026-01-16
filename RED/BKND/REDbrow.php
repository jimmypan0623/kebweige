<?php
header("Content-Type:text/html; charset=utf-8");   
include("../../include/BKND/mysqli_server.php");                               //引用檔

$str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
$searchRecord = $str[0];
$arg=array();	
if((int)$str[1]==0){   //剛開始登入必須要抓取參數一次，此後就不需要．
	$sql0="SELECT F01,F06,F04 FROM a26 ORDER BY F01" ; 		
	$sql1=@mysqli_query($link,$sql0);		
	while ($list4=@mysqli_fetch_assoc($sql1)){
	   $para=array('paraNo'=>$list4['F01'],'cngpra'=>$list4['F06'],'gTYPE'=>$list4['F04']);    //紀錄中文字元的參數  
	   array_push($arg,$para);
	}				
}	
	$sql3="select a02.F03,a03.F02,a02.F04,a02.F05,a02.F06,a02.F07,a02.F08,a02.F09,a02.F10,a02.F11,a02.F12,a03.F03 AS Ftb,a03.F16,a03.F17,a03.F18 from a02,a03 where a03.F01=a02.F03 and a02.F01='".$searchRecord."' order by a02.F03"; 	   
	$arr=array();	
	$sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){	
	    $FTB=str_split($list3['Ftb']);	
		$atr = array('prg_no'=>$list3['F03'],
				 'dscrpt'=>$list3['F02'],
				 'newauth'=>$list3['F04'],
				 'editauth'=>$list3['F05'],
				 'delauth'=>$list3['F06'],
				 'pntauth'=>$list3['F07'],
				 'rmk1'=>$list3['F08'],
				 'rmk2'=>$list3['F09'],
				 'rmk3'=>$list3['F10'],
				 'rmk4'=>$list3['F11'],
				 'rmk5'=>$list3['F12'],
				 'attbcode1'=>$FTB[0],
				 'attbcode2'=>$FTB[1],
				 'attbcode3'=>$FTB[2],
				 'attbcode4'=>$FTB[3],
				 'page_name1'=>$list3['F16'],
				 'page_name2'=>$list3['F17'],
				 'page_name3'=>$list3['F18']

				 );       				
		array_push($arr,$atr);
	}

mysqli_close($link);	   
$arr = array_values($arr);     
echo json_encode(array ('recdrow'=>$arr,'pgttl'=>$arg));
     
?>  

 