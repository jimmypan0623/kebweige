 <?php 
function fldwdthpre($prgNo,$pageNo,$link ){    
    $trnarray = array(); // 初始化
    $Fieldswdth1="SELECT F03,F04,F05,F06,F07 FROM a04 WHERE F01 ='".$prgNo."' AND LEFT(F02,1)='".$pageNo."' AND F04<>'M' ORDER BY F02";  //各欄位欄寬與對齊方式	
	$Fieldswdth2=mysqli_query($link,$Fieldswdth1); 
	while($getwidthrlc=mysqli_fetch_row($Fieldswdth2)){
		$trnarray[]=trim($getwidthrlc[0]).'_'. $getwidthrlc[1].$getwidthrlc[2].$getwidthrlc[3].'_'.str_pad(trim($getwidthrlc[4]),3,'0',STR_PAD_LEFT);	   
	} 	
	return $trnarray;
}	
function afldcont($result,$afld,$wthary){
	$ast=[]; 
	while ($list3 = mysqli_fetch_assoc($result)) {
		$atr = [];
		$i = 0;
		foreach ($afld as  $db_col) {  		
			$atr[$wthary[$i]] = $list3[$db_col] ?? '';
			$i++;
		}
		$ast[] = $atr;
    }
    return $ast;
}

?> 