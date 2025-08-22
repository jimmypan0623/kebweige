<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
include("../../include/BKND/mysqli_server.php");                              //引用檔   
        $sql5="SELECT * FROM a14 WHERE F12='Y' AND F01="."'".$brr[5]."'"; 
		 $sql6=mysqli_query($link,$sql5) or die(mysqli_error($link));
		 $rows2=@mysqli_num_rows($sql6);
	    $sql3="SELECT c04.*,c03.F01 AS F0A FROM c04,c03 WHERE c04.F02='".$brr[1]."' AND c04.F01='".$brr[2]."' AND c04.F03-c04.F09-c04.F21-c04.F23>=0 AND c03.F01=c04.F01 AND c03.F04='Y' AND c03.F03='".$brr[8]."'"; 		
		$sql4=mysqli_query($link,$sql3) or die(mysqli_error($link)); 
		 $rows1=@mysqli_num_rows($sql4);		
		 $list1=mysqli_fetch_array($sql4);  //抓取目前資料之出貨計劃內容 
if($rows2==0){
    echo json_encode("無此出貨部門"); 		 
}else if($rows1==0){
    echo json_encode("無此出貨計劃"); 
}else if($list1['F23']+$list1['F21']+$list1['F09']+$brr[3]>$list1['F03']){
	echo json_encode("出貨單數量超出本訂單可出數量:".strval($list1['F23']+$list1['F21']+$list1['F09']+$brr[3]-$list1['F03'])); 
}else{	
     
     $sql0="SELECT * FROM a01 WHERE F01="."'".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
     $rows1=@mysqli_num_rows($sql1);                       
     $list4=mysqli_fetch_array($sql1);  //紀錄當前操作者姓名   
	 $lastdate=date('Y'.'-'.'m'.'-'.'d');
     $mArlth=count($brr);  
     if($brr[$mArlth-2]==0){        //如果旗標指示為新增	
	 
	    $sql="SELECT * FROM b0e WHERE F01='".$brr[0]."' AND F03='".$brr[1]."' AND F07='".$brr[2]."' "; 
        $sql2=mysqli_query($link,$sql);
        $rows=@mysqli_num_rows($sql2);
		if($rows>0){			 
			echo json_encode("品號及訂單號碼重複，請至該筆修改數量"); 
		}else{
             
			  
            //寫入json檔(其實就是文字檔只是每一筆以json格式存放)
 
        	//以下處理MySQL記錄新增  	        
	           $mscnt="INSERT INTO b0e(F01,F03,F07,F04,F15,F05,F08,F09,F11)  VALUES (";  //先把準備插入記錄的SQL 語法前半段先寫在字串中	 			   
	           $mscnt.="'".$brr[0]."',";
	           $mscnt.="'".$brr[1]."',";
   	           $mscnt.="'".$brr[2]."',";	 
               $mscnt.="'".$brr[3]."',";	
               $mscnt.="'".$brr[4]."',"; 		
               $mscnt.="'".$brr[5]."',"; 
			   $mscnt.="'".$brr[6]."',"; 		
               $mscnt.="'".$brr[7]."',"; 
	           $mscnt.="'".$lastdate.$list4['F03']."')";		      
	           $sql=$mscnt;                                               //寫入MySQL 	 
               mysqli_query($link ,$sql) or die(mysqli_error($link));  
			   $last_id = mysqli_insert_id($link);     //找最後一個號碼	          					     
			   $arr = array ('order_no'=>$last_id,'lastupdate'=>$lastdate.$list4['F03']);
			   $armstc03="UPDATE c03 SET F08='Y' where F01='".$brr[2]."' ";  	                                               
               mysqli_query($link ,$armstc03) or die(mysqli_error($link));    //寫入MySQL 	 
	           echo json_encode($arr);
		 } //新增判斷或執行結束   	     
     }else{	   //修改
	   $mscnt="UPDATE b0e SET F04=F04+".$brr[3].",";	    
	   $mscnt.="F15="."'".$brr[4]."',";	   
	   $mscnt.="F05="."'".$brr[5]."',";	 
	   $mscnt.="F08="."'".$brr[6]."',";	 
	   $mscnt.="F09="."'".$brr[7]."',";	
	   $mscnt.="F11="."'".$lastdate.$list4['F03']."'";
	   $mscnt.=" WHERE F00="."'".$brr[$mArlth-2]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
       $arr = array ('order_no'=>$brr[$mArlth-2],'lastupdate'=>$lastdate.$list4['F03']);
	    echo json_encode($arr);
      //echo $brr[11];
    }  
	//$armstc05="UPDATE c05 SET F05=F05+".$brr[3]." where F02='".$brr[1]."' AND F01='".$brr[2]."' ";  	                                               
     //mysqli_query($link ,$armstc05) or die(mysqli_error($link));    //寫入MySQL 	 
    $armstc04="UPDATE c04 SET F23=F23+".$brr[3]." where F02='".$brr[1]."' AND F01='".$brr[2]."' ";  	                                               
     mysqli_query($link ,$armstc04) or die(mysqli_error($link));    //寫入MySQL 	
}  
mysqli_close($link);	
 	
?>
 