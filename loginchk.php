<?php         
    header("Content-Type:text/html; charset=utf-8"); 
if(isset($_COOKIE['userid'])  && isset($_COOKIE['CAPTCHA']) ){
	     setcookie('CAPTCHA','',time()-999);	
		 setcookie('errmsg','A3');
		 header('refresh:0; url=ZRO.html');			 
	   	exit;			
}else{
    include("include/BKND/mysqli_server.php");               
       $user_account = mysqli_real_escape_string($link,$_POST['account']);
       $user_password = mysqli_real_escape_string($link,$_POST['password']);
	    $user_validcode = mysqli_real_escape_string($link,$_POST['validcode']);
	if($_POST['validcode']==$_COOKIE['CAPTCHA'] ){	
		$query = "SELECT a01.F00,a01.F01,a01.F02,a01.F03,a01.F04 FROM a01 WHERE a01.F01 ='".$user_account."' AND a01.F02 = '".$user_password."' "; 
	   //用使用者名稱和密碼進行查詢         
	   $data = mysqli_query($link,$query);		   
	   //若查到的記錄正好為一條，則設定COOKIE，同時進行頁面重定向
		if(mysqli_num_rows($data)==1){
			$row = mysqli_fetch_array($data);				
		  //cookie保留7天			                 
			setcookie('userid',md5($row[0]));
			setcookie('useraccount',$row[1]);// time()+7*24*60*60);	
           // setcookie('password',$row[2]);			
			setcookie('dptno',$row[4]);
			//////以下這幾行要先清空
				
			setcookie('CAPTCHA','',time()-999);	 
			setcookie('tmpacnt','',time()-999);
			setcookie('tmppswd','',time()-999);
		//////		
			$sql3="SELECT F01,F06 FROM a26 WHERE F04<>'T' ORDER BY F01";    //系統參數
			$sql4=@mysqli_query($link,$sql3); 
		 	while ($list3=mysqli_fetch_array($sql4)){					 
				   setcookie($list3['F01'],$list3['F06']);			   	   	              	            
			}    
			
			$server_hostname=gethostname();
			$server_hostname.=".";
			$server_ip=gethostbyname($server_hostname);	
			setcookie('svripmd5',md5($server_ip));					  			
			$home_url = 'ZRO.html?username='.$row[3];         //此處改為主畫面
			header('Location: '.$home_url);  			 			   
		}else{//若查到的記錄不對，則設定錯誤資訊		  
			setcookie('userid', '', time()-999); 			
			setcookie('useraccount', '', time()-999);			
			setcookie('dptno', '', time()-999);
			
			setcookie('svripmd5', '', time()-999);			
			setcookie('CAPTCHA','',time()-999);
			setcookie('errmsg','A1');
			setcookie('tmpacnt',$_POST['account']);
			setcookie('tmppswd',$_POST['password']);
			header('refresh:0; url=ZRO.html');		              			
			exit;			   
		}		
	}else{
		 setcookie('CAPTCHA','',time()-999);	
		 setcookie('errmsg','A2');
		 setcookie('tmpacnt',$_POST['account']);
		 setcookie('tmppswd',$_POST['password']);		
		 header('refresh:0; url=ZRO.html');			 
	   	exit;			
	}	
}
    mysqli_close($link);	
?>