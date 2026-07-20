<?php
require_once("../../include/BKND/auth_check.php"); //驗證
   header("Content-Type:text/html; charset=utf-8");   

 require_once("../../include/BKND/mysqli_server.php");                              //引用檔
 require_once "../../include/BKND/fieldpreset.php";
        $str=explode('|',$_POST['filename']);  //將上面字串以逗號分割成陣列
 
		$sql3="SELECT b0d.F01,b04.F90,b04.F02,B0d.F05,a14.F02 AS F0B,b0d.F04 FROM b0d,b04,a14 ";			  

	   	$sql3.=" WHERE b0d.F07='".$str[1]."' AND b0d.F03='".$str[0]."' AND b04.F01= b0d.F01 AND b04.F10!='Y' AND a14.F01=b0d.F05 order by b04.F90,b04.F02 DESC"; 
    $wthary = fldwdthpre('C05', 'A', $link);
	$arr=array();	
    $sql4=@mysqli_query($link,$sql3); 
	while ($list3=mysqli_fetch_assoc($sql4)){		 
		
			$mapping = [               
				$list3['F01'],        //出貨單號
				$list3['F90'].'-'.$list3['F02'],     //預出貨日
				$list3['F05'],        //部門編號
				$list3['F0B'],        //部門名稱
				$list3['F04']         //預出貨量
				
		    ];
		$atr = [];
		$i = 0;
		foreach ($mapping as  $db_col) { 
			$atr[$wthary[$i]] = $db_col ?? '';
			$i++;
		}
		$arr[] = $atr;		
	}
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
	 
        // echo "srchStockNo($json_string1)";    
       
		 

?>  

 