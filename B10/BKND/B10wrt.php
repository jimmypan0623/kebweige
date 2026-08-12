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
 
 $mArlth=count($brr);  
 require_once("../../include/BKND/mysqli_server.php");                              //引用檔   
 require_once "../../include/BKND/fieldDOMset.php"; // 引入   
$sq20="select * from a26 where F01='INT_099' "; 
$sql7=@mysqli_query($link,$sq20);                        
$list8=mysqli_fetch_assoc($sql7);  //紀錄參數  	
$INT_099=$list8["F06"]; 
 $trnarray=fldafterwrite('B10','1',$link,true);  
     $sql5="select * from a14 where F01="."'".$brr[2]."' AND F04='Y'"; 
		 $sql6=mysqli_query($link,$sql5) or die(mysqli_error($link));
		 $rows2=@mysqli_num_rows($sql6);
		
if($rows2==0){
    if($INT_099=="Y" ){
	   $sql7="INSERT INTO a0i(F01,F08) values ('".substr($brr[0],0,5)."','".$brr[0]."')"; 
	   $sql8=mysqli_query($link,$sql7) or die(mysqli_error($link)); 
    }		   
	 echo json_encode("無此部門編號");  
}else{    
	 $lastdate=date('Y'.'-'.'m'.'-'.'d');
    
     if($brr[$mArlth-2]==0){        //如果旗標指示為新增		
	     
	    $sql="select * from b10 where F01="."'".$brr[0]."'"; 
        $sql2=mysqli_query($link,$sql);
        $rows=@mysqli_num_rows($sql2);
		if($rows>0){			 
			echo json_encode("資料庫已有此編號"); 		
		}else{
             			  
            //寫入json檔(其實就是文字檔只是每一筆以json格式存放)
 
        	//以下處理MySQL記錄新增  	        
	           $mscnt="INSERT INTO b10(F01,F02,F05,F08,F90,F10,F11)  VALUES (";  //先把準備插入記錄的SQL 語法前半段先寫在字串中	 			   
	           $mscnt.="'".$brr[0]."',";	      
   	           $mscnt.="'".str_pad(trim($brr[1]),2,"0",STR_PAD_LEFT)."',";	 
               $mscnt.="'".$brr[2]."',";	 	                
   	           $mscnt.="'".$brr[3]."',";	               
               $mscnt.="'".$brr[4]."',";	  	
			   $mscnt.="'N',";	
	           $mscnt.="'".$lastdate.$_SESSION['user_name']."')";		      
	           $sql=$mscnt;                                               //寫入MySQL 	 
               mysqli_query($link ,$sql) or die(mysqli_error($link));  
			   $last_id = mysqli_insert_id($link);     //找最後一個號碼	          					     
			   $arr = array ('order_no'=>$last_id,'lastupdate'=>$lastdate.$_SESSION['user_name'],'fldsatrr'=>$trnarray);						 
	           echo json_encode($arr);
		 } //新增判斷或執行結束   	     
     }else{	   //修改
	   $mscnt="UPDATE b10 SET F02="."'".str_pad(trim($brr[1]),2,"0",STR_PAD_LEFT)."',";	    
	   $mscnt.="F05="."'".$brr[2]."',";	   	    	  
	   $mscnt.="F08="."'".$brr[3]."',";	 	   
	   $mscnt.="F11="."'".$lastdate.$_SESSION['user_name']."'";
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
 