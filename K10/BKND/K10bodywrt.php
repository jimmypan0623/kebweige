<?php
require_once("../../include/BKND/auth_check.php"); //驗證

$str_json = file_get_contents('php://input');
$response = json_decode($str_json, true);   // 前端已修正為單次 stringify(真實物件)，這裡可以直接一次解碼

if ($response === null) {
    echo json_encode("payload 解碼失敗");
    exit;
}

$brr = array();
foreach ($response as $key => $val) {
    $brr[] = addslashes($val);
}
require_once("../../include/BKND/mysqli_server.php");                              //引用檔         
require_once "../../include/BKND/fieldDOMset.php"; // 引入     
$trnarray=fldafterwrite('K10','2',$link,true);    
	    $sql3="SELECT k25.* FROM k25  WHERE k25.F15='".$brr[1]."' AND k25.F12>=(k25.F27+k25.F28+".$brr[5].") "; 		
		$sql4=mysqli_query($link,$sql3) or die(mysqli_error($link)); 
		 $rows1=@mysqli_num_rows($sql4);		
		 $list1=mysqli_fetch_assoc($sql4);  //抓取目前資料之出貨計劃內容 
if($rows1==0){
    echo json_encode("此客戶無應收帳款待沖銷，或沖銷金額大於可沖金額");  
}else{	
    
	 $lastdate=date('Y'.'-'.'m'.'-'.'d');
     $mArlth=count($brr);  

     if($brr[$mArlth-2]==0){        //如果旗標指示為新增		    
	    $sql="SELECT * FROM k0h WHERE F01='".$brr[0]."' AND F03='".$brr[1]."' AND F02='".$brr[2]."' "; 
        $sql2=mysqli_query($link,$sql);
        $rows=@mysqli_num_rows($sql2);
		if($rows>0){			 
			echo json_encode("憑證單號及發票號碼重複，請至已存在的紀錄修改數量"); 
		}else{             
            //寫入json檔(其實就是文字檔只是每一筆以json格式存放) 
        	//以下處理MySQL記錄新增  	        
	            $mscnt="INSERT INTO k0h(F01,F03,F02,F14,F04,F05,F12,F11)  VALUES (";  //先把準備插入記錄的SQL 語法前半段先寫在字串中	 			   
	            $mscnt.="'".$brr[0]."',";
	            $mscnt.="'".$brr[1]."',";
   	            $mscnt.="'".$brr[2]."',";	 
                $mscnt.="'".$brr[3]."',";	
                $mscnt.="'".$brr[4]."',"; 		
                $mscnt.="'".$brr[5]."',"; 
			    $mscnt.="'".$brr[6]."',"; 		             
	            $mscnt.="'".$lastdate.$_SESSION['user_name']."')";		      
	            $sql=$mscnt;                                               //寫入MySQL 	 
                mysqli_query($link ,$sql) or die(mysqli_error($link));  
			   $last_id = mysqli_insert_id($link);     //找最後一個號碼	          					     
		       $arr = array ('order_no'=>$last_id,'lastupdate'=>$lastdate.$_SESSION['user_name'],'fldsatrr'=>$trnarray);						 
		       echo json_encode($arr);
			    $armstk25="UPDATE k25 SET F28=F28+".$brr[5]." where F15='".$brr[1]."' AND F03='".$brr[7]."' ";  	                                               
               mysqli_query($link ,$armstk25) or die(mysqli_error($link));    //寫入MySQL 	
		} //新增判斷或執行結束   	     
    }else{	   //修改	    
	    $mscnt="UPDATE k0h SET F05=F05+".$brr[5].",";	    
	    $mscnt.="F12="."'".$brr[6]."',";	   
	    $mscnt.="F11="."'".$lastdate.$_SESSION['user_name']."'";
	    $mscnt.=" WHERE F00="."'".$brr[$mArlth-2]."'";
	    $sql=$mscnt;                                                 //寫入MySQL 	 
        mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
        $arr = array ('order_no'=>$brr[$mArlth-2],'lastupdate'=>$lastdate.$_SESSION['user_name'],'fldsatrr'=>$trnarray);
	    echo json_encode($arr);
	   
		 $armstk25="UPDATE k25 SET F28=F28+".$brr[5]." where F15='".$brr[1]."' AND F03='".$brr[7]."' ";  	                                               
         mysqli_query($link ,$armstk25) or die(mysqli_error($link));    //寫入MySQL 	
    }  	
}  
mysqli_close($link);	 	
?>
 