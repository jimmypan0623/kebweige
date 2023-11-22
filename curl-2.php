<html>
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>抓取美金匯率</title>
<meta http-equiv="refresh" content="300" />
</head>
<body>
<div style="margin-left:30px">
<?php
//$url ="https://rate.bot.com.tw/Pages/Static/UIP003.zh-TW.htm";
$url="https://rate.bot.com.tw/xrt?Lang=zh-TW";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$content = curl_exec($ch);
curl_close($ch);
preg_match_all('/<td class="rate-content-cash">([^<>]+)<\/td>/',$content,$target);
echo "<p>美金部分"."<br>";?>
<table width="100%" border="1">
  <tr>
    <td><?php echo "即期匯率買入"; ?></td>
    <td><?php echo "即期匯率賣出"; ?></td>
  </tr>
  <tr>
    <?php echo $target[0][2];
	  echo $target[0][3]; 
	?>
  </tr>
</table>
</div>
</body>
</html>       
         
