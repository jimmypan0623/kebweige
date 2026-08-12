function selfTag(jsvsn,jsPth){	
//////////////
    var cntdiv=getElementsByAttribute('class','tab_content');		
    var rspn1=document.getElementById('serverResponse1'); 
	 var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
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

	var firstCover=getElementsByAttribute('class','table_cover');	
	firstCover[0].style.width="16%";

    var secondCover=document.createElement('div');
	secondCover.setAttribute("class","table_cover");
	secondCover.style.width="84%";
    righttbl1=document.createElement("table");
	righttbl1.id="rightContent1";	
	righttbl1.className="gridlist";
	righttbl1.setAttribute("style","width:120%;");
	 var thr2=document.createElement("thead"); 
	 var array3 = ['出貨日期','發票號碼','料號','出貨單號','數量','單價','幣別','匯率','小計','客戶PO','客戶品號'];
	 var array4 = ['8%','9%','12%','9%','7%','7%','4%','7%','8%','9%','11%'];
	for (var i = 0; i < array3.length; i++) {
		var th2 = document.createElement('th'); //column	
		
		var text2 = document.createTextNode(array3[i]); //cell	
      
		th2.style.backgroundColor="#D6D6AD";	
		th2.style.color="#000000";	
		
		th2.style.width=array4[i];
		th2.appendChild(text2);
		
		thr2.appendChild(th2);		
	}	
	var tbdy2=document.createElement("tbody"); 
	tbdy2.id="contentTbody";
	righttbl1.appendChild(thr2);
	righttbl1.appendChild(tbdy2);    
	secondCover.appendChild(righttbl1); 	 
	cntdiv[0].appendChild(secondCover); 		
    ///////
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
	////	
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
		 choiceClick(left(crntpge,7));
}