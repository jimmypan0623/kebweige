<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);

$brr=array();


   foreach($cart as $key=>$val){	   
        $brr[]=$val;		
   }
include("../include/mysqli_server.php");     //引用檔   
                          
if($brr[6]==1){        //如果旗標指示為新增						  
   //date_default_timezone_set('Asia/Taipei');
   $order_no=date(Y).date(m).date(d).date(H).date(i).date(s); 
 //寫入json檔(其實就是文字檔只是每一筆以json格式存放)
 /*   $path='recordlog/s27wrt.json';
    $handle = fopen($path, "ab");			//開啟檔案
      if ($handle) 											//若成功開啟檔案，就寫入指定內容
      {		
	    $num = fwrite($handle,substr_replace($response,'"寫入時間":'.'"'.$order_no.'"'.',',1,0)."\r\n"); 		//寫入檔案
        fclose($handle);									//關閉檔案
        echo "成功傳送".$num."個位元組";		//寫入完畢顯示成功訊息
      }
      else
        echo "傳送資料失敗"; */
	//以下處理MySQL記錄新增  
	     $mscnt="INSERT INTO s27(F00,F01,F0B,F0C,F04,F05,F06,F07,F08) VALUES (";  //先把準備插入記錄的SQL 語法前半段先寫在字串中
	     $mscnt.="'".$order_no."'".",";
		 $mscnt.="'".date(Y).'-'.date(m).'-'.date(d)."'".",";
		 $mscnt.="'".date(H).':'.date(i)."'".",";
	     $mscnt.="'".$brr[0]."'".",";
	     $mscnt.="'".$brr[1]."'".",";
   	     $mscnt.="'".$brr[2]."'".",";
	     $mscnt.="'".$brr[3]."'".",";
	     $mscnt.="'".$brr[4]."'".",";
	     $mscnt.="'".$brr[5]."'".")";		 
    
	     $sql=$mscnt;                                               //寫入MySQL 	 
         mysqli_query($link ,$sql) or die(mysqli_error($link));  
	     echo $order_no;
}else if($brr[6]==3){
	
	   $mscnt="UPDATE s27 SET F08="."'".date(H).':'.date(i)."'";	  //簽到時間 
	    $mscnt.=" WHERE F00="."'".$brr[0]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  
       echo $brr[0];
}else{
	   $mscnt="UPDATE s27 SET F04="."'".$brr[1]."'".",";
	   $mscnt.="F05="."'".$brr[2]."'".",";
	   $mscnt.="F06="."'".$brr[3]."'".",";	   
	   $mscnt.="F07="."'".$brr[4]."'";
	   $mscnt.=" WHERE F00="."'".$brr[6]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  
       echo $brr[6];
} 
mysqli_close($link);  
	
 	
?>
 