<?php 
header('Content-type:text/html; charset=utf-8');
 include("include/BKND/mysqli_server.php");    
// 登出後的操作

// 清除Cookie  
	setcookie('userid', '', time()-999);
	setcookie('useraccount', '', time()-999);

//	setcookie('dptno', '', time()-999);			  
   setCookie("CAPTCHA", '', time()-999);	         
	setcookie('svripmd5', '', time()-999);
	setcookie('stdmnu','',time()-999);	  	  
	$sql3="SELECT F01,F06 FROM a26 ORDER BY F01"; 	   	           
    $sql4=@mysqli_query($link,$sql3); 			  
	while ($list3=mysqli_fetch_array($sql4)){		  //清除系統參數			 
        setcookie($list3['F01'],'', time()-999);			   	   	              	            
	}   
	mysqli_close($link);	 		
    $home_url = 'index.html';
    header('Location:'.$home_url); 
 ?>