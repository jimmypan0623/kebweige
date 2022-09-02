<html>
<body>
<p>PHP Open and Read text File</p>
<?php
$filearray=array();
   $listno=array();
   $tst=array();
// Record going to be searched in text file
 

   $searchRecord ='XASK';
       // Use fopen function to open a file
       $file = fopen("STOCKTTL.txt", "r");
      // Read the file line by line until the end
       $k=0;
        
       while (!feof($file)) {
           $value = fgets($file);
 
           $k++;
           // A white space will append to all records (except last record)
           // This is due to the carriage return.
           // Never mind! Use rtrim function to remove the white space at the end.

           $value = rtrim($value);

           
            $findme=str_replace(')','\)',str_replace('(','\(',$searchRecord));
            if (preg_match("/$findme/i",$value)){ 
			    array_push($listno,trim(strval($k)));
                $cnt=ceil($k/20);				
				echo $cnt."<br>";
				$fnb=str_pad(strval($cnt),2,'0',STR_PAD_LEFT);
				/*if (strlen(trim(strval($cnt)))<2){
					$fnb='0'.trim(strval($cnt));
				}else{
					$fnb=trim(strval($cnt));
				}*/
				if(end($filearray)!="STOCK".$fnb){
				  array_push($filearray,"STOCK".$fnb);
				}

            } 
       }

    // Close the file that no longer in use

    fclose($file);	   
    $aNum=count($filearray);
	for ($i=0;$i<$aNum;$i++){
		echo $filearray[$i]."<br>";
	}
    echo count($tst);
?>


</body>
</html>