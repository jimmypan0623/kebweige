function selfTag(jsvsn,jsPth){	 	
	var contentdiv=getElementsByAttribute('class','tab_content');	
	var svrSpns1=document.getElementById('serverResponse1');    	 
	var text5 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	var invDetailButton=document.createElement("input");		   
	invDetailButton.setAttribute("type","button");
	invDetailButton.setAttribute("class","btn");
	invDetailButton.setAttribute("value","\u{1F6D2}");     //u{1F3E1}
	invDetailButton.setAttribute("style","font-size:130%;margin:0px");
	invDetailButton.setAttribute("title","開單未過帳明細，快速鍵 Alt+G");	
	invDetailButton.setAttribute('accesskey','G')
	invDetailButton.id="REDYSHIP_BOTT";		
	contentdiv[0].insertBefore(text5,svrSpns1);
	contentdiv[0].insertBefore(invDetailButton,svrSpns1);	
	////
	var text6 = document.createTextNode('\u{A0}\u{A0}\u{A0}');
	var invDetailButton=document.createElement("input");		   
	invDetailButton.setAttribute("type","button");
	invDetailButton.setAttribute("class","btn");
	invDetailButton.setAttribute("value","\u{1F3EC}");     //u{1F3E1}
	invDetailButton.setAttribute("style","font-size:130%;margin:0px;");
	invDetailButton.setAttribute("title","各庫別明細，快速鍵 Alt+B");	
	invDetailButton.setAttribute('accesskey','B')
	invDetailButton.id="INVDTL_BOTT";		
	attachEventListener(invDetailButton,"click",page1OtherButton2,false);
	contentdiv[0].insertBefore(text6,svrSpns1);
	contentdiv[0].insertBefore(invDetailButton,svrSpns1);
	////
	var text7 = document.createTextNode('\u{A0}\u{A0}\u{A0}');
	var mrpListButton=document.createElement("input");		   
	mrpListButton.setAttribute("type","button");
	mrpListButton.setAttribute("class","btn");
	mrpListButton.setAttribute("value","\u{1F453}");     //u{1F3E1}
	mrpListButton.setAttribute("style","font-size:130%;margin:0px;");
	mrpListButton.setAttribute("title","預期庫存異動明細，快速鍵 Alt+R");	
	mrpListButton.setAttribute('accesskey','R')
	mrpListButton.id="FUTURE_BOTT";		
	attachEventListener(mrpListButton,"click",page1OtherButton3,false);
	contentdiv[0].insertBefore(text7,svrSpns1);
	contentdiv[0].insertBefore(mrpListButton,svrSpns1);
	///
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
		var maintable=document.getElementById("member1");	  		
		var tablerowindex=0;
		for(var i=1;i< maintable.rows.length; i++){			 
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
