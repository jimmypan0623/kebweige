<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);

$brr=array();


   foreach($cart as $key=>$val){	   
        $brr[]=$val;		
   }
include("../include/mysqli_server.php");        //引用檔   
                          
if($brr[7]=='k'){        //如果旗標指示為新增						  
   $sql="select * from `a14` where `F01`="."'".$brr[0]."'"; 
   $sql2=mysqli_query($link,$sql);
   $rows=@mysqli_num_rows($sql2);
   if($rows>0){	 		          		  
      echo "資料庫中已有此部門編號，你已重複新增資料";  	 
   }else{   
   $order_no=date(Y).date(m).date(d).date(H).date(i).date(s); 
 //寫入json檔(其實就是文字檔只是每一筆以json格式存放)
 
	//以下處理MySQL記錄新增  
	     $mscnt="INSERT INTO a14(`F01`,`F02`,`F04`,`F05`,`F13`,`F06`,`F12`) VALUES (";  //先把準備插入記錄的SQL 語法前半段先寫在字串中	    
	     $mscnt.="'".$brr[0]."'".",";
	     $mscnt.="'".$brr[1]."'".",";
   	     $mscnt.="'".$brr[2]."'".",";
	     $mscnt.="'".$brr[3]."'".",";
	     $mscnt.="'".$brr[4]."'".",";
	     $mscnt.="'".$brr[5]."'".",";	   
	     $mscnt.="'".$brr[6]."'".")";		 
      }
	     $sql=$mscnt;                                               //寫入MySQL 	 
         mysqli_query($link ,$sql) or die(mysqli_error($link));  
	     echo $order_no;
}else{
	   $mscnt="UPDATE a14 SET F02="."'".$brr[1]."'".",";
	   $mscnt.="F04="."'".$brr[2]."'".",";
	   $mscnt.="F05="."'".$brr[3]."'".",";
	   $mscnt.="F13="."'".$brr[4]."'".",";
	   $mscnt.="F06="."'".$brr[5]."'".",";	 
	   $mscnt.="F12="."'".$brr[6]."'";
	   $mscnt.=" WHERE F00="."'".$brr[7]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  
       echo $brr[7];
} 
   
mysqli_close($link);	
 	
?>
 