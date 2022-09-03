<?php
   header("Content-Type:text/html; charset=utf-8");   
   /*header('Access-Control-Allow-Origin:*');
   header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
   header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept');*/
   
    $path=$_POST['filename'].'.json';   	  
       if (file_exists($path)){      	
          $lines = file($path);
          $mx=sizeof($lines);	          	   
          if ($mx>0){ 
		      $brr=array();
		      $arr=array();		 
             foreach ($lines as $line_num => $line){
			     $atr=array();
	            $encoding = mb_detect_encoding($line, array('ASCII','EUC-CN','BIG-5','UTF-8'));
                if ($encoding != false) {
                   $line = iconv($encoding, 'UTF-8', $line);
                }else {
                   $line = mb_convert_encoding($line, 'UTF-8','Unicode');
                }              
			    if (substr($line,0,1)==','){
				    $line=substr_replace($line,'',0,1);
			    }
		        $cart =json_decode($line);		               		 
			    foreach($cart as $key=>$val){	
         		
	                    
						${$key}  = $val;
						 
					    $brr[]=$key;
                }
			    
			    
			    if(count($listno)==0 || in_array($brr[0],$listno)){
				  
				   	$NOW=substr_replace(substr($path,8,6),'-',4,0).'-01';
 
                   $lastday=date('Y-m-t', strtotime($NOW));  //抓取當月最後一天
				   
				   $lngth=count($brr)-(31-substr($lastday,-2));  //計算欄位數
	
	
                     for($j=0;$j<$lngth;$j++){
					   $atr[$brr[$j]]=${$brr[$j]};
				   }		 		 					   

                   array_push($arr,$atr);
				   
				  
                }
                 unset($brr);				
		     }   //line的for 		  	        	   		 
		              
		   }  
        }  
 	//筆數的for
	 //最後使用usort來做排序
        // usort(要排序的陣列,使用的函數) 
	     //usort($arr, 'score_sort');  //料號再排序一次        
         $arr = array_values($arr);
		 
         $json_string1 = json_encode($arr); 		          		  
         echo "getProfile($json_string1)";  	   
//接著建立一個排序的函數
   /*     function score_sort($a, $b){
                if($a['stockno'] == $b['stockno']) return 0;
                   return ($a['stockno'] > $b['stockno'])? 1 : -1;				 
        }    */   
?>  
 
