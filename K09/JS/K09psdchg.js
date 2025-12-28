function selfTag(jsvsn){
	  var contentdiv=getElementsByAttribute('class','tab_content');	
	  var svrSpns1=document.getElementById('serverResponse1'); 

	  var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	 contentdiv[0].insertBefore(text01,svrSpns1);		
	var spn1=document.createElement('span');
	spn1.id="ttltitle1";	 
     spn1.innerHTML='本頁逾期:';
	contentdiv[0].insertBefore(spn1,svrSpns1);
	
	var spn3=document.createElement('span');
	spn3.id="ttlmny1";  
	spn3.innerHTML='0';
	 contentdiv[0].insertBefore(spn3,svrSpns1);	
	  var text02 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	 contentdiv[0].insertBefore(text02,svrSpns1);	  
	 
	 var spn4=document.createElement('span');
	spn4.id="ttltitle2";	 
     spn4.innerHTML='本頁未沖:';
	contentdiv[0].insertBefore(spn4,svrSpns1); 
	 var spn5=document.createElement('span');
	spn5.id="ttlmny2";  
	spn5.innerHTML='0';
	 contentdiv[0].insertBefore(spn5,svrSpns1);	 
	var text03 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	 contentdiv[0].insertBefore(text03,svrSpns1);	
	 var spn6=document.createElement('span');
    spn6.id="ttltitle3";	 
     spn6.innerHTML='本頁總額:';
	contentdiv[0].insertBefore(spn6,svrSpns1); 
	 var spn7=document.createElement('span');
	spn7.id="ttlmny3";  
	spn7.innerHTML='0';
	 contentdiv[0].insertBefore(spn7,svrSpns1);	 
        var scriptall=document.getElementsByTagName("script");
	    for(var j=0;j<scriptall.length;j++){
	        if(scriptall[j].id){
	            scriptall[j].parentNode.removeChild(scriptall[j]);		 
		    }
	    }			
		loadScript(`K09/JS/K09.js?v=${jsvsn}`,function(){DrawTable();});	 
	    loadScript(`K09/JS/K09rgst.js?v=${jsvsn}`);
	    var tab1Click=document.getElementById("tab1");
		if(tab1Click){
		  tab1Click.setAttribute("accesskey","1");	
	      attachEventListener(tab1Click,"click",tab1View,false);
		}	
	return true;
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
