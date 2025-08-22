<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);
$brr=array();
foreach($cart as $key=>$val){	   
    $brr[]=addslashes($val);		//要加入此函數避免中間有單引號錯亂
}
include("../../include/BKND/mysqli_server.php");                      //引用檔
     $sql0="select * from a01 where F01="."'".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
     $rows1=@mysqli_num_rows($sql1);                       
     $list4=mysqli_fetch_array($sql1);  //紀錄當前操作者姓名   
	 $lastdate=date('Y'.'-'.'m'.'-'.'d');
     $mArlth=count($brr);  
	 $sql3="SELECT F03 FROM c00 WHERE F01='".$brr[0]."' AND LEFT(F03,7)<='".$brr[1]."'";  //查看c00有無未更新的匯率
	 $sql4=mysqli_query($link,$sql3);
     $rows1=@mysqli_num_rows($sql4);
    if($brr[$mArlth-2]==0){        //如果旗標指示為新增						   
	    $sql="select * from c0Z where F01="."'".$brr[0]."' and F02='".$brr[1]."'"; 
        $sql2=mysqli_query($link,$sql);
        $rows=@mysqli_num_rows($sql2);
		if($rows>0){			 
			echo json_encode("資料庫已有此旬紀錄"); 
		}else{
              //$order_no=date(Y).date(m).date(d).date(H).date(i).date(s);
			  
            //寫入json檔(其實就是文字檔只是每一筆以json格式存放)
 
        	//以下處理MySQL記錄新增  	 
			
			if($rows1>0){
			    $sql5="UPDATE c00 SET F02="."'".$brr[2]."',";	    
	             $sql5.="F03="."'".$lastdate.$list4['F03']."'";	  
				 $sql5.=" WHERE F01="."'".$brr[0]."'";
				 mysqli_query($link ,$sql5) or die(mysqli_error($link));  	 
			}
			
			$sql6="UPDATE b04 SET F16='".$brr[2]."' ";
		    $sql6.=" WHERE `F90`='".substr($brr[1],0,7)."' AND `F10`<>'Y' AND F14='".$brr[0]."' ";
		    $sql6.="AND F16 <>'".$brr[2]."' AND (CASE WHEN `F02`<'11' THEN '01' WHEN `F02` > '20'  THEN '21' ELSE '11'  END) ='".substr($brr[1],-2)."' ";
		    mysqli_query($link ,$sql6) or die(mysqli_error($link));
			
		   $mscnt="INSERT INTO c0Z(F01,F02,F03,F04)  VALUES (";  //先把準備插入記錄的SQL 語法前半段先寫在字串中	 			   
		   $mscnt.="'".$brr[0]."',";
		   $mscnt.="'".$brr[1]."',";
		   $mscnt.="'".$brr[2]."',";	    
		   $mscnt.="'".$lastdate.$list4['F03']."')";		      
		   $sql=$mscnt;                                               //寫入MySQL 	 
		   mysqli_query($link ,$sql) or die(mysqli_error($link));  
		   $last_id = mysqli_insert_id($link);     //找最後一個號碼	          					     
		   $arr = array ('order_no'=>$last_id,'lastupdate'=>$lastdate.$list4['F03']);						 
		   echo json_encode($arr);
		} //新增判斷或執行結束   	     
    }else{	   //修改
	 
	    if($rows1>0){
			$sql5="UPDATE c00 SET F02="."'".$brr[2]."',";	    
	        $sql5.="F03="."'".$lastdate.$list4['F03']."'";	  
			$sql5.=" WHERE F01="."'".$brr[0]."'";
			mysqli_query($link ,$sql5) or die(mysqli_error($link));  	 
		}
	     
		$sql6="UPDATE b04 SET F16='".$brr[2]."' ";
		$sql6.=" WHERE `F90`='".substr($brr[1],0,7)."' AND `F10`<>'Y' AND F14='".$brr[0]."' ";
		$sql6.="AND F16 <>'".$brr[2]."' AND (CASE WHEN `F02`<'11' THEN '01' WHEN `F02` > '20'  THEN '21' ELSE '11'  END) ='".substr($brr[1],-2)."' ";
		mysqli_query($link ,$sql6) or die(mysqli_error($link));  
	    
		$mscnt="UPDATE c0Z SET F02="."'".$brr[1]."',";	    
	    $mscnt.="F03="."'".$brr[2]."',";	   	  
	    $mscnt.="F04="."'".$lastdate.$list4['F03']."'";
	    $mscnt.=" WHERE F00="."'".$brr[$mArlth-2]."'";
	    $sql=$mscnt;                                                 //寫入MySQL 	 
        mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
        $arr = array ('order_no'=>$brr[$mArlth-2],'lastupdate'=>$lastdate.$list4['F03']);
	    echo json_encode($arr);
      //echo $brr[11];
    }  
   
mysqli_close($link);	

?>
 