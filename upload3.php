 <html><head>
 <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 <title>檔案上傳處理</title></head>
 <body><?php
 $uploaddir='./upload/';
 $tmpfile=$_FILES["userfile"]["tmp_name"];
 $file2=mb_convert_encoding($_FILES["userfile"]["name"],"big5","utf-8");
 if(move_uploaded_file($tmpfile,$uploaddir.$file2)){
   echo "上傳成功<br>";
   echo "檔案名稱：".$_FILES["userfile"]["name"]."<br>";
   echo "檔案類型：".$_FILES["userfile"]["type"]."<br>";
   echo "檔案大小：".$_FILES["userfile"]["size"]."<br>";
   }
 else{
   echo "上傳失敗!<br> ";
   switch ($_FILES["userfile"]["error"]){
   case 1:
     echo "失敗原因：大小超過php.ini內設定 upload_max_filesize"."<br>";
     break;
   case 2:
     echo "失敗原因：大小超過表單設定 MAX_FILE_SIZE"."<br>";
     break;
  case 3:
    echo "失敗原因：上傳不完整"."<br>";
    break;
  case 4:
    echo "失敗原因：沒有檔案上傳"."<br>";
    break;
  case 6:
    echo "失敗原因：暫存資料夾不存在"."<br>";
    break;
  case 7:
    echo "失敗原因：上傳檔案無法寫入"."<br>";
    break;
  case 8:
    echo "失敗原因：上傳停止"."<br>";
    break;	  }     
 } ?></body></html>