function PrgSrch(event)
{
    if (typeof event=="undefined")
	{
		event=window.event;
	}
	var target=getEventTarget(event);
    var dropext=document.getElementById('myModal6');  //由於與帳號登入錯誤訊息視窗共用一個DOM元素所建立的訊息畫面故先檢查該組元素是否還隱藏在畫面內有的話移除再重建
	if (dropext){	//如果有殘留訊息畫面的DOM則移除
	    dropext.parentNode.removeChild(dropext);
    }		
	var dropsheet=document.createElement('div');   
	dropsheet.setAttribute("id","myModal6");
	dropsheet.setAttribute("class","modal");
	dropsheet.style.display="block";	   
    dropsheet.style.position="fixed";   		
    dropsheet.style.left="0";
    dropsheet.style.top="0";
    dropsheet.style.width="100%"; 
    dropsheet.style.height="100%";  
	dropsheet.style.zIndex="1";
	dropsheet.style.paddingTop="100px"; 
	dropsheet.style.overflow="auto";     
    dropsheet.style.backgroundColor = "rgba(0,0,0,0.4)"; 
	var body=document.getElementsByTagName("body")[0];
	body.appendChild(dropsheet);            
    var dropsheet_content=document.createElement('div');
	dropsheet_content.setAttribute("id","modal-content6");
	dropsheet_content.style.backgroundColor="#fefefe";		
	dropsheet_content.style.margin="auto";
	dropsheet_content.style.padding="20px";
	dropsheet_content.style.width="50%";	
	dropsheet_content.style.border="1px solid #888";
	dropsheet_content.style.fontSize="22px";	  	
    dropsheet_content.style.boxShadow = "5px 5px 5px 5px #003153";  	
	dropsheet.appendChild(dropsheet_content);  
      
				 var headtitle="請選取欲授權程式";
			     dropsheet.style.paddingTop="20px"; 
		         var dialog=document.createElement("div");		 
		         dialog.className="customDialog"; 		 
		         dialog.style.position="relative";
                 var rspnsv=document.createElement("span");
				 rspnsv.id="serverResponse3";
		         var dialogButton1=document.createElement("input");		   
		        dialogButton1.setAttribute("type","button");
		        dialogButton1.setAttribute("class","btn");
		        dialogButton1.setAttribute("value","\u{2713}");					 
				dialogButton1.setAttribute("style","position:relative;left:140px;color:green;font-size:17px;");
				
				attachEventListener(dialogButton1,"click",chseprg,false);	
				 var dialogButton3=document.createElement("input");
		         dialogButton3.setAttribute("type","button");
		         dialogButton3.setAttribute("class","btn");
		         dialogButton3.setAttribute("value","\u{2715}"); 
				 dialogButton3.setAttribute("style","position:relative;left:150px;color:red;font-size:17px;");
				 
		         attachEventListener(dialogButton3,"click",srchblkclose,false);		  	      		  		  
				 var tblname=document.createElement("caption");
				 tblname.innerHTML=headtitle;	
				
				 var prgTable=document.createElement("table");				  
		         prgTable.id="prgTable";						
				 prgTable.className="gridlist";                
				 var srchHead=document.createElement("thead");		
				  srchHead.setAttribute("style","display:table;width:100%;table-layout:fixed;");				  
                  srchHead.style.width="calc( 100% - 1em )";
				  prgTable.appendChild(tblname);
				 prgTable.appendChild(srchHead);				 				
                var oTr = document.createElement('tr');				 
                var array = ['程式編號', '程式名稱'];
                for (var j = 0; j < array.length; j++) {
                    var th = document.createElement('th'); 
					th.style.width=(120-Math.pow(-2,j)*20)+'px';
                    var text = document.createTextNode(array[j]); //cell
					
                    th.appendChild(text);
                    oTr.appendChild(th);
                }				
                srchHead.appendChild(oTr);	
				 var prgTbody=document.createElement("tbody");			
				 prgTbody.id='prgTbody';
			     prgTbody.style.display="block";
		         prgTbody.style.height="310px";
				 prgTbody.style.width="100%"; 
		         prgTbody.style.overflow="auto";		
				 prgTable.appendChild(prgTbody);  						 
				 var formJason=document.createElement('form');		   
		         formJason.id="formdata2";	          								 
			    formJason.appendChild(prgTable);
				 formJason.appendChild(dialogButton1);
				 formJason.appendChild(dialogButton3);
				 formJason.appendChild(rspnsv);
		         dialog.appendChild(formJason)  				 
	             dropsheet_content.style.width="38%";	 	 
		         dropsheet_content.appendChild(dialog);		
				 if(window.ActiveXObject){
		            var request = new ActiveXObject("Microsoft.XMLHttp");
	             }else if(window.XMLHttpRequest){
	   	              var request = new XMLHttpRequest();
				 }
	             request.onreadystatechange = respond;   
	             var url="A02/BKND/A02srch.php?timestamp="+new Date().getTime();   	               				 
	             request.open("POST",url);	 
	             request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");		
                 var secondkey=	document.getElementById('prg_no').value;
			     if(secondkey.trim().length>0){
				    var queryString ="filename="+"'"+document.getElementById('fatherkey').innerHTML+"') AND `F01` REGEXP '"+document.getElementById('prg_no').value+"'";
	             }else{
					var queryString ="filename="+"'"+document.getElementById('fatherkey').innerHTML+"')";
				 }
				 request.send(queryString);
	             function respond(){
                    if (request.readyState == 4 && request.status == 200) {	       	     
		        
                         rsp=JSON.parse(request.responseText);						   
                         srchPrgNo(rsp);
				   
                       
	                }	  
                 }

    return true;
}
function chseprg(event)  
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
   var maintable2=document.getElementById("aplyform2");
	var maintable=document.getElementById("prgTbody");
	  
	  
		for(var i=0;i< maintable.rows.length; i++){
			 
		      if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			     document.getElementById('prg_no').value=maintable.rows[i].cells[0].innerHTML;
				 document.getElementById('prg_name').innerHTML=maintable.rows[i].cells[1].innerHTML;
				 
			 
				 var checkboxes = document.getElementsByName("typeOfChange");
				 var labelforchks = document.getElementsByName("lblchk");
				 for (var j=2;j<6;j++){
					 checkboxes[j-2].style.visibility=((maintable.rows[i].cells[j].textContent=="")?"hidden":"visible");
					 labelforchks[j-2].style.visibility=((maintable.rows[i].cells[j].textContent=="")?"hidden":"visible");
				 }
				 var auttt = document.getElementsByName("auth_attch");
				 var spanforchk = document.getElementsByName("authatt");
				
				 for (var k=6;k<11;k++){
					auttt[k-6].style.visibility=((maintable.rows[i].cells[k].textContent=="")?"hidden":"visible");
					
					spanforchk[k-6].innerHTML=maintable.rows[i].cells[k].textContent;
					maintable2.rows[k-3].style.display=((maintable.rows[i].cells[k].textContent=="")?"none":"block");
				 }
				 break;
			  }
				 
		} 
       
     
	srchblkclose(event);
	return true;
}	
function srchblkclose(event)  
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
	var dropsheet=document.getElementById("myModal6");
	dropsheet.style.display="none";       
	if (dropsheet!=null){		
        dropsheet.parentNode.removeChild(dropsheet);   
	}   
	   var bibau=cko[1](0);   
	   cko[1](bibau*(-1));    
	return true;
}	


function srchPrgNo(str1) {       
 
	 var cnt=0;
	var arr = str1; 
   var oTable = document.getElementById("prgTbody");		
  
	for(var i=0;i<arr.length;i++){		
		 
		var oTr=oTable.insertRow(-1);	
	     
		cnt++;
         
		for(var jk in arr[i]){		   
		 var oTd = oTr.insertCell(oTr.cells.length);
		  attachEventListener(oTd,'click',rowchoose,false);		
		  if (!isNaN(parseInt(arr[i][jk]*1))){
			  oTd.innerHTML=parseInt(arr[i][jk]*1)>0?arr[i][jk]:"";
		  } else{
			  oTd.innerHTML=arr[i][jk];
		  }
		 
		  if(jk=='prg_no'){
			     oTd.setAttribute("style","text-align:left;width:100px;");
		  }else if(jk=='prg_name'){
			 
		        oTd.setAttribute("style","text-align:left;width:160px;");
		  }else{
		         oTd.setAttribute("style","display:none;");   
		  }		  		   
		}  		
		 
		 var oTd = oTr.insertCell(oTr.cells.length);		
	      oTd.setAttribute("style","width:40px;display:none");   
	 	   var myCheck=document.createElement('input'); 
		   myCheck.type="checkbox";
		    var tables=getElementsByAttribute("class","gridlist");
		   
		     var rcrdchsn="chkbxprgTable"; 
		     myCheck.setAttribute("name",rcrdchsn);   
		    	  
		   attachEventListener(myCheck,'click',chooserc,false);		   
		   oTd.appendChild(myCheck);   
	}
	
	if (cnt>0){
		cko[1](6);
	    chooserc(1);
	 } 
}
