<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);

$brr=array();


   foreach($cart as $key=>$val){	   
        $brr[]=$val;		
   }
    include("../../include/BKND/mysqli_server.php");         //引用檔   
                          
					  
   $sql="select * from a01 where F01="."'".$brr[1]."'"; 
   $sql2=@mysqli_query($link,$sql);
   $rows=@mysqli_num_rows($sql2);
   
   if($rows==0){	 		          		  
      echo json_encode("資料庫中無此帳號:".$brr[1]);  	 
   }else{
          
	    $list4=mysqli_fetch_array($sql2);  //先把所有欄位記起來準備回傳可用的欄位
	    $sql="select * from a02 where F01="."'".$brr[1]."'"; 
        $sql2=mysqli_query($link,$sql);
        $rows=@mysqli_num_rows($sql2);
		if($rows>0){
			 
			echo json_encode($brr[1]."已經有程式權限，欲修正其可用功能，請至該員帳號表身異動"); 
		}else{
              //$order_no=date(Y).date(m).date(d).date(H).date(i).date(s); 
            //寫入json檔(其實就是文字檔只是每一筆以json格式存放)
 
            $sql3="select * from a02 where F01="."'".$brr[0]."' order by F03";   	
            $sql4=@mysqli_query($link,$sql3);
			$rows=@mysqli_num_rows($sql4);
			if($rows==0){
			   echo json_encode("來源帳號".$brr[0]."無任何程式權限!");  						
			}else{
			     $cnt=0;
			     $mscnt="";
				 //以下處理MySQL記錄新增  
	             while ($list3=mysqli_fetch_array($sql4)){
		             $mscnt="INSERT INTO a02(F01,F03,F04,F05,F06,F07,F08,F09,F10,F11,F12) VALUES (";  //先把準備插入記錄的SQL 語法前半段先寫在字串中	    
	                 $mscnt.="'".$brr[1]."'".",";
	                 $mscnt.="'".$list3['F03']."'".",";
   	                 $mscnt.="'".$list3['F04']."'".",";
	                 $mscnt.="'".$list3['F05']."'".",";
	                 $mscnt.="'".$list3['F06']."'".",";
	                 $mscnt.="'".$list3['F07']."'".",";	  
                     $mscnt.="'".$list3['F08']."'".",";	 
                     $mscnt.="'".$list3['F09']."'".",";	 
                     $mscnt.="'".$list3['F10']."'".",";	 
                     $mscnt.="'".$list3['F11']."'".",";	 		 
	                 $mscnt.="'".$list3['F12']."'".")";		      
	                 $sql=$mscnt;                                               //寫入MySQL 	 
                     mysqli_query($link ,$sql) or die(mysqli_error($link));  
		             $cnt++;
			         $mscnt="";
	             }
 
                echo json_encode($cnt);
			}
			
		}
    }
	     

   
mysqli_close($link);	
 	
?>
 