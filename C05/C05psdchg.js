function selfTag(jsvsn){	 
	
	 var contentdiv=getElementsByAttribute('class','tab_content');	
	  var svrSpns1=document.getElementById('serverResponse1');    	 
	    var text5 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	    var invDetailButton=document.createElement("input");		   
		invDetailButton.setAttribute("type","button");
		invDetailButton.setAttribute("class","btn");
		invDetailButton.setAttribute("value","\u{1F6D2}");     //u{1F3E1}
	    invDetailButton.setAttribute("style","font-size:130%;margin:0px");
		invDetailButton.setAttribute("title","開單未過帳明細，快速鍵 Alt+B");	
		invDetailButton.setAttribute('accesskey','B')
		invDetailButton.id="REDYSHIP_BOTT";		
		contentdiv[0].insertBefore(text5,svrSpns1);
	    contentdiv[0].insertBefore(invDetailButton,svrSpns1);	
		loadScript(`C05/C05.js?v=${jsvsn}`,function(){DrawTable();});	
	    loadScript(`C05/C05rgst.js?v=${jsvsn}`);	
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
