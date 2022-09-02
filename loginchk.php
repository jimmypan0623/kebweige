<?php      
   
   header("Content-Type:text/html; charset=utf-8"); 
  //include("include/mysqli_server.php");  
  $dbc = @mysqli_connect('localhost','root','5039','tkdata');
       $user_account = mysqli_real_escape_string($dbc,$_POST['account']);
       $user_password = mysqli_real_escape_string($dbc,$_POST['password']);
        if(!empty($user_account)&&!empty($user_password)){
            //$query = "SELECT a01.F01,a01.F02,a01.F03,a01.F04,a07.F04,a07.F05,a07.F06 FROM a01,a07 Where a01.F01 = '$user_account' AND "."a01.F02 = '$user_password' AND a07.F01=a01.F01 AND a07.F03='Q78'"; 
			$query = "SELECT a01.F00,a01.F01,a01.F02,a01.F03,a01.F04 FROM a01 Where a01.F01 = '$user_account' AND "."a01.F02 = '$user_password' "; 
           //用使用者名稱和密碼進行查詢
           $data = mysqli_query($dbc,$query);
           //若查到的記錄正好為一條，則設定COOKIE，同時進行頁面重定向
           if(mysqli_num_rows($data)==1){
              $row = mysqli_fetch_array($data);				
              //cookie保留7天			                 
			  setcookie('userid',$row[0]);
              setcookie('useraccount',$row[1]);// time()+7*24*60*60);
			  setcookie('password',$row[2]);
			   
			  setcookie('username',urlencode($row[3]));
			   setcookie('dptno',$row[4]);
			  
			/*  $logintime=date(Y)."-".date(m)."-".date(d)." ".date(H).":".date(i).":".date(s); 
			  $mscnt="INSERT INTO a06(F01, F02) VALUES ("; 			   
	          $mscnt.="'".$row[0]."'".",";	    
	          $mscnt.="'".$logintime."'".")";		     
	          $sql=$mscnt;                                               //寫入MySQL 	 
              mysqli_query($dbc ,$sql) or die(mysqli_error($dbc));  */
			  
			  
			  $home_url = 'REDmenu.html';  //此處改為主畫面也就是部落格畫面的網頁
              header('Location: '.$home_url);  			 			   
            }else{//若查到的記錄不對，則設定錯誤資訊
			   //$error_msg = 'Sorry, 帳號或密碼錯誤.';
			   //echo "<script type='text/javascript'>blockshow('$error_msg');</script>";   //呼叫customer_dialogs.js裡面的bocksohow函數顯示訊息
             //  echo "<font color='red'>"."帳號或密碼錯誤!"."</font>";
			   //刪除cookie			    
			  
			     //呼叫customer_dialogs.js裡面的bocksohow函數顯示訊息
				 setcookie('userid', '', time()-999); 
			   setcookie('useraccount', '', time()-999);
			   setcookie('pasasword', '', time()-999);
              setcookie('username', '', time()-999);
			    setcookie('dptno', '', time()-999);
			   setcookie('newauth', '', time()-999);			  
			   setcookie('editauth', '', time()-999);
			   setcookie('delauth', '', time()-999);
			   header('refresh:3; url=blgexlogin.html');			   
               echo "使用者名稱或密碼錯誤,系統將在3秒後跳轉到登入介面,請重新填寫登入資訊!";
			   
               exit;			   
            }
		}else{
           echo '帳號密碼不得空白.';    //基本上程序不會跑到此因為登入畫面有設定空白就不能離開畫面

        }
	
 ?>
