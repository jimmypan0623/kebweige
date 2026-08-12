<?php
require_once("../../include/BKND/auth_check.php"); //驗證
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)

// 【修正】原本這裡是「雙重 json_decode」：
//   $response = json_decode($str_json);
//   $cart = json_decode($response);
// 對齊 C04wrt.php / B04wrt.php / B04bodywrt.php / C00wrt.php / C00bodywrt.php 的修法：
// 前端已改為單次 stringify(真實物件)，這裡直接一次解碼即可。
$cart = json_decode($str_json, true);   // 前端已改為單次 stringify(真實物件)，這裡直接一次解碼
if ($cart === null) {
    echo json_encode("payload 解碼失敗");
    exit;
}

$brr = array();
foreach ($cart as $key => $val) {
    $brr[] = addslashes(trim($val));		//要加入此函數避免中間有單引號錯亂
}

// 【新增防呆】陣列長度檢查，本檔案最深使用到 $brr[32]，故至少需要 33 筆
if (count($brr) < 33) {
    echo json_encode("傳入資料筆數不足");
    exit;
}

require_once("../../include/BKND/mysqli_server.php");        //引用檔   
require_once "../../include/BKND/fieldDOMset.php"; // 引入     
$trnarray=fldafterwrite('C01','1',$link,true);  
if( trim($brr[0])!=trim($brr[22])){  //如果群組編號不等於客戶編號
        $sql="select * from c01 where F01="."'".$brr[22]."'";  //要判斷群組編號是否存在客戶主檔中
        $sql2=mysqli_query($link,$sql);
        $rows=@mysqli_num_rows($sql2);
		if($rows==0){			 
			 
			$brr[22]=$brr[0];  //強制相同
		}
}
     
	 $lastdate=date('Y'.'-'.'m'.'-'.'d');
     $mArlth=count($brr);  
     if($brr[$mArlth-2]==0){        //如果旗標指示為新增						   
	    $sql="select * from c01 where F01="."'".$brr[0]."'"; 
        $sql2=mysqli_query($link,$sql);
        $rows=@mysqli_num_rows($sql2);
		if($rows>0){			 
			echo json_encode("資料庫已有此編號"); 
		}else{
              			  
            //寫入json檔(其實就是文字檔只是每一筆以json格式存放)
 
        	//以下處理MySQL記錄新增  
	        
	           $mscnt="INSERT INTO c01(F01,F04,F05,F03,F10,F43,F21,F20,F41,F42,F29,F30,F09,F06,F07,F08,F32,F12,F11,F13,F14,F22,
			   F44,F39,F17,F38,F15,F36,F33,F23,F31,F40,F25,F26) VALUES (";  //先把準備插入記錄的SQL 語法前半段先寫在字串中	    
	           $mscnt.="'".$brr[0]."',"; //F01
	           $mscnt.="'".$brr[1]."',"; //F04
   	           $mscnt.="'".$brr[2]."',"; //F05
	           $mscnt.="'".$brr[3]."',";  //F03
	           $mscnt.="'".$brr[4]."',";  //F10
	           $mscnt.="'".$brr[5]."',";	//F43  
               $mscnt.="'".$brr[6]."',";	 //F21
               $mscnt.="'".$brr[7]."',";	//F20 
               $mscnt.="'".$brr[8]."',";	 //F41
               $mscnt.="'".$brr[9]."',";	  //F42		 
			   $mscnt.="'".$brr[10]."',";	  //F29
               $mscnt.="'".$brr[11]."',";	  //F30
               $mscnt.="'".$brr[12]."',";	 //F09
               $mscnt.="'".$brr[13]."',";	 //F06
               $mscnt.="'".$brr[14]."',";	//F07
			   $mscnt.="'".$brr[15]."',";	  //F08
               $mscnt.="'".$brr[16]."',";	 //F32
               $mscnt.="'".$brr[17]."',";	 //F12
               $mscnt.="'".$brr[18]."',";	  //F11    
               $mscnt.="'".$brr[19]."',";		//F13
               $mscnt.="'".$brr[20]."',";			//F14	
               $mscnt.="'".$brr[21]."',";	 //F22
               $mscnt.="'".$brr[22]."',";	 //F44
               $mscnt.="'".$brr[23]."',";	//F39
			   $mscnt.="'".str_pad(trim($brr[24]),2,"0",STR_PAD_LEFT)."',";	  //F17 
               $mscnt.="'".str_pad(trim($brr[25]),2,"0",STR_PAD_LEFT)."',";	  //F38
               $mscnt.="'".$brr[26]."',";	 
               $mscnt.="'".$brr[27]."',";	      
               $mscnt.="'".$brr[28]."',";		
               $mscnt.="'".$brr[29]."',";	//30		
               $mscnt.="'".$brr[30]."',";	//32	
               $mscnt.="'".$brr[31]."',";	//33	
               $mscnt.="'".$brr[32]."',";	//34			  
	           $mscnt.="'".$lastdate.$_SESSION['user_name']."')";		      
	           $sql=$mscnt;                                               //寫入MySQL 	 
               mysqli_query($link ,$sql) or die(mysqli_error($link));  
			   $last_id = mysqli_insert_id($link);     //找最後一個號碼	          					     
			   $arr = array ('order_no'=>$last_id,'group_no'=>$brr[22],'lastupdate'=>$lastdate.$_SESSION['user_name'],'fldsatrr'=>$trnarray);						 
	           echo json_encode($arr);
		 } //新增判斷或執行結束   	     
     }else{	   //修改
	   $mscnt="UPDATE c01 SET F04="."'".$brr[1]."',";	    
	   $mscnt.="F05="."'".$brr[2]."',";
	   $mscnt.="F03="."'".$brr[3]."',";
	   $mscnt.="F10="."'".$brr[4]."',";	 
	    $mscnt.="F43="."'".$brr[5]."',";	
		 $mscnt.="F21="."'".$brr[6]."',";	
		  $mscnt.="F20="."'".$brr[7]."',";
		 $mscnt.="F41="."'".$brr[8]."',";	 
	    $mscnt.="F42="."'".$brr[9]."',";	
		 $mscnt.="F29="."'".$brr[10]."',";	
		  $mscnt.="F30="."'".$brr[11]."',";  	
         $mscnt.="F09="."'".$brr[12]."',";	
		 $mscnt.="F06="."'".$brr[13]."',";			  
        $mscnt.="F07="."'".$brr[14]."',";		
        $mscnt.="F08="."'".$brr[15]."',";	 	  
		  $mscnt.="F32="."'".$brr[16]."',";	
		 $mscnt.="F12="."'".$brr[17]."',";		
	    $mscnt.="F11="."'".$brr[18]."',";			 
		$mscnt.="F13="."'".$brr[19]."',";	
		$mscnt.="F14="."'".$brr[20]."',";
		$mscnt.="F22="."'".$brr[21]."',";
		$mscnt.="F44="."'".$brr[22]."',";
		$mscnt.="F39="."'".$brr[23]."',";
		$mscnt.="F17="."'".str_pad(trim($brr[24]),2,"0",STR_PAD_LEFT)."',";
		$mscnt.="F38="."'".str_pad(trim($brr[25]),2,"0",STR_PAD_LEFT)."',";
		$mscnt.="F15="."'".$brr[26]."',";
		$mscnt.="F36="."'".$brr[27]."',";
		$mscnt.="F33="."'".$brr[28]."',";
		$mscnt.="F23="."'".$brr[29]."',";
		$mscnt.="F31="."'".$brr[30]."',";
		$mscnt.="F40="."'".$brr[31]."',";
		$mscnt.="F25="."'".$brr[32]."',";
	   $mscnt.="F26="."'".$lastdate.$_SESSION['user_name']."'";
	   $mscnt.=" WHERE F00="."'".$brr[$mArlth-2]."'";
	   $sql=$mscnt;                                                 //寫入MySQL 	 
       mysqli_query($link ,$sql) or die(mysqli_error($link));  	  
       $arr = array ('order_no'=>$brr[$mArlth-2],'group_no'=>$brr[22],'lastupdate'=>$lastdate.$_SESSION['user_name'],'fldsatrr'=>$trnarray);
	    echo json_encode($arr);
      //echo $brr[11];
    }  
   
mysqli_close($link);	
 	
?>