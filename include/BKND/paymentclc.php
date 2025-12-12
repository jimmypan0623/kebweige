 <?php 
    function lastpayday($crntmth,$crtday,$settleday,$howpay,$howlong){
	$ship_day=($crtday<=$settleday?$crntmth:mnthPlus($crntmth))."-".$crtday;
    $payday=date('Y'.'-'.'m'.'-'.'d');
  	switch ($howpay) {
    case '0':

		$payday = date('Y-m-d', strtotime($ship_day. " + ".  $howlong ."  days "));
        break; 
   case '1':
	    $last_day_of_month = date('Y-m-t', strtotime($ship_day));
        $payday = date('Y-m-d', strtotime($last_day_of_month ."  + ". $howlong ."  days"));
        break; 
    case '2':
        $next_month_last_day = date('Y-m-t', strtotime($ship_day . '+1 month'));
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
 ?> 