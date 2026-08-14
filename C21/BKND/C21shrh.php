<?php
require_once("../../include/BKND/auth_check.php"); //驗證
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$cart=json_decode($str_json);     // 單次解碼，與前端單次 stringify 對應
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
require_once("../../include/BKND/mysqli_server.php");           //引用檔   
 $sql7="select `F04` from `c26` where `F01`='".$brr[0]."'"; 
 $sql8=@mysqli_query($link,$sql7);                       
  $list2=mysqli_fetch_assoc($sql8);  //檢查是否已確認過
if($list2['F04']!='Y'){

     $lastdate=date('Y'.'-'.'m'.'-'.'d');
     $mArlth=count($brr);  

	  $sql3="select c27.* from c27 where c27.F01='".$brr[0]."' order by c27.F02"; 
      $sql4=@mysqli_query($link,$sql3); 
   $arr=array(); //brr[2]
	 while ($list3=mysqli_fetch_assoc($sql4)){
		 $my_array  = array('custom_no'=>$brr[1], 
		              'datestart'=>$list3['F15'], 
					  'stockno'=>$list3['F02'], 	
					  'custom_partno'=>$list3['F05'],
					  'crncy_type'=>$brr[4],
					  'query_price'=>$list3['F04'],     
					  'min_order'=>$list3['F07'],  	
					  'payment'=>$brr[7],
		              'query_no'=>$list3['F01'],		           
					  'basic_pack'=>$list3['F06'], 
					  'dateline'=>$list3['F17'],  
					  'remark'=>$brr[8],					 				
                      'lastupdate'=>$lastdate.$_SESSION['user_name']);   
			array_push($arr,$my_array);		  
	 }
	 $valueStr = '';
      foreach($arr as $v){
         $valueStr .= "('".$v['custom_no']."','".$v['datestart']."','".$v['stockno']."',
		 '".$v['custom_partno']."','".$v['crncy_type']."',".$v['query_price'].",".$v['min_order'].",
		 '".$v['payment']."','".$v['query_no']."',".$v['basic_pack'].",'".$v['dateline']."',
		 '".$v['remark']."','".$v['lastupdate']."'),";
     }  
	 
     $valueStr = substr($valueStr,0,strlen($valueStr)-1);   //去掉最右邊的逗號
 
     $insertSql = "insert into c02 (F01,F02,F03,F04,F06,F07,F08,F10,F11,F13,F15,F16,F99) values".$valueStr; 
 
      @mysqli_query($link,$insertSql) ;  
	  
       $c01update="UPDATE `c01` SET `F19`='".$brr[2]."' where F01='".$brr[1]."'";	
	   mysqli_query($link,$c01update) or die(mysqli_error($link));  	 
	   
	   $mscnt="UPDATE c26 SET F04='".$brr[9]."',";	    	  
	   $mscnt.=" F05='".$lastdate.$_SESSION['user_name']."'";
	   $mscnt.=" WHERE F01="."'".$brr[0]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  	 
	   
       $arr = array ('order_no'=>$brr[0],'lastupdate'=>$lastdate.$_SESSION['user_name']);
	    echo json_encode($arr);
}else{
	echo json_encode("此報價單已被確認過(.|.)"); 
}
mysqli_close($link);	
 	
?>
 