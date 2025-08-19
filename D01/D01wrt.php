<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);

$brr=array();


   foreach($cart as $key=>$val){	   
        $brr[]=addslashes(trim($val));		//要加入此函數避免單引號錯亂
   }
include("../include/mysqli_server.php");        //引用檔   
  $sql0="select * from a01 where F01="."'".$_COOKIE['useraccount']."'"; 
   $sql1=@mysqli_query($link,$sql0);
   $rows1=@mysqli_num_rows($sql1);                       
  $list4=mysqli_fetch_array($sql1);  //紀錄當前操作者姓名   
  $lastdate=date('Y'.'-'.'m'.'-'.'d');
  $mArlth=count($brr);
  
if($brr[$mArlth-2]==0){        //如果旗標指示為新增						  
 
	    $sql="select * from d01 where F01="."'".$brr[0]."'"; 
        $sql2=mysqli_query($link,$sql);
        $rows=@mysqli_num_rows($sql2);
		if($rows>0){
			 
			echo json_encode("資料庫已有此編號"); 
		}else{
              //$order_no=date(Y).date(m).date(d).date(H).date(i).date(s);
			  
            //寫入json檔(其實就是文字檔只是每一筆以json格式存放)
 
        	//以下處理MySQL記錄新增  
	        
	          $mscnt="INSERT INTO d01(F01,F03,F04,F12,F06,F11,F19,F05,F21,F08,F07,F09,F10,F22,F25,F15,F38,F13,F36,F39,F16,F18)
			   VALUES (";  //先把準備插入記錄的SQL 語法前半段先寫在字串中	    
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
               $mscnt.="'".$brr[12]."',";	 
               $mscnt.="'".$brr[13]."',";	 
               $mscnt.="'".$brr[14]."',";	
			   $mscnt.="'".str_pad(trim($brr[15]),2,"0",STR_PAD_LEFT)."',";	  
               $mscnt.="'".str_pad(trim($brr[16]),2,"0",STR_PAD_LEFT)."',";	 
               $mscnt.="'".$brr[17]."',";	 
               $mscnt.="'".$brr[18]."',";	      
               $mscnt.="'".$brr[19]."',";		
               $mscnt.="'".$brr[20]."',";				       
	           $mscnt.="'".$lastdate.$list4['F03']."')";		      
	           $sql=$mscnt;                                               //寫入MySQL 	 
               mysqli_query($link ,$sql) or die(mysqli_error($link));  
			   $last_id = mysqli_insert_id($link);     //找最後一個號碼	          			
		     
			$arr = array ('order_no'=>$last_id,'dpt_name'=>$brr[21],'lastupdate'=>$lastdate.$list4['F03']);
			
			 
	         echo json_encode($arr);
		}
   
	     
}else{	
	   $mscnt="UPDATE d01 SET F03="."'".$brr[1]."',";	    
	   $mscnt.="F04="."'".$brr[2]."',";
	   $mscnt.="F12="."'".$brr[3]."',";
	   $mscnt.="F06="."'".$brr[4]."',";	 
	    $mscnt.="F11="."'".$brr[5]."',";	
		 $mscnt.="F19="."'".$brr[6]."',";	
		  $mscnt.="F05="."'".$brr[7]."',";
		 $mscnt.="F21="."'".$brr[8]."',";	 
	    $mscnt.="F08="."'".$brr[9]."',";	
		 $mscnt.="F07="."'".$brr[10]."',";	
		  $mscnt.="F09="."'".$brr[11]."',";  	
         $mscnt.="F10="."'".$brr[12]."',";	
		 $mscnt.="F22="."'".$brr[13]."',";			  
        $mscnt.="F25="."'".$brr[14]."',";		
        $mscnt.="F15="."'".str_pad(trim($brr[15]),2,"0",STR_PAD_LEFT)."',";	 	  
		  $mscnt.="F38="."'".str_pad(trim($brr[16]),2,"0",STR_PAD_LEFT)."',";	
		 $mscnt.="F13="."'".$brr[17]."',";		
	    $mscnt.="F36="."'".$brr[18]."',";			 
		$mscnt.="F39="."'".$brr[19]."',";	
		 $mscnt.="F16="."'".$brr[20]."',";	
	   $mscnt.="F18="."'".$lastdate.$list4['F03']."'";
	   $mscnt.=" WHERE F00="."'".$brr[$mArlth-2]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  
	  
       $arr = array ('order_no'=>$brr[$mArlth-2],'lastupdate'=>$lastdate.$list4['F03']);
	    echo json_encode($arr);
      //echo $brr[11];
}  
   
mysqli_close($link);	
 	
?>
 