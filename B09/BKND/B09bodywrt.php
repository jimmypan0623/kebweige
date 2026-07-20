<?php
require_once("../../include/BKND/auth_check.php"); //驗證
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
 require_once("../../include/BKND/mysqli_server.php");                              //引用檔    
 require_once "../../include/BKND/fieldDOMset.php"; // 引入     
 $trnarray=fldafterwrite('B09','2',$link,true);  
        $sql5="SELECT F01 FROM b01 WHERE F01='".$brr[1]."'"; 
		 $sql6=mysqli_query($link,$sql5) or die(mysqli_error($link));
		 $rows2=@mysqli_num_rows($sql6);
	    
if($rows2==0){
    echo json_encode("無此品號!"); 		 

}else{	     
     $sql0="SELECT * FROM a01 WHERE F01="."'".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
     $rows1=@mysqli_num_rows($sql1);                       
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前操作者姓名   
	 $lastdate=date('Y'.'-'.'m'.'-'.'d');
     $mArlth=count($brr);  
     if($brr[$mArlth-2]==0){        //如果旗標指示為新增		 
	    $sql="SELECT * FROM b0i WHERE F01='".$brr[0]."' AND F03='".$brr[1]."' "; 
        $sql2=mysqli_query($link,$sql);
        $rows=@mysqli_num_rows($sql2);
		if($rows>0){			 
			echo json_encode("品號及訂單號碼重複，請至該筆修改數量"); 
		}else{
            //寫入json檔(其實就是文字檔只是每一筆以json格式存放) 
        	//以下處理MySQL記錄新增  	        
	           $mscnt="INSERT INTO b0i(F01,F03,F04,F25,F11)  VALUES (";  //先把準備插入記錄的SQL 語法前半段先寫在字串中	 			   
	           $mscnt.="'".$brr[0]."',";
	           $mscnt.="'".$brr[1]."',";
   	           $mscnt.="'".$brr[2]."',";	 
               $mscnt.="'".$brr[3]."',";	               
	           $mscnt.="'".$lastdate.$list4['F03']."')";		      
	           $sql=$mscnt;                                               //寫入MySQL 	 
               mysqli_query($link ,$sql) or die(mysqli_error($link));  
			   $last_id = mysqli_insert_id($link);     //找最後一個號碼	          					     
			   $arr = array ('order_no'=>$last_id,'lastupdate'=>$lastdate.$list4['F03'],'fldsatrr'=>$trnarray);			   	 
	           echo json_encode($arr);
			  
		 } //新增判斷或執行結束   	     
     }else{	   //修改
	   $mscnt="UPDATE b0i SET F04=".$brr[2].",";	    	 
	   $mscnt.="F25="."'".$brr[3]."',";	 	   
	   $mscnt.="F11="."'".$lastdate.$list4['F03']."'";
	   $mscnt.=" WHERE F00="."'".$brr[$mArlth-2]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
       $arr = array ('order_no'=>$brr[$mArlth-2],'lastupdate'=>$lastdate.$list4['F03'],'fldsatrr'=>$trnarray);
	    echo json_encode($arr);  
	  
    }  
    
}  
mysqli_close($link);	
 	
?>
 