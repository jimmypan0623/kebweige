<?php
   header("Content-Type:text/html; charset=utf-8");   
   /*header('Access-Control-Allow-Origin:*');
   header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
   header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept');*/
   $filearray=array();
   $listno=array();
   
	    $searchRecord =$_POST['filename'];
       // Use fopen function to open a file
        $file = fopen("json/STOCKSRSTTL.txt", "r");
       // Read the file line by line until the end
       $k=0;      
       while (!feof($file)) {
           $value = fgets($file);
           $k++;
           // A white space will append to all records (except last record)
           // This is due to the carriage return.
           // Never mind! Use rtrim function to remove the white space at the end.
            $value = ",".rtrim($value).",";    //再加豆號以減少多抓取記錄       
            $findme=",".str_replace(')','\)',str_replace('(','\(',$searchRecord));
            //if (preg_match("/$findme/i",$value)){
            if (preg_match("/$value/i",$findme)){				
			    array_push($listno,trim(strval($k)));
                $cnt=ceil($k/50);				
				 
				$fnb=str_pad(strval($cnt),3,'0',STR_PAD_LEFT);
				 
				if(end($filearray)!="STOCKSRS".$fnb){
				   array_push($filearray,"STOCKSRS".$fnb);
				}
            } 
       }
    // Close the file that no longer in use
     fclose($file);	   
   	   
    //$path='stock01.json';
	$aNum=count($filearray);
	$arr=array();	
	for($i=0;$i<$aNum;$i++){ 
	   $path='json/'.$filearray[$i].'.json';
       if (file_exists($path)){      	
          $lines = file($path);
          $mx=sizeof($lines);	          	   
          if ($mx>0){      		            	   
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
	             		if ($key=='ITEM'){
							$item=$val;
						}
				        if ($key=='STOCKNO'){
							$stockno=$val;
						}
				        if ($key=='DSCRPT'){
							$dscrpt=$val;
						}
						 if ($key=='SRSNO'){
							$srsno=$val;
						}
						if ($key=='MPQ'){
							$mpq=$val;
						}
						if ($key=='PQ'){
							$pq=$val;
						}											                	           
                }
			    if(count($listno)==0 || in_array($item,$listno)){
			       $atr = array( 
			       //'item'=>$item,
			       'stockno' => $stockno,			       
				   'dscrpt'=> $dscrpt,
				   'srsno'=> $srsno,
				   'mpq'=> $mpq,
				   'pq' => $pq);				                   			   
                   array_push($arr,$atr);	
                }				   
		     } 		  	        	   		 
		              
		   }  
        }  
	}	
	 //最後使用usort來做排序
        // usort(要排序的陣列,使用的函數) 
	     //usort($arr, 'score_sort');  //料號再排序一次        
         $arr = array_values($arr);
         $json_string1 = json_encode($arr); 		          		  
         echo "srchStockNo($json_string1)";  	   
//接著建立一個排序的函數
        function score_sort($a, $b){
                if($a['stockno'] == $b['stockno']) return 0;
                   return ($a['stockno'] > $b['stockno'])? 1 : -1;				 
        }       
?>  
 