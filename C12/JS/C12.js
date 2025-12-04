function getProfile(str1,reccount) {      
    var cnt=0;
	var rnddgt=getCookie('INT_069');  //四捨五入到幾位
	var arr = str1; 
 
	 
    var tabs=getElementsByAttribute("class","tab");
	var pagecount=Math.ceil(reccount/parseInt(getAuth[2]()[0].INT_RCD));
	var optdigts= (pagecount.toString()).length;	    
	var slt2=document.getElementById('recmth');
	if (slt2.options.length<pagecount){
		for (var i=slt2.options.length+1;i<=pagecount;i++){
			var item_no=paddingLeft(i,optdigts);				
			var varItem=new Option(item_no,item_no);
			slt2.options.add(varItem);	 
	   }
	  
			   //第一個選項位數修正		   
	   slt2.options[0].value=paddingLeft(1,optdigts);
	   slt2.options[0].text=paddingLeft(1,optdigts);
		var bibau=cko[0](0);   //找出閉包筆數變數現值
		cko[0](bibau*(-1));    //將閉包變數歸零
		cko[0](reccount);      //將筆數記起來	
	  
	}
	var oMember = document.getElementById("member1");	 
	 
	 
	oMember.setAttribute("style","width:120%;");
	
	var oTable = document.getElementById("maintbody1");
	 
	for(var i=0;i<arr.length;i++){		
		var oTr=oTable.insertRow(-1);	
		oTr.setAttribute("name","mainrow");	      		
		cnt++;		
		for(var jk in arr[i]){		   
			var oTd = oTr.insertCell(oTr.cells.length);		     		  
			oTd.innerHTML=arr[i][jk];		 	
			var ara=jk.substr(jk.lastIndexOf('_')-3,3);		
			var ks=ara.split('');		
			//ks[0]:直接或間接 D/I
			//ks[1]:是否顯示   S/H
			//ks[2]:靠左中或右 L/C/R	
			if(ks[0]=="D"){
				oTd.setAttribute("class","directdata");	
			}else{
				oTd.setAttribute("class","indirectdata");	
			}				 
			if(ks[1]=='H'){
				oTd.setAttribute("style","display:none;");		
			}else{
			   oTd.style.textAlign=(ks[2]=="L"?"left":(ks[2]=="C"?"center":"right"));
			   var wdthln=jk.substr(jk.lastIndexOf('_')+1,3);  	  	
			   oTd.style.width=wdthln+"%";
			   attachEventListener(oTd,'click',rowchoose,false);		//點選資料
			}		
			 
	    }
	  
	   var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	   oTd.setAttribute("style","width:40px;display:none");   //勾選不顯示
	   var myCheck=document.createElement('input'); 
	   myCheck.type="checkbox";		  
	   myCheck.setAttribute("name","chkbxmember1");   //讓使用者勾選的checkbox表頭			
	   attachEventListener(myCheck,'click',chooserc,false);		   
	   oTd.appendChild(myCheck);     
	   		  
	}	
	  var responseDiv=document.getElementById("serverResponse1");  		

	  if(cnt>0){       //初始畫面呼叫
	       if(responseDiv.innerHTML=='Searching......'){
			    responseDiv.setAttribute("style","color:#536a60;"); 
                responseDiv.innerHTML="搜尋到 "+String(cnt)+" 筆資料。" +String(cnt)+" record"+(cnt>1?"s":"")+" match your search. " +String(cnt)+" レコードを検索。";            	
		   }else{
			    var seekrcd=document.getElementById("SEEK_BOTT");
		        seekrcd.setAttribute("style","visibility:visible;");
		        attachEventListener(seekrcd,"click",seekrec,false);
		   }
		  chooserc(1);		
		 
	  }else{
		    if(responseDiv.innerHTML=='Searching......'){	
			    responseDiv.setAttribute("style","color:red;"); 
	   	        responseDiv.innerHTML="無此資料！Not found!検索できません。";
		    }else{
				responseDiv.innerHTML="本月無應收帳款。";
				var seekrcd=document.getElementById("SEEK_BOTT");
		         seekrcd.setAttribute("style","visibility:hidden;");
		         detachEventListener(seekrcd,"click",seekrec,false);
		    }
		    var oTable = document.getElementById("contentTbody");	
	        if (oTable.rows.length>0){
		       var i=0;
	            while (i<oTable.rows.length){
		    
		          oTable.deleteRow(i);		    	    
		          i--;		    
		           i++; 	     
	            }	 		    
	        } 
	        document.getElementById('ttlmny').innerHTML="";   //次頁表頭的總金額物件
			document.getElementById("ttltitle").innerHTML="";			
	  }		  	  
}

function choseExtraDeal(targetTrChildren){   //紀錄移動    	
	var sendSrcRec="keyfield="+targetTrChildren[0].innerHTML+"|"+document.getElementById('recmth').value;		
	contenBkndAjax(sendSrcRec);     	
	 
}
function rowchoseExtraDeal(targetRow){    //紀錄移動     	
	 var sendSrcRec="keyfield="+targetRow.firstChild.innerHTML+"|"+document.getElementById('recmth').value;		
	 contenBkndAjax(sendSrcRec);
     
}	 

function contenBkndAjax(sendSrcRec){
	var rsp="";  	
	if(window.ActiveXObject){
	   var request = new ActiveXObject("Microsoft.XMLHttp");
	}	
	   else if(window.XMLHttpRequest){
		  var request = new XMLHttpRequest();
	}			 
	request.onreadystatechange = respond;	       
	var url="C12/BKND/C12Contentbrow.php?timestamp="+new Date().getTime();			
	request.open("POST",url);	 
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	request.send(sendSrcRec);		
	function respond(){           
		if (request.readyState == 4 && request.status == 200) {    
		   rsp=JSON.parse(request.responseText);					 
		   contentShow(rsp.recdrow);
		}
	}	 	 
    return;			   	
}

function contentShow(arr){
	var oTable = document.getElementById("contentTbody");	
	if (oTable.rows.length>0){
		    var i=0;
	        while (i<oTable.rows.length){
		    
		       oTable.deleteRow(i);		    	    
		       i--;		    
		     i++; 	     
	        }	 		    
	} 
	var cnt1=0;
	var rnddgt=getCookie('INT_069');  //四捨五入到幾位
	var queryttl=0;
	var scndttl=document.getElementById('ttlmny');   //次頁表頭的總金額物件
	for(var i=0;i<arr.length;i++){		
		var oTr=oTable.insertRow(-1);	
		//oTr.setAttribute("name","mainrow");	      		
		cnt1++;		
		for(var jk in arr[i]){		   
			var oTd = oTr.insertCell(oTr.cells.length);		     		  
			oTd.innerHTML=arr[i][jk];		 			
			if(oTd.innerHTML=="稅額"){
			   oTd.parentNode.style.color="#5B5B5B";
			}
			var ara=jk.substr(jk.lastIndexOf('_')-3,3);		
			var ks=ara.split('');		
			//ks[0]:直接或間接 D/I
			//ks[1]:是否顯示   S/H
			//ks[2]:靠左中或右 L/C/R	
			if(ks[0]=="D"){
				oTd.setAttribute("class","directdata");	
			}else{
				oTd.setAttribute("class","indirectdata");	
			}				 
			if(ks[1]=='H'){
				oTd.setAttribute("style","display:none;");		
			}else{
			   oTd.style.textAlign=(ks[2]=="L"?"left":(ks[2]=="C"?"center":"right"));
			   var wdthln=jk.substr(jk.lastIndexOf('_')+1,3);  	  	
			   oTd.style.width=wdthln+"%";
		
			}		
			if(jk.substr(0,jk.lastIndexOf('_')-4)=='rcd_total'){
			   queryttl+=Number(oTd.innerHTML);
			} 
	    } 
   }
    if(cnt1>0){       //初始畫面呼叫
		  document.getElementById("ttltitle").innerHTML="<mark>"+sourceAccount('0',0)+"&nbsp"+sourceAccount(2,0)+"</mark>\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}本月應收總額:";
		  scndttl.innerHTML=thousands(Math.round((queryttl + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt));
	}else{		
	   if(scndttl.innerHTML=='0'){
          tab1View();
	   }		  
	}		
    return;
}