<?php 
header('Content-type:text/html; charset=utf-8');
// 登出後的操作
session_start();
// 清除Session
$username = $_SESSION['username'];  //用於後面的提示資訊
$_SESSION = array();
session_destroy();
 
// 清除Cookie  
               setcookie('userid', '', time()-999);
               setcookie('useraccount', '', time()-999);
			   setcookie('pasasword', '', time()-999);
               setcookie('username', '', time()-999);
			    setcookie('dptno', '', time()-999);			  
			   setcookie('auth01', '', time()-999);
			   setcookie('auth02', '', time()-999);
			    setcookie('auth03', '', time()-999);
				 setcookie('auth04', '', time()-999);
				  setcookie('auth05', '', time()-999);
				   setcookie('auth06', '', time()-999);
				    setcookie('auth07', '', time()-999);
					 setcookie('auth08', '', time()-999);
					  setcookie('auth09', '', time()-999);
// 提示資訊
echo "歡迎下次光臨, ".$username.'<br>';
//echo "<a href='blgexlogin.html'>重新登入</a>";
$home_url = 'blgexlogin.html';
header('Location:'.$home_url); 
 ?>