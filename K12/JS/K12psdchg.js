function selfTag(jsvsn){	
    ////
	var cntdiv=getElementsByAttribute('class','tab_content');	
	var rspn1=document.getElementById('serverResponse1'); 
	 var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	 cntdiv[0].insertBefore(text01,rspn1);		
	var spn1=document.createElement('span');
	spn1.id="ttltitle";	 
     spn1.innerHTML='總金額:';
	cntdiv[0].insertBefore(spn1,rspn1);
	var spn2=document.createElement('span');
	spn2.id="crncy" ;
    cntdiv[0].insertBefore(spn2,rspn1);
	var spn3=document.createElement('span');
	spn3.id="ttlmny";  
	spn3.innerHTML='0';
	 cntdiv[0].insertBefore(spn3,rspn1);	
	
	
	/////
    var scriptall=document.getElementsByTagName("script");
	for(var j=0;j<scriptall.length;j++){
	    if(scriptall[j].id){
	        scriptall[j].parentNode.removeChild(scriptall[j]);		 
		}
	}	
	////	
     loadScript(`K12/JS/K12.js?v=${jsvsn}`,function(){DrawTable();});		
	  loadScript(`K12/JS/K12rgst.js?v=${jsvsn}`);
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