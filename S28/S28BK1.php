<?php
   header("Content-Type:text/html; charset=utf-8");
   //$path='djn'.date(Y).date(m).date(d).'.json';
    $path='json/S28'.$_POST['filename'].'.json';
    //$path='dojian.json';
    if (file_exists($path)){	
       $lines = file($path);
       $mx=sizeof($lines);	          	   
        if ($mx>0){      
		   $w01S=0;
	       $w02S=0;
	       $w03S=0;
	       $w04S=0;
	       $w05S=0;
	         $w06S=0;
	         $w07S=0;
	         $w08S=0;
	         $w01B=0;
	         $w02B=0;
	         $w03B=0;
	         $w04B=0;
	         $w05B=0;
	         $w06B=0;
	         $w07B=0;
	         $w08B=0;
			 $SBTLE=0;
		     $BBTLE=0;
	         $TPRICE=0;
          $arr=array();		   
          foreach ($lines as $line_num => $line) {
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
             $w01s=0;
	         $w02s=0;
	         $w03s=0;
	         $w04s=0;
	         $w05s=0;
	         $w06s=0;
	         $w07s=0;
	         $w08s=0;	  
	         $w01b=0;
	         $w02b=0;
	         $w03b=0;
	         $w04b=0;
	         $w05b=0;
	         $w06b=0;
	         $w07b=0;
	         $w08b=0;
			 $sbtle=0;
		     $bbtle=0;
	         $tprice=0;
             $name='';			 
			 $dlvtime='';             		 
			 foreach($cart as $key=>$val){	  
			      
	             if (is_array($val)){	   				             		               
		               $lngth=count($cart->訂單內容);
		               for($i=0;$i<$lngth;$i++){		        	      		                   
 		 	    	          switch ($cart->訂單內容[$i]->品號){
								  case 'W01':								         
								        $w01s=$cart->訂單內容[$i]->小瓶數量;
										$w01b=$cart->訂單內容[$i]->大瓶數量;	
										$w01S+=$cart->訂單內容[$i]->小瓶數量;
										$w01B+=$cart->訂單內容[$i]->大瓶數量; 
										break;
								  case 'W02':
								        $w02s=$cart->訂單內容[$i]->小瓶數量;
										$w02b=$cart->訂單內容[$i]->大瓶數量;
										$w02S+=$cart->訂單內容[$i]->小瓶數量;
										$w02B+=$cart->訂單內容[$i]->大瓶數量;
										break;
								  case 'W03':
								  	    $w03s=$cart->訂單內容[$i]->小瓶數量;
										$w03b=$cart->訂單內容[$i]->大瓶數量;
										$w03S+=$cart->訂單內容[$i]->小瓶數量;
										$w03B+=$cart->訂單內容[$i]->大瓶數量;
								        break;
								  case 'W04':
								        $w04s=$cart->訂單內容[$i]->小瓶數量;
										$w04b=$cart->訂單內容[$i]->大瓶數量;
										$w04S+=$cart->訂單內容[$i]->小瓶數量;
										$w04B+=$cart->訂單內容[$i]->大瓶數量;
										break;
								  case 'W05':
								        $w05s=$cart->訂單內容[$i]->小瓶數量;
										$w05b=$cart->訂單內容[$i]->大瓶數量;
										$w05S+=$cart->訂單內容[$i]->小瓶數量;
										$w05B+=$cart->訂單內容[$i]->大瓶數量;
										break;
								  case 'W06':
								        $w06s=$cart->訂單內容[$i]->小瓶數量;
										$w06b=$cart->訂單內容[$i]->大瓶數量;
										$w06S+=$cart->訂單內容[$i]->小瓶數量;
										$w06B+=$cart->訂單內容[$i]->大瓶數量;
										break;
								  case 'W07':
								        $w07s=$cart->訂單內容[$i]->小瓶數量;
										$w07b=$cart->訂單內容[$i]->大瓶數量;
										$w07S+=$cart->訂單內容[$i]->小瓶數量;
										$w07B+=$cart->訂單內容[$i]->大瓶數量;
										break;
								  case 'W08':
								        $w08s=$cart->訂單內容[$i]->小瓶數量;
										$w08b+=$cart->訂單內容[$i]->大瓶數量;
										$w08S+=$cart->訂單內容[$i]->小瓶數量;
										$w08B+=$cart->訂單內容[$i]->大瓶數量;
										break;
								  
							  }                             			            
	                    }
                     	 
                } else{				 
				        if ($key=='訂單號碼'){
							$pono=$val;
						}
				        if ($key=='姓名'){
							$name=$val;
						}
						if ($key=='稱謂'){
							$title=$val;
						}
						if ($key=='聯絡電話'){
							$phone=$val;
						}
						if ($key=='備註事項'){
							$dept=$val;
						}
						if ($key=='電郵帳號'){
							$email=$val;
						}
						if ($key=='送貨地址'){
							$address=$val;
						}
				        if ($key=='小瓶總數'){
							$sbtle=$val;	
                            $SBTLE+=$val;							
					    }
					    if ($key=='大瓶總數'){
							$bbtle=$val;
                            $BBTLE+=$val;							
					    }
				        if ($key=='金額總計'){
							$tprice=$val;
							$TPRICE+=$val;
					    }	
                        if ($key=='收貨時間'){
							$dlvtime=$val;
						}						
				}                	           
            }
			$atr = array( 
			       'pono' => $pono,			       
				   'title'=> $title,
				   'phone'=> $phone,
				   'dept' => $dept,
				   'email'=> $email,
				   'address'=>$address,
				   'name' => $name,
                   'w01s' => $w01s, 
                   'w01b' => $w01b, 
                   'w02s' => $w02s, 
                   'w02b' => $w02b,  
		           'w03s' => $w03s, 
                   'w03b' => $w03b,  
		           'w04s' => $w04s, 
                   'w04b' => $w04b,  
		           'w05s' => $w05s, 
                   'w05b' => $w05b,  
		           'w06s' => $w06s, 
                   'w06b' => $w06b,  
		           'w07s' => $w07s, 
                   'w07b' => $w07b,  
		           'w08s' => $w08s, 
                   'w08b' => $w08b,  
                   'sbtle'=> $sbtle,
		           'bbtle'=> $bbtle,
	               'tprice'=>$tprice,
				   'dlvtime'=>$dlvtime);                     			   
                   array_push($arr,$atr);	                 		   
		  } 		  		  
		 //最後使用usort來做排序
        // usort(要排序的陣列,使用的函數)
         usort($arr, 'score_sort');  //依送貨日期再排序一次        
         $arr = array_values($arr);
         $json_string1 = json_encode($arr); 		          
		 $aur = array( 			        
                   'w01S' => $w01S, 
                   'w01B' => $w01B, 
                   'w02S' => $w02S, 
                   'w02B' => $w02B,  
		           'w03S' => $w03S, 
                   'w03b' => $w03B,  
		           'w04S' => $w04S, 
                   'w04B' => $w04B,  
		           'w05S' => $w05S, 
                   'w05B' => $w05B,  
		           'w06S' => $w06S, 
                   'w06B' => $w06B,  
		           'w07S' => $w07S, 
                   'w07B' => $w07B,  
		           'w08S' => $w08S, 
                   'w08B' => $w08B,  
                   'SBTLE'=> $SBTLE,
		           'BBTLE'=> $BBTLE,
	               'TPRICE'=>$TPRICE);
		    $json_string2 = json_encode($aur); 
            echo "getProfile($json_string1,$json_string2)";        
		 }  
      } 
		   
//接著建立一個排序的函數

        function score_sort($a, $b){


                if($a['dlvtime'] == $b['dlvtime']) return 0;

                return ($a['dlvtime'] > $b['dlvtime'])? 1 : -1;
				 

        }

        
?>  
 