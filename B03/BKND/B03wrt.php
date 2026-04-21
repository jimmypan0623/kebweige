<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
 $mArlth=count($brr);  
 require_once("../../include/BKND/mysqli_server.php");           
require_once "../../include/BKND/fieldDOMset.php"; // 引入     
 $trnarray=fldafterwrite('B03','1',$link,true);  
     $sql5="SELECT * FROM a01 WHERE F01='".$brr[3]."'"; 
		 $sql6=mysqli_query($link,$sql5) or die(mysqli_error($link));
		 $rows2=@mysqli_num_rows($sql6);
		 if($brr[$mArlth-2]==0){
	        $sql3="SELECT * FROM b02 WHERE F01='".$brr[5]."' AND F20='".$brr[6]."' AND F06='".$brr[1]."' "; 
		    $sql4=mysqli_query($link,$sql3) or die(mysqli_error($link)); 
		    $rows1=@mysqli_num_rows($sql4);
		 }else{
		    $rows1=1;
		 }
if($rows1==0 || $rows2==0){
    if($_COOKIE["INT_099"]=="Y" ){
	   $sql7="INSERT INTO a0i(F01,F08) values ('".substr($brr[0],0,5)."','".$brr[0]."')"; 
	   $sql8=mysqli_query($link,$sql7) or die(mysqli_error($link)); 
    }
	if($rows1==0) echo json_encode("原進貨月份無此進貨紀錄"); 	   
	if($rows2==0) echo json_encode("採購人員資料錯誤");  
}else{
     $sql0="SELECT * FROM a01 WHERE F01='".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
     $rows1=@mysqli_num_rows($sql1);                       
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前操作者姓名        
	 $lastdate=date('Y'.'-'.'m'.'-'.'d');
    
    if($brr[$mArlth-2]==0){        //如果旗標指示為新增		
	     
	    $sql="SELECT * FROM b03 WHERE F01='".$brr[0]."'"; 
        $sql2=mysqli_query($link,$sql);
        $rows=@mysqli_num_rows($sql2);
		if($rows>0){			 
			echo json_encode("資料庫已有此編號"); 		
		}else{
             
			 
            //寫入json檔(其實就是文字檔只是每一筆以json格式存放)
 
        	//以下處理MySQL記錄新增  	        
	           $mscnt="INSERT INTO b03(F01,F06,F02,F09,F08,F21,F20,F22,F23,F14,F16,F24,F25,F90,F10,F13) VALUES (";  //先把準備插入記錄的SQL 語法前半段先寫在字串中	 			   
	           $mscnt.="'".$brr[0]."',";
	           $mscnt.="'".$brr[1]."',";
   	           $mscnt.="'".str_pad(trim($brr[2]),2,"0",STR_PAD_LEFT)."',";	 
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
			   $mscnt.="'N',";	
	           $mscnt.="'".$lastdate.$list4['F03']."')";		      	                                                          //寫入MySQL 	 
               mysqli_query($link ,$mscnt) or die(mysqli_error($link));  
			   $last_id = mysqli_insert_id($link);     //找最後一個號碼	          					     
			   $arr = array ('order_no'=>$last_id,'lastupdate'=>$lastdate.$list4['F03'],'fldsatrr'=>$trnarray);						 
	           echo json_encode($arr);
		} //新增判斷或執行結束   	     
    }else{	   //修改
	    if(intval($brr[11])>3){
	        if(intval($brr[11])==9){   //退變折
			    $d04update="UPDATE d04 SET d04.F24=d04.F24+(-1)
                *(SELECT b0c.F04 FROM b0c WHERE d04.F01=b0c.F07 AND d04.F02=b0c.F03 AND b0c.F01='".$brr[0]."') 
                WHERE CONCAT(d04.F01,d04.F02) IN (SELECT CONCAT(F07,F03) FROM b0c WHERE F01='".$brr[0]."')";
		    }else{              //折變退
		        $d04update="UPDATE d04 SET d04.F24=d04.F24+
                (SELECT b0c.F04 FROM b0c WHERE d04.F01=b0c.F07 AND d04.F02=b0c.F03 AND b0c.F01='".$brr[0]."') 
                WHERE CONCAT(d04.F01,d04.F02) IN (SELECT CONCAT(F07,F03) FROM b0c WHERE F01='".$brr[0]."')";
		    }
			mysqli_query($link ,$d04update) or die(mysqli_error($link));  
		    
	        $brr[11]=strval(intval($brr[11])-6);
	    }
	   $mscnt="UPDATE b03 SET F02='".str_pad(trim($brr[2]),2,"0",STR_PAD_LEFT)."',";	    
	   $mscnt.="F09='".$brr[3]."',";	   	    	  	
	   $mscnt.="F22='".$brr[7]."',";	 
	   $mscnt.="F23='".$brr[8]."',";	 
	   $mscnt.="F14='".$brr[9]."',";	 
	   $mscnt.="F16='".$brr[10]."',";	   		   
	   $mscnt.="F24='".$brr[11]."',";	      
	   $mscnt.="F25='".$brr[12]."',";	  
	   $mscnt.="F13='".$lastdate.$list4['F03']."'";
	   $mscnt.=" WHERE F00='".$brr[$mArlth-2]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
       $arr = array ('order_no'=>$brr[$mArlth-2],'lastupdate'=>$lastdate.$list4['F03'],'fldsatrr'=>$trnarray);
	    echo json_encode($arr); 
      
    } 
}  
mysqli_close($link);	 	
?>