function selfTag(jsvsn,jsPth){
	var contentdiv=getElementsByAttribute('class','tab_content');	
	var svrSpns1=document.getElementById('serverResponse1'); 
	const frag1 = document.createDocumentFragment();
    var dptspan=document.createElement("span");	  
	var text4 = document.createTextNode('\u{A0}\u{A0}發票類別:\u{A0}');
	dptspan.appendChild(text4);
	dptspan.setAttribute("style","font-size:120%;");
	var slt3=document.createElement("select");
	slt3.setAttribute("id","departNoOption");
	slt3.add(new Option("銷項三聯式","31")); 
	slt3.add(new Option("銷項二聯式","32")); 
	slt3.add(new Option("銷退三聯式","33")); 
	slt3.add(new Option("銷退二聯式","34")); 
	slt3.add(new Option("進項三聯式","21")); 
	slt3.add(new Option("進項二聯式","22")); 
	slt3.add(new Option("進退三聯式","33")); 
	slt3.add(new Option("進退二聯式","24")); 
	attachEventListener(slt3,'change',choiceClick,false); 
	frag1.appendChild(dptspan);
	frag1.appendChild(slt3);
	var text5 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	var invDetailButton=document.createElement("input");		   
	invDetailButton.setAttribute("type","button");
	invDetailButton.setAttribute("class","btn");
	invDetailButton.setAttribute("value","\u{1F575}");      //U+1F5C7  \u{1F575}
	invDetailButton.setAttribute("style","font-size:130%;margin:0px");
	invDetailButton.setAttribute("title","查看此發票之內容，快速鍵 Alt+B");	
	invDetailButton.setAttribute('accesskey','B')
	invDetailButton.id="HISTORY_BOTT";				
	frag1.appendChild(text5);
	frag1.appendChild(invDetailButton);
		  /////	  
	var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	frag1.appendChild(text01);
	var spn1=document.createElement('span');
	spn1.id="ttltitle1";	 
    spn1.innerHTML='銷售總額:';
	frag1.appendChild(spn1);
	var spn3=document.createElement('span');
	spn3.id="ttlmny1";  
	spn3.innerHTML='0';
	frag1.appendChild(spn3);
	var text02 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	frag1.appendChild(text02);
	var spn4=document.createElement('span');
	spn4.id="ttltitle2";	 
    spn4.innerHTML='稅金總額:';
	frag1.appendChild(spn4);
	var spn5=document.createElement('span');
	spn5.id="ttlmny2";  
	spn5.innerHTML='0';
	frag1.appendChild(spn5);
	var text03 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	frag1.appendChild(text03);
	var spn6=document.createElement('span');
    spn6.id="ttltitle3";	 
    spn6.innerHTML='發票總額:';
	frag1.appendChild(spn6);
	var spn7=document.createElement('span');
	spn7.id="ttlmny3";  
	spn7.innerHTML='0';
    frag1.appendChild(spn7);
	contentdiv[0].insertBefore(frag1,svrSpns1);	 
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
    document.querySelectorAll("script[id]").forEach(s=>s.remove());			
	    ///	
	let axtmpl1=jsPth+jsPth.substr(0,3)+'.js?v='+jsvsn;
	let axtmpl2=jsPth+jsPth.substr(0,3)+'rgst.js?v='+jsvsn;
	loadScript(`${axtmpl1}`,function(){DrawTable();});
	loadScript(`${axtmpl2}`);  
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
	    choiceClick(crntpge);
}
