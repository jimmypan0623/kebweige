<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);

$brr=array();


   foreach($cart as $key=>$val){	   
        $brr[]=addslashes($val);		
   }
include("../../include/BKND/mysqli_server.php");                      //引用檔 
  $sql0="select * from a01 where F01="."'".$_COOKIE['useraccount']."'"; 
   $sql1=@mysqli_query($link,$sql0);
   $rows1=@mysqli_num_rows($sql1);                       
  $list4=mysqli_fetch_array($sql1);  //先把所有欄位記起來準備回傳可用的欄位   
  $lastdate=date('Y'.'-'.'m'.'-'.'d');
  $mArlth=count($brr);
if($brr[$mArlth-2]==0){        //如果旗標指示為新增						  		
	    $sql="select * from b01 where F01="."'".$brr[0]."'"; 
        $sql2=mysqli_query($link,$sql);
        $rows=@mysqli_num_rows($sql2);
		if($rows>0){			 
			echo json_encode("資料庫已有此料號"); 
		}else if(empty($brr[0])){
			echo json_encode("資料空值"); 
              //$order_no=date(Y).date(m).date(d).date(H).date(i).date(s);
		}else{	  
            //寫入json檔(其實就是文字檔只是每一筆以json格式存放)
 
        	//以下處理MySQL記錄新增  
	        
	          $mscnt="INSERT INTO b01(F01,F02,F06,F98,F03,F04,F05,F07,F10,F11,F41,F97,F39,F30,F28,F31,F38,F37,F29,F42,F49,F21) VALUES (";  //先把準備插入記錄的SQL 語法前半段先寫在字串中	    
	           $mscnt.="'".$brr[0]."'".",";
	           $mscnt.="'".$brr[1]."'".",";
   	            $mscnt.="'".$brr[2]."'".",";
	            $mscnt.="'".$brr[3]."'".",";
	           $mscnt.="'".$brr[4]."'".",";
	          $mscnt.="'".$brr[5]."'".",";	  
              $mscnt.="'".$brr[6]."'".",";	 
              $mscnt.="'".$brr[7]."'".",";	 
              $mscnt.="'".$brr[8]."'".",";	 
              $mscnt.="'".$brr[9]."'".",";	 		 
			  $mscnt.="'".$brr[10]."'".",";	  
              $mscnt.="'".$brr[11]."'".",";	 
              $mscnt.="'".$brr[12]."'".",";	 
              $mscnt.="'".$brr[13]."'".",";	 
              $mscnt.="'".$brr[14]."'".",";	
			  $mscnt.="'".$brr[15]."'".",";	  
              $mscnt.="'".$brr[16]."'".",";	 
              $mscnt.="'".$brr[17]."'".",";	 
              $mscnt.="'".$brr[18]."'".",";	      
              $mscnt.="'".$brr[19]."'".",";		
              $mscnt.="'".$brr[20]."'".",";					  
	          $mscnt.="'".$lastdate.$list4['F03']."'".")";		      
	          $sql=$mscnt;                                               //寫入MySQL 	 
              mysqli_query($link ,$sql) or die(mysqli_error($link));  
			 $last_id = mysqli_insert_id($link);     //找最後一個號碼	          			
		     
			$arr = array ('order_no'=>$last_id,'dpt_name'=>$brr[21],'lastupdate'=>$lastdate.$list4['F03']);
			
			 
	         echo json_encode($arr);
		}
   
	     
}else{
	   $mscnt="UPDATE b01 SET F02="."'".$brr[1]."'".",";	    
	   $mscnt.="F06="."'".$brr[2]."'".",";
	   $mscnt.="F98="."'".$brr[3]."'".",";
	   $mscnt.="F03="."'".$brr[4]."'".",";	 
	    $mscnt.="F04="."'".$brr[5]."'".",";	
		 $mscnt.="F05="."'".$brr[6]."'".",";	
		  $mscnt.="F07="."'".$brr[7]."'".",";
		 $mscnt.="F10="."'".$brr[8]."'".",";	 
	    $mscnt.="F11="."'".$brr[9]."'".",";	
		 $mscnt.="F41="."'".$brr[10]."'".",";	
		  $mscnt.="F97="."'".$brr[11]."'".",";  	
         $mscnt.="F39="."'".$brr[12]."'".",";	
		 $mscnt.="F30="."'".$brr[13]."'".",";			  
        $mscnt.="F28="."'".$brr[14]."'".",";		
        $mscnt.="F31="."'".$brr[15]."'".",";	 	  
		  $mscnt.="F38="."'".$brr[16]."'".",";	
		 $mscnt.="F37="."'".$brr[17]."'".",";		
	    $mscnt.="F29="."'".$brr[18]."'".",";			 
		$mscnt.="F42="."'".$brr[19]."'".",";	
		$mscnt.="F49="."'".$brr[20]."'".",";	
	   $mscnt.="F21="."'".$lastdate.$list4['F03']."'";
	   $mscnt.=" WHERE F00="."'".$brr[$mArlth-2]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  
	  
       $arr = array ('order_no'=>$brr[$mArlth-2],'lastupdate'=>$lastdate.$list4['F03']);
	    echo json_encode($arr);
      //echo $brr[11];
}  
   
mysqli_close($link);	
 	
?>
 