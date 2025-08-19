<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);
$brr=array();

include("../include/mysqli_server.php");        //引用檔 
     $sql0="select * from a01 where F01="."'".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
     $rows1=@mysqli_num_rows($sql1);                       
     $list4=mysqli_fetch_array($sql1);  //紀錄當前操作者姓名   
     
	 $lastdate=date('Y'.'-'.'m'.'-'.'d');
   $brr=array();
   $valueStr = '';
    foreach($cart as $key=>$val){	    
	    if (!is_array($val)){	 
             $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂  				   
	    }else{		   
		   $lngth=count($cart->queryorder);
		   for($i=0;$i<$lngth;$i++){
			  $valueStr .= "('".$brr[9]."','".$brr[0]."','".$brr[5]."',";	//單號,品號,PO 
		      $s=0;
			  foreach($cart->queryorder[$i] as $content=>$dept){
				  if($s==0 || $s==2 || $s==3 || $s==5 ){  //料號,數量,單價,客戶品號
					 $valueStr.="'".addslashes($dept)."',";
				  }
				  $s++;
              }			
			
			  $valueStr.="'".$lastdate.$list4['F03']."'),";
		   }		  
        }	 
   }


$sql7="select `F08` from `c03` where `F01`='".trim($brr[0])."'"; 
 $sql8=mysqli_query($link,$sql7);                      
 
 $list2=mysqli_fetch_array($sql8);  //檢查是否已確認過
 
  
if($list2['F08']!='Y'){
     ////先轉表頭b04
      $sql5="select F29,F30 from `c01` where `F01`='".trim($brr[1])."'"; 
      $sql6=@mysqli_query($link,$sql5);                       
      $list1=mysqli_fetch_array($sql6);  //先抓c01客戶主檔需用的欄位
	   $sql17="select F02 from `c00` where `F01`='".trim($brr[4])."'"; 
      $sql18=@mysqli_query($link,$sql17);                       
      $list2=mysqli_fetch_array($sql18);  //先抓c00匯率
	  
      $sql2="insert into b04 (F01,F02,F06,F09,F11,F14,F16,F22,F23,F12,F24,F90) values ('".$brr[9]."','".date('d')."', 
	   '".$brr[1]."','".$brr[3]."','".$lastdate.$list4['F03']."','".$brr[4]."','".$list2['F02']."','".$list1['F29']."', 
	   '".$list1['F30']."','".$brr[6]."','".$brr[7]."','".date('Y')."-".date('m')."')";         
	 
	 @mysqli_query($link,$sql2) ;  
    
     ////再轉表身b0d 
	 //

	 $valueStr = substr($valueStr,0,strlen($valueStr)-1);   //去掉最右邊的逗號 
     $insertSql = "insert into b0d (F01,F07,F09,F03,F04,F15,F08,F11) values".$valueStr; 
     @mysqli_query($link,$insertSql)  or die(mysqli_error($link));   
     $deptupdate="UPDATE `b0d` SET b0d.F05=(select b01.F07 FROM b01 where b01.F01=b0d.F03)  where b0d.F01='".$brr[9]."' "; //後補出貨部門資料
		 mysqli_query($link , $deptupdate) or die(mysqli_error($link));
       $c05update="UPDATE c05 SET F05=F04 WHERE F01='".$brr[0]."'";	  //開單未出
        mysqli_query($link , $c05update) or die(mysqli_error($link));
	   $c04update="UPDATE c04 SET F23=F03 WHERE F01='".$brr[0]."'";	  //開單未出
        mysqli_query($link , $c04update) or die(mysqli_error($link));			
	   $mscnt="UPDATE c03 SET F08='".$brr[8]."',";	    	  
	   $mscnt.=" F10='".$lastdate.$list4['F03']."'";
	   $mscnt.=" WHERE F01="."'".$brr[0]."' ";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
       $arr = array ('order_no'=>$brr[0],'lastupdate'=>$lastdate.$list4['F03']);
	    echo json_encode($arr);

}
mysqli_close($link);	
 	
?>
 