 <?php 
function fldwdthpre($prgNo,$pageNo,$link ){    //計算超過結帳日期的結帳月份
 
    $Fieldswdth1="SELECT F04,F05,F06,F07 FROM a04 WHERE F01 ='".$prgNo."' AND LEFT(F02,1)='".$pageNo."' AND F04<>'M' ORDER BY F02";  //各欄位欄寬與對齊方式	
	$Fieldswdth2=mysqli_query($link,$Fieldswdth1); 
	while($getwidthrlc=mysqli_fetch_row($Fieldswdth2)){
		$trnarray[]='_'. $getwidthrlc[0].$getwidthrlc[1].$getwidthrlc[2].'_'.str_pad(trim($getwidthrlc[3]),3,'0',STR_PAD_LEFT);	   
	} 	
	return $trnarray;
}	

 ?> 