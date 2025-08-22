function selfTag(jsvsn){
	  var contentdiv=getElementsByAttribute('class','tab_content');	
	  var svrSpns1=document.getElementById('serverResponse1'); 
      var dptspan=document.createElement("span");	  
	  var text4 = document.createTextNode('\u{A0}\u{A0}存放部門:\u{A0}');
	  dptspan.appendChild(text4);
	  dptspan.setAttribute("style","font-size:120%;");
	  var slt3=document.createElement("select");
	    slt3.setAttribute("id","departNoOption");
  	    optionitem(Cookies.get("INT_193"),slt3.id,6,"B01/BKND/A14srch.php");	
		attachEventListener(slt3,'change',choiceClick,false); 
      	contentdiv[0].insertBefore(dptspan,svrSpns1);
		contentdiv[0].insertBefore(slt3,svrSpns1);
	    var text5 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	    var invDetailButton=document.createElement("input");		   
		invDetailButton.setAttribute("type","button");
		invDetailButton.setAttribute("class","btn");
		invDetailButton.setAttribute("value","\u{1F575}");      //U+1F5C7  \u{1F575}
	    invDetailButton.setAttribute("style","font-size:130%;margin:0px");
		invDetailButton.setAttribute("title","查看此料號庫存異動紀錄，快速鍵 Alt+B");	
		invDetailButton.setAttribute('accesskey','B')
		invDetailButton.id="HISTORY_BOTT";				
		contentdiv[0].insertBefore(text5,svrSpns1);
	    contentdiv[0].insertBefore(invDetailButton,svrSpns1);		 
		loadScript(`B25/JS/B25.js?v=${jsvsn}`,function(){DrawTable();});	 
	    loadScript(`B25/JS/B25rgst.js?v=${jsvsn}`);
	    var tab1Click=document.getElementById("tab1");
		if(tab1Click){
	      attachEventListener(tab1Click,"click",tab1View,false);
		}	
	return true;
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
