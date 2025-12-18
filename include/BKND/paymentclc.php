 <?php 
    function lastpayday($crntmth,$crtday,$settleday,$howpay,$howlong,$newpromise){
	     
		if(strpos($newpromise, "現結") !== false){
		    $how_pay='0';
		}else if(strpos($newpromise, "次月結") !== false){
		    $how_pay='2';	
		}else if(strpos($newpromise, "月結") !== false){
		    $how_pay='1';
		
		}else if(strpos($newpromise, "T/T") !== false){
		    $how_pay='3';
		} else{
		  $how_pay=$howpay;	 
	    }
	$ship_day=($crtday<=$settleday?$crntmth:mnthPlus($crntmth))."-".$crtday;
	$newpromiseday=preg_replace('/[^0-9]/', '', $newpromise);
	$howlong=$newpromiseday?(int)$newpromiseday:$howlong;
    $payday=date('Y'.'-'.'m'.'-'.'d');
  	switch ($how_pay) {
    case '0':
		$payday = date('Y-m-d', strtotime($ship_day. " + ".  $howlong ."  days "));
        break; 
   case '1':
	    $last_day_of_month = date('Y-m-t', strtotime($ship_day));
        $payday = date('Y-m-d', strtotime($last_day_of_month ."  + ". $howlong ."  days"));
        break; 
    case '2':
	    $ship_day=mnthPlus($crntmth)."-".$crtday;      
		 $next_month_last_day = date('Y-m-t', strtotime($ship_day));
		$payday = date('Y-m-d', strtotime($next_month_last_day.' + '.$howlong .'days'));        
    case '3':
	    $last_day_of_month = date('Y-m-t', strtotime($ship_day));
        $payday = date('Y-m-d', strtotime($last_day_of_month ."  + ". $howlong ."  days"));
        break;   
    default:
       $payday=date('Y'.'-'.'m'.'-'.'d');
	   
    }  
	return $payday;

}	
function mnthPlus($yearmonth ){    //計算超過結帳日期的結帳月份

    $nextMonth = (int)substr($yearmonth, -2) + 1;

    if ($nextMonth > 12) {
       $Month = '01';
       $nextYear=(int)substr($yearmonth, 0, 4) + 1;
	   $Year=(string)$nextYear;
    }else{
	   $Month=str_pad((string)$nextMonth,2,'0',STR_PAD_LEFT);
	   $Year=substr($yearmonth, 0, 4);
	}
	
	return $Year.'-'.$Month;
}	
/* function wayofpay($paytrem){
	 $payno='';
	 if(strpos($paytrem, "現結")){ 
    
		 $payno='0';
		  
	 }else if(strpos($paytrem, "月結")){
		 $payno='1';
		 
	 }else if(strpos($paytrem, "次月結")){
		 $payno='2';
		 
	 }else if(strpos($paytrem, "T/T")){
		 $payno='3';
	 }
     return $payno;
} */
 ?> 