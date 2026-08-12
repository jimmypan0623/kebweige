<?php
require_once("../../include/BKND/auth_check.php"); //驗證
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)

// 【修正】原本這裡是「雙重 json_decode」：
//   $response = json_decode($str_json);
//   $cart = json_decode($response);
// 對齊 C04wrt.php / B04wrt.php / B04bodywrt.php 的修法：
// 前端已改為單次 stringify(真實物件)，這裡直接一次解碼即可。
$cart = json_decode($str_json, true);   // 前端已改為單次 stringify(真實物件)，這裡直接一次解碼
if ($cart === null) {
    echo json_encode("payload 解碼失敗");
    exit;
}

$brr = array();
foreach ($cart as $key => $val) {
    $brr[] = addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
require_once("../../include/BKND/mysqli_server.php");       //引用檔   
require_once "../../include/BKND/fieldDOMset.php"; // 引入     
$trnarray=fldafterwrite('D02','1',$link,true);  
$sql5="select * from d01 where F01="."'".$brr[1]."'"; 
		 $sql6=mysqli_query($link,$sql5) or die(mysqli_error($link));
		 $rows2=@mysqli_num_rows($sql6);
	 
if($rows2==0){
    echo json_encode("無此廠商編號"); 
	
}else{	
  
     $lastdate=date('Y'.'-'.'m'.'-'.'d');
     $mArlth=count($brr);  
     if($brr[$mArlth-2]==0){        //如果旗標指示為新增						   
	  
               $sql3="select * from b01 where F01="."'".$brr[0]."'"; 
		       $sql4=mysqli_query($link,$sql3) or die(mysqli_error($link));
		       $rows3=@mysqli_num_rows($sql4);		 	
			if($rows3==0){
	             echo json_encode("無此料品編號");  
			}else{	 
        	//以下處理MySQL記錄新增  	        
	           $mscnt="INSERT INTO d02(F03,F01,F04,F06,F07,F08,F13,F10,F11,F02,F15,F16,F99)  VALUES (";  //先把準備插入記錄的SQL 語法前半段先寫在字串中	 			   
	           $mscnt.="'".$brr[0]."',";
	           $mscnt.="'".$brr[1]."',";
   	           $mscnt.="'".$brr[2]."',";	    
               $mscnt.="'".$brr[3]."',";   	 
         	   $mscnt.="'".$brr[4]."',";
   	           $mscnt.="'".$brr[5]."',";	    
               $mscnt.="'".$brr[6]."',";   
			   $mscnt.="'".$brr[7]."',";
   	           $mscnt.="'".$brr[8]."',";	    
               $mscnt.="'".$brr[9]."',"; 
               $mscnt.="'".$brr[10]."',";	    
               $mscnt.="'".$brr[11]."',"; 			   
	           $mscnt.="'".$lastdate.$_SESSION['user_name']."')";		      
	           $sql=$mscnt;                                               //寫入MySQL 	 
               mysqli_query($link ,$sql) or die(mysqli_error($link));  
			   $last_id = mysqli_insert_id($link);     //找最後一個號碼	          					     
			   $arr = array ('order_no'=>$last_id,'lastupdate'=>$lastdate.$_SESSION['user_name'],'fldsatrr'=>$trnarray);						 
	           echo json_encode($arr);
		    }  	     
     }else{	   //修改
	   $mscnt="UPDATE d02 SET F01="."'".$brr[1]."',";	    
	   $mscnt.="F04="."'".$brr[2]."',";	  
       $mscnt.="F06="."'".$brr[3]."',";	     
       $mscnt.="F07="."'".$brr[4]."',";	  
       $mscnt.="F08="."'".$brr[5]."',";	  
 	   $mscnt.="F13="."'".$brr[6]."',";	  
       $mscnt.="F10="."'".$brr[7]."',";	     
       $mscnt.="F11="."'".$brr[8]."',";	  
       $mscnt.="F02="."'".$brr[9]."',";	 
	   $mscnt.="F15="."'".$brr[10]."',";	  
       $mscnt.="F16="."'".$brr[11]."',";	
	   $mscnt.="F99="."'".$lastdate.$_SESSION['user_name']."'";
	   $mscnt.=" WHERE F00="."'".$brr[$mArlth-2]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
       $arr = array ('order_no'=>$brr[$mArlth-2],'lastupdate'=>$lastdate.$_SESSION['user_name'],'fldsatrr'=>$trnarray);
	    echo json_encode($arr);
      //echo $brr[11];
    }  
}
mysqli_close($link);	
 	
?>
 