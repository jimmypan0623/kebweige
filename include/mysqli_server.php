 <?php 
    $link = @mysqli_connect('localhost','root','5039','tkdata');
    if ( !$link ) {
     echo "連結錯誤訊息: ".mysqli_connect_error()."<br>";
     exit();
	}   
    mysqli_query($link,'set names utf8');   
 ?> 