function selfTag(jsvsn){
	var ath1=getCookies.get('auth01');  //getCookie新增
	var ath2=getCookies.get('auth02');  //getCookie修改
	var ath3=getCookies.get('auth03');  //getCookie刪除
	var notOnlyEdit=(ath1=='Y' && ath2=='Y' && ath3=='Y');
	var tables=getElementsByAttribute("class","gridlist");
	var ths=tables[0].getElementsByTagName("th");			 				
	if(!notOnlyEdit){
        ths[ths.length-3].parentNode.removeChild(ths[ths.length-3]);
	}
	loadScript(`A26/JS/A26.js?v=${jsvsn}`,function(){DrawTable();});		 
	loadScript(`A26/JS/A26rgst.js?v=${jsvsn}`);
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