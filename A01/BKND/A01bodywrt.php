<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
include("../../include/BKND/mysqli_server.php");        //引用檔   

     $sql0="select * from a01 where F01="."'".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
     $rows1=@mysqli_num_rows($sql1);                       
     $list4=mysqli_fetch_array($sql1);  //紀錄當前操作者姓名   
	 $lastdate=date('Y'.'-'.'m'.'-'.'d');
     $mArlth=count($brr);  
     if($brr[$mArlth-2]==0){        //如果旗標指示為新增						   
	    $sql="select * from a02 where F03="."'".$brr[0]."' and F01='".$brr[1]."'"; 
        $sql2=mysqli_query($link,$sql);
        $rows=@mysqli_num_rows($sql2);
		if($rows>0){			 
			echo json_encode("資料庫已有此紀錄"); 
		}else{
             
			  
            //寫入json檔(其實就是文字檔只是每一筆以json格式存放)
 
        	//以下處理MySQL記錄新增  	        
	          $mscnt="INSERT INTO a02(F03,F01,F04,F05,F06,F07,F08,F09,F10,F11,F12,F13) VALUES (";  //先把準備插入記錄的SQL 語法前半段先寫在字串中	    
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
	          $mscnt.="'".$lastdate.$list4['F03']."')";		      
	           $sql=$mscnt;                                               //寫入MySQL 	 
               mysqli_query($link ,$sql) or die(mysqli_error($link));  
			   $last_id = mysqli_insert_id($link);     //找最後一個號碼	          					     
			   $arr = array ('order_no'=>$last_id,'lastupdate'=>$lastdate.$list4['F03']);						 
	           echo json_encode($arr);
		 } //新增判斷或執行結束   	     
     }else{	   //修改
	  $mscnt="UPDATE a02 SET F04='".$brr[2]."',";	    
	   $mscnt.="F05="."'".$brr[3]."',";
	   $mscnt.="F06="."'".$brr[4]."',";
	   $mscnt.="F07="."'".$brr[5]."',";	 
	    $mscnt.="F08="."'".$brr[6]."',";	
		 $mscnt.="F09="."'".$brr[7]."',";	
		  $mscnt.="F10="."'".$brr[8]."',";
        $mscnt.="F11="."'".$brr[9]."',";			  
	   $mscnt.="F12="."'".$brr[10]."',";
	   $mscnt.="F13="."'".$lastdate.$list4['F03']."'";
	   $mscnt.=" WHERE F00="."'".$brr[$mArlth-2]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
       $arr = array ('order_no'=>$brr[$mArlth-2],'lastupdate'=>$lastdate.$list4['F03']);
	    echo json_encode($arr);
    
    }  
   
mysqli_close($link);	
 	
?>
 