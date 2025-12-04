function selfTag(jsvsn){	
    ////
	var cokath4=getAuth[0]()[4];
	if (cokath4=='Y'){	   
		var maindiv=getElementsByAttribute('class','tab_css');	  	 
		var orpButton5=document.getElementById("lgt");		  //離開按鈕    	 
		var text14 = document.createTextNode('\u{A0}\u{A0}');
		var text15 = document.createTextNode('\u{A0}\u{A0}');
		var orpButton6=document.createElement("input");		   
		orpButton6.setAttribute("type","button");
		orpButton6.setAttribute("class","btn");
		orpButton6.setAttribute("value","\u{1F5A8}");      // \u{1F5B6 	  
		orpButton6.setAttribute("title","列印所選紀錄，快速鍵Alt+P");  
		orpButton6.setAttribute("accesskey","P");					
		orpButton6.id="PRNT_BOTT";					
		//attachEventListener(orpButton6,"click",prntproc,false);  //列印按鈕程序		 
		maindiv[0].insertBefore(text14,orpButton5);		
		maindiv[0].insertBefore(orpButton6,orpButton5);
		maindiv[0].insertBefore(text15,orpButton5);	
		orpButton6.setAttribute("style","visiblity:visible;font-size:130%;margin:0;color:black;");	
	}	
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