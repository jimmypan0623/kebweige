<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);

$brr=array();


   foreach($cart as $key=>$val){	   
        $brr[]=$val;		
   }
include("../include/mysqli_server.php");     //引用檔   
                          
if($brr[8]==0){        //如果旗標指示為新增						  
  
   //$order_no=date(Y).date(m).date(d).date(H).date(i).date(s); 
   $order_no=date('Y'.'m'.'d'.'H'.'i'.'s');
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
	 $sql3="SELECT * FROM `a01` WHERE F01='".$brr[0]."'"; 
     $sql2=mysqli_query($link,$sql3);
   	 $rows=@mysqli_num_rows($sql2);
	 if ($rows==0){  
	//以下處理MySQL記錄新增  
	     $mscnt="INSERT INTO a01(F01,F02,F03,F04,F07,F10,F12,F13) VALUES (";  //先把準備插入記錄的SQL 語法前半段先寫在字串中
	     
	     $mscnt.="'".$brr[0]."'".",";
	     $mscnt.="'".$brr[1]."'".",";
   	     $mscnt.="'".$brr[2]."'".",";
	     $mscnt.="'".$brr[3]."'".",";
	     $mscnt.="'".$brr[4]."'".",";
		 $mscnt.="'".$brr[5]."'".",";
		 $mscnt.="'".$brr[6]."'".",";
	     $mscnt.="'".$brr[7]."'".")";		 
    
	     $sql=$mscnt;                                               //寫入MySQL 	 
         mysqli_query($link ,$sql) or die(mysqli_error($link));  
	     echo $order_no;
	 }else{
		 echo "可能帳號重複新增失敗";
	 }

}else {
	    $mscnt="UPDATE a01 SET F02="."'".$brr[1]."'".",";
	   $mscnt.="F03="."'".$brr[2]."'".",";
	   $mscnt.="F04="."'".$brr[3]."'".",";
	   $mscnt.="F07="."'".$brr[4]."'".",";
	   $mscnt.="F10="."'".$brr[5]."'".",";
	   $mscnt.="F12="."'".$brr[6]."'".",";
	   $mscnt.="F13="."'".$brr[7]."'";
	   $mscnt.=" WHERE F00="."'".$brr[8]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  
       echo $brr[8];
} 
mysqli_close($link);  
	
 	
?>
 