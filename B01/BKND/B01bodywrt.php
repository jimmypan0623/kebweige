<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
include("../../include/BKND/mysqli_server.php");                      //引用檔 
$sql5="select * from c01 where F01="."'".$brr[1]."'"; 
		 $sql6=mysqli_query($link,$sql5) or die(mysqli_error($link));
		 $rows2=@mysqli_num_rows($sql6);
if($rows2==0){
    echo json_encode("料品編號錯誤"); 
}else{	
     $sql0="select * from a01 where F01="."'".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
     $rows1=@mysqli_num_rows($sql1);                       
     $list4=mysqli_fetch_array($sql1);  //紀錄當前操作者姓名        
     $lastdate=date('Y'.'-'.'m'.'-'.'d');	 
     $mArlth=count($brr);  
     if($brr[$mArlth-2]==0){        //如果旗標指示為新增						   	    			 
            //寫入json檔(其實就是文字檔只是每一筆以json格式存放)
 
        	//以下處理MySQL記錄新增  	        
	           $mscnt="INSERT INTO c02(F03,F01,F04,F06,F07,F13,F08,F10,F11,F02,F15,F16,F99)  VALUES (";  //先把準備插入記錄的SQL 語法前半段先寫在字串中	 			   
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
	           $mscnt.="'".$lastdate.$list4['F03']."')";		      
	           $sql=$mscnt;                                               //寫入MySQL 	 
               mysqli_query($link ,$sql) or die(mysqli_error($link));  
			   $last_id = mysqli_insert_id($link);     //找最後一個號碼	          					     
			   $arr = array ('order_no'=>$last_id,'lastupdate'=>$lastdate.$list4['F03']);						 
	           echo json_encode($arr);
		      
     }else{	   //修改
	   $mscnt="UPDATE c02 SET F04="."'".$brr[2]."',";	    
	   $mscnt.="F06="."'".$brr[3]."',";	   
	   $mscnt.="F07="."'".$brr[4]."',";	 
	   $mscnt.="F13="."'".$brr[5]."',";	 
	   $mscnt.="F08="."'".$brr[6]."',";	
	   $mscnt.="F10="."'".$brr[7]."',";	
       $mscnt.="F11="."'".$brr[8]."',";	
       $mscnt.="F02="."'".$brr[9]."',";		  
       $mscnt.="F15="."'".$brr[10]."',";	   	   
	   $mscnt.="F16="."'".$brr[11]."',";	
	   $mscnt.="F99="."'".$lastdate.$list4['F03']."'";
	   $mscnt.=" WHERE F00="."'".$brr[$mArlth-2]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
       $arr = array ('order_no'=>$brr[$mArlth-2],'lastupdate'=>$lastdate.$list4['F03']);
	    echo json_encode($arr);
      //echo $brr[11];
    }  
}  
mysqli_close($link);	
 	
?>
 