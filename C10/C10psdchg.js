function selfTag(jsvsn){	 
     loadScript(`C10/C10.js?v=${jsvsn}`,function(){DrawTable();});		
	  loadScript(`C10/C10rgst.js?v=${jsvsn}`);
	  loadScript(`C10/C10rgst.js?v=${jsvsn}`);		
		var tab1Click=document.getElementById("tab1");
		if(tab1Click){
	      attachEventListener(tab1Click,"click",tab1View,false);
		}		
		
	 
}
function tab1View(event){	  
       if (typeof event=="undefined"){
		   event=window.event;
    	}
	
		 var bibau=cko[2](0);   //找出閉包變數現值
	     cko[2](bibau*(-1));    //將表身閉包變數歸零	
		  bibau=cko[6](0);   //找出閉包變數現值
	     cko[6](bibau*(-1));    //將表身閉包變數歸零 
		var crntpge=document.getElementById('recmth').value ;
		
		//if (crntpge*1>=1) {
		  choiceClick(left(crntpge,7));
		//}
	

}