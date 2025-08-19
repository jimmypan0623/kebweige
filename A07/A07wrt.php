<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);

$brr=array();


   foreach($cart as $key=>$val){	   
        $brr[]=$val;		
   }
include("../include/mysqli_server.php");        //引用檔   
                          
if($brr[11]==0){        //如果旗標指示為新增						  
   $sql="select * from a03 where F01="."'".$brr[1]."'"; 
   $sql2=@mysqli_query($link,$sql);
   $rows=@mysqli_num_rows($sql2);
   
   if($rows==0){	 		          		  
      echo json_encode("資料庫中無此程式編號".$brr[1]);  	 
   }else{
          
	    $list4=mysqli_fetch_array($sql2);  //先把所有欄位記起來準備回傳可用的欄位
	    $sql="select * from a02 where F01="."'".$brr[0]."'"." and F03="."'".$brr[1]."'"; 
        $sql2=mysqli_query($link,$sql);
        $rows=@mysqli_num_rows($sql2);
		if($rows>0){
			 
			echo json_encode("此人員已經有此程式權限"); 
		}else{
              $order_no=date('Y'.'m'.'d'.'H'.'i'.'s');
            //寫入json檔(其實就是文字檔只是每一筆以json格式存放)
 
        	//以下處理MySQL記錄新增  
	        
	          $mscnt="INSERT INTO a02(F01,F03,F04,F05,F06,F07,F08,F09,F10,F11,F12) VALUES (";  //先把準備插入記錄的SQL 語法前半段先寫在字串中	    
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
	          $mscnt.="'".$brr[10]."'".")";		      
	          $sql=$mscnt;                                               //寫入MySQL 	 
              mysqli_query($link ,$sql) or die(mysqli_error($link));  
			 $last_id = mysqli_insert_id($link);     //找最後一個號碼	          			
		      
			$arr = array ('order_no'=>$last_id,'prg_name'=>$list4['F02'],'auth1remark'=>$list4['F08'],'auth2remark'=>$list4['F09'],'auth3remark'=>$list4['F10'],'auth4remark'=>$list4['F11'],'auth5remark'=>$list4['F12']);
			
			 
	         echo json_encode($arr);
		}
    }
	     
}else{
	   $mscnt="UPDATE a02 SET F04="."'".$brr[2]."'".",";	    
	   $mscnt.="F05="."'".$brr[3]."'".",";
	   $mscnt.="F06="."'".$brr[4]."'".",";
	   $mscnt.="F07="."'".$brr[5]."'".",";	 
	    $mscnt.="F08="."'".$brr[6]."'".",";	
		 $mscnt.="F09="."'".$brr[7]."'".",";	
		  $mscnt.="F10="."'".$brr[8]."'".",";
        $mscnt.="F11="."'".$brr[9]."'".",";			  
	   $mscnt.="F12="."'".$brr[10]."'";
	   $mscnt.=" WHERE F00="."'".$brr[11]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  
       $arr = array ('order_no'=>$brr[11],'prg_name'=>'');
	    echo json_encode($arr);
      //echo $brr[11];
}  
   
mysqli_close($link);	
 	
?>
 