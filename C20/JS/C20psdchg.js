function selfTag(jsvsn){ 
	loadScript(`C20/JS/C20.js?v=${jsvsn}`,function(){DrawTable();});	
	loadScript(`C20/JS/C20rgst.js?v=${jsvsn}`);
	loadScript(`C20/JS/B01srch.js?v=${jsvsn}`);	 
	var tab1Click=document.getElementById("tab1");
	if(tab1Click){
	     attachEventListener(tab1Click,"click",tab1View,false);
	}	
}

function tab1View(event){	  
       if (typeof event=="undefined"){
		   event=window.event;
    	}
		var maintable=document.getElementById("maintbody1");	  		
		var tablerowindex=0;
		for(var i=0;i< maintable.rows.length; i++){			 
		    if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){		 			 				 							
				tablerowindex=i;       //記住是目前table的哪一列			 
				break;
			}
		} 			
		 var bibau=cko[2](0);   //找出閉包變數現值
	     cko[2](bibau*(-1));    //將表身閉包變數歸零	 
		  bibau=cko[6](0);   //找出閉包變數現值
	     cko[6](bibau*(-1));    //將表身閉包變數歸零 
		var crntpge=document.getElementById('recmth') ;
		if (crntpge.value*1>=1) {
		  choiceClick(crntpge.value);
		}
		 
} 