<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);
$lastdate=date('Y'.'-'.'m'.'-'.'d');

include("../include/mysqli_server.php");        //引用檔 
 $sql0="select * from a01 where F01="."'".$_COOKIE['useraccount']."'"; 
    $sql1=@mysqli_query($link,$sql0);
    $rows1=@mysqli_num_rows($sql1);                       
    $list4=mysqli_fetch_array($sql1);  //紀錄當前操作者姓名   
   $brr=array();
   $valueStr = '';
    foreach($cart as $key=>$val){	    
	    if (!is_array($val)){	 
             $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂  				   
	    }else{		   
		   $lngth=count($cart->queryorder);
		   for($i=0;$i<$lngth;$i++){
			   
			  $valueStr .= "('".$brr[0]."','".$brr[1]."','".$brr[3]."','".$brr[5]."',";	 
		      $s=0;
			  foreach($cart->queryorder[$i] as $content=>$dept){
				  if($s==0 || $s==5 || $s==6 || $s==9){   //只管四個欄位管
					 $valueStr.="'".addslashes($dept)."',";
				  }
				  $s++;
              }			
			  $valueStr.="'".$lastdate.$list4['F03']."'),";
		   }		  
        }
		
   }

$sql7="select F04 from c03 where F01='".trim($brr[0])."'"; 
 $sql8=mysqli_query($link,$sql7);                      
 
 $list2=mysqli_fetch_array($sql8);  //檢查是否已確認過
 
  
 if($list2['F04']!='Y'){

     $sql0="select * from a01 where F01="."'".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
     $rows1=@mysqli_num_rows($sql1);                       
     $list4=mysqli_fetch_array($sql1);  //紀錄當前操作者姓名   
    
    

	 $valueStr = substr($valueStr,0,strlen($valueStr)-1);   //去掉最右邊的逗號 
     $insertSql = "insert into c05 (F01,F06,F08,F09,F02,F10,F03,F04,F07) values".$valueStr; 
     @mysqli_query($link,$insertSql)  or die(mysqli_error($link));   

	   $mscnt="UPDATE c03 SET F04='".$brr[8]."',";	    	  
	   $mscnt.=" F10='".$lastdate.$list4['F03']."'";
	   $mscnt.=" WHERE F01="."'".$brr[0]."' ";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
       $arr = array ('order_no'=>$brr[0],'lastupdate'=>$lastdate.$list4['F03']);
	    echo json_encode($arr);

}
mysqli_close($link);	
 	
?>
 