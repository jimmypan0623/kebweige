function selfTag(jsvsn,jsPth){
	var ath1=getAuth[0]()[1];  //getCookie新增
	var ath2=getAuth[0]()[2];  //getCookie修改
	var ath3=getAuth[0]()[3];  //getCookie刪除
	var notOnlyEdit=(ath1=='Y' && ath2=='Y' && ath3=='Y');
	var tables=getElementsByAttribute("class","gridlist");
	var ths=tables[0].getElementsByTagName("th");			 				
	if(!notOnlyEdit){
        ths[ths.length-2].parentNode.removeChild(ths[ths.length-2]);
	}
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