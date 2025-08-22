<?php 
header('Content-type:text/html; charset=utf-8');
 include("include/BKND/mysqli_server.php");    
// 登出後的操作

// 清除Cookie  
	setcookie('userid', '', time()-999);
	setcookie('useraccount', '', time()-999);
	//setcookie('pasasword', '', time()-999);
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
	setcookie('svripmd5', '', time()-999);
	setcookie('funNo', '', time()-999);
	setcookie('howpge','',time()-999);
	setcookie('MorP','',time()-999);
	setcookie('kindofda','',time()-999);
	setcookie('adddpt','',time()-999);
	setcookie('stdmnu','',time()-999);	  	  
	$sql3="select F01,F06 from a26 where F04<>'T' order by F01"; 	   	           
    $sql4=@mysqli_query($link,$sql3); 			  
	while ($list3=mysqli_fetch_array($sql4)){					 
        setcookie($list3['F01'],'', time()-999);			   	   	              	            
	}    
	mysqli_close($link);			
// 提示資訊
//echo "歡迎下次光臨, ".$username.'<br>';
//echo "<a href='blgexlogin.html'>重新登入</a>";
$home_url = 'ZRO.html';
header('Location:'.$home_url); 
 ?>