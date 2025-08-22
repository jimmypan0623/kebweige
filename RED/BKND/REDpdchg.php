<html><head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>接收從customer_dialog.js傳來的更改密碼資料</title></head>
<body>
<?php
$str_json = file_get_contents('php://input'); //($_POST doesn't work here)
$response =json_decode($str_json); // decoding received JSON to array
$cart=json_decode($response);
$brr=array();
  foreach($cart as $key=>$val){	
        $brr[]=$val;
  }
	//以下處理MySQL記錄異動
     
	$mscnt="UPDATE a01 SET F02="."'".$brr[0]."'"."WHERE F00="."'".$brr[1]."'";
   include("../../include/BKND/mysqli_server.php");                               //引用檔
    $sql=$mscnt;                                               //寫入MySQL 	member->users
    mysqli_query($link ,$sql) or die(mysqli_error($link)); 
    mysqli_close($link);
?>
</body>
</html>