function selfTag(jsvsn){	
    ////
    var scriptall=document.getElementsByTagName("script");
	for(var j=0;j<scriptall.length;j++){
	    if(scriptall[j].id){
	        scriptall[j].parentNode.removeChild(scriptall[j]);		 
		}
	}	
	////	
     loadScript(`D19/JS/D19.js?v=${jsvsn}`,function(){DrawTable();});		 
	  loadScript(`D19/JS/D19rgst.js?v=${jsvsn}`);		
		var tab1Click=document.getElementById("tab1");
		if(tab1Click){
		  tab1Click.setAttribute("accesskey","1");	
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
		 choiceClick(left(crntpge,7));
}