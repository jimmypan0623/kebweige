<?php
if(isset($_FILES['file']['name'])){
   // file name
   //$filename = $_FILES['file']['name'];
   $filename=mb_convert_encoding($_FILES["file"]["name"],"big5","utf-8");
   // Location
   $location = 'upload/'.$filename;

   // file extension
   $file_extension = pathinfo($location, PATHINFO_EXTENSION);
   $file_extension = strtolower($file_extension);

   // Valid extensions
   $valid_ext = array("pdf","doc","docx","jpg","png","jpeg","zip");

   $response = '';
   if(in_array($file_extension,$valid_ext)){
      // Upload file
      if(move_uploaded_file($_FILES['file']['tmp_name'],$location)){
         $response ='';
      }else{
		   //echo "上傳失敗!<br> ";
           switch ($_FILES["file"]["error"]){
           case 1:
              $response="失敗原因：大小超過php.ini內設定 upload_max_filesize"."<br>";
              break;
           case 2:
                $response="失敗原因：大小超過表單設定 MAX_FILE_SIZE"."<br>";
                break;
           case 3:
                $response="失敗原因：上傳不完整"."<br>";
                break;
           case 4:
                $response="失敗原因：沒有檔案上傳"."<br>";
                break;
           case 6:
                $response="失敗原因：暫存資料夾不存在"."<br>";
                break;
           case 7:
                $response="失敗原因：上傳檔案無法寫入"."<br>";
                break;
           case 8:
                $response="失敗原因：上傳停止"."<br>";
                 break;	  
		   default:
                 echo "檔案超過限制記憶體";
		   }  

	  }		  
   }else{
	   $response="非預設可上傳的檔案類型，請上傳pdf,word,jp(e)g,png檔";
   }

   echo $response;
   exit;
}

?>
 

 
 
 