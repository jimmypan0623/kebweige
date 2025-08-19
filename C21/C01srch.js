function custnoshow(event)
{
    if (typeof event=="undefined")
	{
		event=window.event;
	}
	var target=getEventTarget(event);		
    var noorname=target.parentNode.childNodes[0];
   
/*'<div id="myModal" class="modal" style="display:block"><div class="modal-content"><span class="close">&times;</span><p>'.$error_msg.'(或是註冊申請表)</p></div></div>'*/
/*用JavaScript DOM 的建立方式建立如上列顯示之html標籤，同時把該有的css屬性加入以作彈跳視窗*/
    var dropext=document.getElementById('myModal3');  //由於與帳號登入錯誤訊息視窗共用一個DOM元素所建立的訊息畫面故先檢查該組元素是否還隱藏在畫面內有的話移除再重建
	if (dropext){	//如果有殘留訊息畫面的DOM則移除
	    dropext.parentNode.removeChild(dropext);
    }		
	var dropsheet=document.createElement('div');   //從外層元素開始加入
	dropsheet.setAttribute("id","myModal3");
	dropsheet.setAttribute("class","modal3");
	dropsheet.style.display="block";	   
    dropsheet.style.position="fixed"; /* Stay in place */       		
    dropsheet.style.left="0";
    dropsheet.style.top="0";
    dropsheet.style.width="100%"; /* Full width */
    dropsheet.style.height="100%";  
	dropsheet.style.zIndex="1";
	dropsheet.style.paddingTop="100px"; /* Location of the box */
	dropsheet.style.overflow="auto";     /* Enable scroll if needed */	
    dropsheet.style.backgroundColor = "rgba(0,0,0,0.4)"; /* Black w/ opacity 外層黑透內層白底*/
	var body=document.getElementsByTagName("body")[0];
	body.appendChild(dropsheet);            //最外層<div>加入body
    var dropsheet_content=document.createElement('div');
	dropsheet_content.setAttribute("id","modal-content2");
	dropsheet_content.style.backgroundColor="#fefefe";		
	dropsheet_content.style.margin="auto";
	dropsheet_content.style.padding="20px";
	dropsheet_content.style.width="50%";	
	dropsheet_content.style.border="1px solid #888";
	dropsheet_content.style.fontSize="22px";	  	  
	dropsheet_content.style.boxShadow = "5px 5px 5px 5px #003153";  //
	dropsheet.appendChild(dropsheet_content);  //訊息內框加入	
      
				 var headtitle="請選取客戶";
			     dropsheet.style.paddingTop="20px"; /* Location of the box */
		         var dialog=document.createElement("div");		//開始從畫面產生新增紀錄欄位			 
		         dialog.className="customDialog"; 		 
		         dialog.style.position="relative";             
		         var dialogButton1=document.createElement("input");		   
		        dialogButton1.setAttribute("type","button");
		        dialogButton1.setAttribute("class","btn");
		         dialogButton1.setAttribute("value","\u{2713}");			//確認				 
				 dialogButton1.setAttribute("style","position:relative;left:110px;color:green;font-size:17px;");					
				 attachEventListener(dialogButton1,"click",chseprg,false);					
				 var dialogButton3=document.createElement("input");
		         dialogButton3.setAttribute("type","button");
		         dialogButton3.setAttribute("class","btn");
		         dialogButton3.setAttribute("value","\u{2715}"); //關閉
				 dialogButton3.setAttribute("style","position:relative;left:120px;color:red;font-size:17px;");
		         attachEventListener(dialogButton3,"click",custblkclose,false);		  	      		  		  
				 var tblname=document.createElement("caption");
				 tblname.innerHTML=headtitle;					 				 
				 var srchTable=document.createElement("table");				  
		         srchTable.id="custTable";						
				 srchTable.className="gridlist";                
				 var srchHead=document.createElement("thead");		
				  srchHead.setAttribute("style","display:table;width:100%;table-layout:fixed;");				  
                  srchHead.style.width="calc( 100% - 1em )";
				  srchTable.appendChild(tblname);
				 srchTable.appendChild(srchHead);				 				
                var oTr = document.createElement('tr');				 
                var array = ['客戶編號', '客戶簡稱'];
                for (var j = 0; j < array.length; j++) {
                    var th = document.createElement('th'); //column
					th.style.width=(120-Math.pow(-2,j)*20)+'px';
                    var text = document.createTextNode(array[j]); //cell					
                    th.appendChild(text);
                    oTr.appendChild(th);
                }				
                srchHead.appendChild(oTr);	
				 var srchTbody=document.createElement("tbody");			
				 srchTbody.id='custTbody';
			     srchTbody.style.display="block";
		         srchTbody.style.height="270px";
				 srchTbody.style.width="100%"; 
		         srchTbody.style.overflow="auto";		
				 srchTable.appendChild(srchTbody);  						 
				 var formJason=document.createElement('form');		   
		         formJason.id="formdata2";	          								 
			    formJason.appendChild(srchTable);
				 formJason.appendChild(dialogButton1);
				 formJason.appendChild(dialogButton3);
				/*  formJason.appendChild(rspnsv); */
		         dialog.appendChild(formJason)  				 
	             dropsheet_content.style.width="28%";	 	 //原訊息內框畫面寬度調整  		  
		         dropsheet_content.appendChild(dialog);		
				 if(window.ActiveXObject){
		            var request = new ActiveXObject("Microsoft.XMLHttp");
	             }else if(window.XMLHttpRequest){
	   	              var request = new XMLHttpRequest();
				 }
	             request.onreadystatechange = respond;   
	             var url="C21/C01srch.php?timestamp="+new Date().getTime();   	               				 
	             request.open("POST",url);	 
	             request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");		
                  		
                 if (noorname.id=='customno'){		 
				    var custno=document.getElementById('customno').value; 
				    var queryString ="filename="+"c01.F01"+"|"+custno;    
                 }else{
					 var custname=document.getElementById('customname').value; 
					 var queryString ="filename="+"c01.F05"+"|"+custname;    
                 }					 
				 request.send(queryString);
	             function respond(){
                    if (request.readyState == 4 && request.status == 200) {	       	     		            
                         rsp=JSON.parse(request.responseText);						   
                         srchCustNo(rsp);				                            	  
	                }	  
                 }

    return true;
}
function chseprg(event)  //選擇客戶
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
	 
	 var custNo=document.getElementById('customno');
	 custNo.value="";
     var custName=document.getElementById('customname');			
	 custName.value="";
	 var custFullName=document.getElementById('customfullname');	
	 var rprsntno=document.getElementById('whono');
	 var rprsntname=document.getElementById('whonameEx');
	 var crnttpe=document.getElementById('crntopt');
	 var contactman=document.getElementById('winman');
     var shipway=document.getElementById('howship');
	 var paymenttp=document.getElementById('howpay');
	 var shipplace=document.getElementById('dlvrplace');
	 var shipdirect=document.getElementById('shipdirect');
	 var maintable=document.getElementById("custTbody");  
		for(var i=0;i< maintable.rows.length; i++){			 
		      if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			     custNo.value=maintable.rows[i].cells[0].innerHTML;								 
				 custName.value=maintable.rows[i].cells[1].innerHTML;
				 if(rprsntno){
				    rprsntno.value=maintable.rows[i].cells[2].innerHTML;
				 }
				 if(rprsntname){
				   rprsntname.innerHTML=maintable.rows[i].cells[3].innerHTML;
				 }
				 if(crnttpe){
				    crnttpe.value=maintable.rows[i].cells[4].innerHTML;
				 }
				 if(contactman){
				    contactman.value=maintable.rows[i].cells[5].innerHTML;
				 }
				 if(shipway){
				    shipway.value=maintable.rows[i].cells[6].innerHTML;
				 }
				 if(custFullName){
				    custFullName.value=maintable.rows[i].cells[11].innerHTML;
				 }
				 if(paymenttp){
				    var tpy=maintable.rows[i].cells[7].innerHTML;
			        switch (tpy){				        
                        case '0' :{
						     tpy="現結";
						     break;
					    }
					    case '1' :{
						     tpy="月結";
						     break;
					    }
					    case '2' :{
						     tpy="次月結";
						     break;
					    }
					    case '3' :{
						     tpy="T/T";
						     break;
					    }
                        default: {
					       tpy='現結';
                          break;
                       }	
				
			        }	 
				    paymenttp.value=tpy+(maintable.rows[i].cells[8].innerHTML==0?'':maintable.rows[i].cells[8].innerHTML+'天');
				 }	
				 if(shipplace){
					 shipplace.value=maintable.rows[i].cells[9].innerHTML;
				 }
				  if(shipdirect){
					 shipdirect.value=maintable.rows[i].cells[10].innerHTML;
				 }
				 break;
			   }		
			  		   
		}             
	custblkclose(event);	
	return true;
}	

function custblkclose(event)  //關閉註冊彈出視窗
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
	var dropsheet=document.getElementById("myModal3");
	dropsheet.style.display="none";       //關閉視窗 
	if (dropsheet!=null){		
        dropsheet.parentNode.removeChild(dropsheet);  //並將這些元素移除	 
	}   
	  
	    var bibau=cko[1](0);   //找出閉包變數現值
	   cko[1](bibau*(-1));    //將閉包變數歸零	 
	return true;
}	


function srchCustNo(str1) {       //開窗顯示人員選項
    var cnt=0;
	var arr = str1; 
   var oTable = document.getElementById("custTbody");		
  
	for(var i=0;i<arr.length;i++){		
		 
		var oTr=oTable.insertRow(-1);	
	     
		cnt++;
         
		for(var jk in arr[i]){		   
		 var oTd = oTr.insertCell(oTr.cells.length);
		  attachEventListener(oTd,'click',rowchoose,false);		//點選資料   
		  if (!isNaN(parseInt(arr[i][jk]*1))){
			  oTd.innerHTML=parseInt(arr[i][jk]*1)>0?arr[i][jk]:"";
		  } else{
			  oTd.innerHTML=arr[i][jk];
		  }
		 
		  if(jk=='cust_no'){
			     oTd.setAttribute("style","text-align:left;width:100px;");
		  }else if(jk=='cust_name'){
			 
		        oTd.setAttribute("style","text-align:left;width:160px;");
		  }else{
		         oTd.setAttribute("style","display:none;");   
		  }		  		   
		}  		
		 
		 var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	      oTd.setAttribute("style","width:40px;display:none");   //勾選不顯示
	 	   var myCheck=document.createElement('input'); 
		   myCheck.type="checkbox";
		    var tables=getElementsByAttribute("class","gridlist");
		   // var rcrdchsn="recordchosen"+tables.length.toString();
		     var rcrdchsn="chkbxcustTable"; 
		    myCheck.setAttribute("name",rcrdchsn);   //讓使用者勾選的checkbox表	
		    	  
		   attachEventListener(myCheck,'click',chooserc,false);		   
		   oTd.appendChild(myCheck);   
	}
	 if (cnt>0){
		cko[1](2);
	    chooserc(1);
	 }
	   
}
