 <?php 
function fldafterwrite($prgNo,$pageNo,$link,$Pop ){    //計算超過結帳日期的結帳月份
 
    $Fieldswdth1="SELECT F04,F05,F06,F07 FROM a04 WHERE F01 ='".$prgNo."' AND LEFT(F02,1)='".$pageNo."' AND F02<>'".$pageNo."00"."' ORDER BY F02";  //各欄位欄寬與對齊方式	
	$Fieldswdth2=mysqli_query($link,$Fieldswdth1); 
	$k=0;
	   while($getwidthrlc=mysqli_fetch_row($Fieldswdth2)){

		  $trnarray[$k][0]=($getwidthrlc[0]=='D'?'directdata':'indirectdata');
		  $trnarray[$k][1]=($getwidthrlc[1]=='S'?'block':'none') ;   
		  $trnarray[$k][2]=($getwidthrlc[2]=='L'?'left':($getwidthrlc[2]=='C'?'center':'right'));
		  $trnarray[$k][3]=$getwidthrlc[3];
		  $k=$k+1;
	   } 	
	   if($Pop){
	     array_pop($trnarray);
	   }
	return $trnarray;
}	

 ?> 