<?php
require_once("../../include/BKND/auth_check.php"); //驗證
   // 1. 設定回傳格式為 JSON 且避免亂碼
header("Content-Type: application/json; charset=utf-8");

// 2. 現代瀏覽器的防快取設定
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");

// 3. 舊版 HTTP/1.0 瀏覽器與某些 Proxy 的防快取設定
header("Pragma: no-cache"); 
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); // 讓過期時間設定在過去

 require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
 require_once "../../include/BKND/fieldpreset.php";	 
 // 1. 取得並過濾基本參數
	$sq20="select * from a26 where F01='INT_086' "; 
	$sql7=@mysqli_query($link,$sq20);                           
	$list8=mysqli_fetch_assoc($sql7);  //紀錄參數(借出入倉) 	    
	$brwdpt = isset($list8['F06']) ? $list8['F06'] : "XXXXXX";
 
 
     $str = explode('|', $_POST['filename']);
	 
    $searchRecord=trim($str[0]);
	 $sql3="SELECT `F01`,`F02` FROM `a14` ";
	 
	 if(strlen(trim($str[0]))==0){ 	      
        $sql3=$sql3."WHERE F04='Y' ";			  		
	 }else{       
		 $sql3=$sql3."WHERE `F01` like '%".$searchRecord."%' AND F04='Y' ";		     
	 }
	 if($str[1]=="Y"){
		 $sql3=$sql3."AND `F13`='Y' ";   //列入成本的倉別
	 }
	 if($str[2]=="Y"){
		 $sql3=$sql3."AND `F12`='Y' ";   //擺放良品的倉
	 }
	 if($str[3]=="Y"){
		 $sql3=$sql3."AND `F05`='Y' ";   //生產部門
	 }
	 $sql3=$sql3." AND F01 <>'".trim($brwdpt)."' ORDER BY `F01`";
    $arr=array();	
    $result=@mysqli_query($link,$sql3); 
	
	$wthary = fldwdthpre('B02', 'D', $link);
$afld=['F01','F02'];
$arr=afldcont($result,$afld,$wthary);
	mysqli_close($link);
	     $arr = array_values($arr);
         $json_string1 = json_encode($arr); 
         echo $json_string1;	 
        // echo "srchStockNo($json_string1)";    
       
		 
 		 
          
?>  

 