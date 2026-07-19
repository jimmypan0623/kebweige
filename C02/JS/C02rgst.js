function blocksclose(event)  //關閉註冊彈出視窗
{	
	if (typeof event=="undefined"){
		event=window.event;
	}	
	var target=getEventTarget(event);
	
	var dropsheet=document.getElementById("myModal");
	dropsheet.style.display="none";       //關閉視窗 
	
	if (dropsheet!=null){		
        dropsheet.parentNode.removeChild(dropsheet);  //並將這些元素移除	 
	}   
    var btns=getElementsByAttribute('class','btn');		
	var bttssn1=[];
    for (var i=0;i<btns.length;i++){
		bttssn1.push(btns[i].title);
		btns[i].setAttribute("accesskey",right(bttssn1[i],1));				 
	}		      		
	return true;
}	

function sendFilePrc(updflg){     //新增資料及修改程序       
	var tbjsn=[];
	var nonjsn=[];
	var recordNo=document.getElementById("rcrd_no");
    //----資料寫入資料庫前過濾程序區-----//
	var tbno=0;
	var tabs=getElementsByAttribute('class','tab');	
	for(var i=0;i<tabs.length;i++){
		if(tabs[i].checked){
			tbno=i;
			break;
		}
	}					 	
	var c02elements=document.getElementsByName('c02update');	
	var c02athments=document.getElementsByName('c02others');
	for(var r=0;r<c02athments.length;r++){        //關聯資料
		    nonjsn.push(c02athments[r].tagName.toUpperCase()=='SPAN'?c02athments[r].innerHTML:c02athments[r].value);		
	}

	for(var q=1;q<c02elements.length;q++){  	    //開始堆疊待異動資料陣列
		 tbjsn.push(c02elements[q].value);	   
	}
	for(var j=1;j<c02elements.length-1;j++){  //最後一欄備註不過濾
        if(c02elements[j].value.trim()==="" ){		
		    if (j==1){
			  c02elements[j].placeholder="不得空白" ;
		     }else{
		        filtermsg(c02elements[j],"不得空白");
			 }
		   return false ;
        }else{		     
		   if(c02elements[j].nextSibling){		      
			  c02elements[j].parentNode.removeChild(c02elements[j].nextSibling);
		   }	
	    }
	}
    //--------過濾區結束----------//	
	
    if (updflg==1){     //如果是新增	 
        if(c02elements[1].value!="" ){
           //var rspns=TableToJson(loginNo.value,stockNo.value,newAuth,editAuth,delAuth,prntAuth,auth1Attach,auth2Attach,auth3Attach,auth4Attach,auth5Attach,0,0);        
		   tbjsn.push(0);
		   tbjsn.push(0);
	
		   var rspns=TableToJson(tbjsn,nonjsn,tbno);        
	    } 
	    else{
		    blkshow("欄位資料不齊全無法新增權限");
        }		
    }else{    //如果是修改
        if (typeof updflg=="undefined"){
		    updflg=window.event;
        }	
	    var target=getEventTarget(updflg);	         		 							      	
		var tablerowindex=sourceAccount(null,tbno);   //記住是目前table的哪一列	    	
         tbjsn.push(recordNo.value);	
         tbjsn.push(tablerowindex);				
         var rspns=TableToJson(tbjsn,nonjsn,tbno); 	
   }   
   blocksclose();			//關掉原視窗   
   return true;	 	
}


/* function c01CustomName(event){	
   if (typeof event=="undefined")
	{
		event=window.event;
	}	
	var targetCustomNo=getEventTarget(event);		
	var sendSrcRec="filename="+targetCustomNo.value;		
		var rsp="";  	
        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	      var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;	
       
		var url="B01/BKND/C01CustomName.php?timestamp="+new Date().getTime();
			
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendSrcRec);		
	function respond(){           
		  if (request.readyState == 4 && request.status == 200) {    
             rsp=JSON.parse(request.responseText);
			 var cstnm=document.getElementById('customname');
			 cstnm.value=rsp[0]['customname'];
			 if (!cstnm.value){
				targetCustomNo.placeholder='無此編號';
				targetCustomNo.focus();
			 }
	          
		  }
	}
	return;
} */

async function c01CustomName(event) {	
    // 1. 取得事件目標（相容舊瀏覽器）
    if (typeof event == "undefined") {
        event = window.event;
    }	
    var targetCustomNo = getEventTarget(event);	
    
    // 如果找不到目標或沒有值，就不用發送請求
    if (!targetCustomNo || !targetCustomNo.value) return;

    // 2. 使用 URLSearchParams 安全包裝資料，自動處理特殊字元轉義
    var sendSrcRec = new URLSearchParams();
    sendSrcRec.append("filename", targetCustomNo.value);

    // 加上時間戳記防止瀏覽器快取
    var url = "B01/BKND/C01CustomName.php?timestamp=" + Date.now();			
    
    try {
        // 3. 發送 fetch POST 請求
        var response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: sendSrcRec.toString()
        });

        // 檢查網路回應是否成功
        if (!response.ok) {
            throw new Error("網路回應錯誤，狀態碼：" + response.status);
        }

        // 4. 解析後端回傳的 JSON 資料
        var rsp = await response.json(); 	

        // 5. 執行你的前端 UI 更新與檢查邏輯
        if (rsp && rsp[0]) {
            var cstnm = document.getElementById('customname');
            
            // 填入查詢到的客戶名稱（如果沒有資料，賦予空字串）
            cstnm.value = rsp[0]['customname'] || '';
            
            // 【核心邏輯】如果欄位值為空（代表沒查到名稱）
            if (!cstnm.value) {
                targetCustomNo.value = '';             // 先清空原本輸入的錯誤編號
                targetCustomNo.placeholder = '無此編號'; // 顯示提示字
                targetCustomNo.focus();               // 強制聚焦，讓使用者直接重新輸入
            }
        }

    } catch (error) {
        console.error("查詢客戶名稱失敗:", error);
    }
}
function modifyFields(tbno,txtword,ajTable,aWaitUpdate){   //新增修改時出現之欄位
    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	  var oTd = oTr.insertCell(0);	   
	  oTd.setAttribute('style','text-align:right;width:15%');					
	  oTd.innerHTML='備註:';
	  var oTd = oTr.insertCell(1);       
	   oTd.colspan=3;
	  oTd.innerHTML="<input type='text' name='c02update' id='dscrpt' class='txt' style='width:80%;' maxlength='40'/>";  				  	
	  var oTr=ajTable.insertRow(ajTable,ajTable.length);
	  var oTd = oTr.insertCell(0);
	  oTd.setAttribute('style','text-align:right;width:15%');	
	  oTd.innerHTML='生效日期:';
	  var oTd = oTr.insertCell(1);
	  oTd.innerHTML="<input type='date' name='c02update' class='txt' id='validstart'  style='width:70%;'  />";  				   				   			 	              
	  var oTd = oTr.insertCell(2);
	  oTd.setAttribute('style','text-align:right;width:15%');	
	  oTd.innerHTML='有效期限:';
	  var oTd = oTr.insertCell(3);
	  oTd.innerHTML="<input type='date' name='c02update' class='txt' id='validend'  style='width:70%;'  />"; 
	  var oTr=ajTable.insertRow(ajTable,ajTable.length);
	  var oTd = oTr.insertCell(0);	   
	  oTd.setAttribute('style','text-align:right;width:15%');					
	  oTd.innerHTML='報價單號:';
	  var oTd = oTr.insertCell(1);           
	   oTd.colspan=3;
	oTd.innerHTML="<input type='text' name='c02update' id='quotqtionno' class='txt' style='width:50%;' maxlength='30'/>";
	  var oTr=ajTable.insertRow(ajTable,ajTable.length);
		  var oTd = oTr.insertCell(0);	   
		  oTd.setAttribute('style','text-align:right;width:15%');					
		  oTd.innerHTML='付款條件:';
		  var oTd = oTr.insertCell(1);           
		   oTd.colspan=3;
		oTd.innerHTML="<input type='text' name='c02update' id='howpay' class='txt' style='width:50%;' maxlength='30'/>";		   
	  var oTr=ajTable.insertRow(ajTable,ajTable.length);
		  var oTd = oTr.insertCell(0);	   
		  oTd.setAttribute('style','text-align:right;width:15%');					
		  oTd.innerHTML='最少訂購:';
		  var oTd = oTr.insertCell(1);               	       
		oTd.innerHTML="<input type='text' name='c02update' id='minumqty' class='txt' style='width:50%;text-align:right;' maxlength='30'/>";		
		var oTd = oTr.insertCell(2);	   
		  oTd.setAttribute('style','text-align:right;width:15%');					
		  oTd.innerHTML='包裝基量:';
		  var oTd = oTr.insertCell(3);               	       
		oTd.innerHTML="<input type='text' name='c02update' id='basepack' class='txt' style='width:50%;text-align:right;' maxlength='30'/>";			     
	   var oTr=ajTable.insertRow(ajTable,ajTable.length);
	  var oTd = oTr.insertCell(0);	   
	  oTd.setAttribute('style','text-align:right;width:15%');					
	  oTd.innerHTML='幣別:';
	  var oTd = oTr.insertCell(1);  
	  var slt4=document.createElement("select");
	  slt4.setAttribute("id","crntopt");
	  slt4.setAttribute("name","c02update");
	  oTd.appendChild(slt4);					
	   var oTd = oTr.insertCell(2);	   
	  oTd.setAttribute('style','text-align:right;width:15%');					
	  oTd.innerHTML='單價:';
	  var oTd = oTr.insertCell(3);               	       
	oTd.innerHTML="<input type='text' name='c02update' id='unitprice' class='txt' style='width:50%;text-align:right;' maxlength='30'/>";
		  
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		 var oTd = oTr.insertCell(0);
		 oTd.setAttribute('style','text-align:right;width:15%');	
		oTd.innerHTML='客戶品號:';
		var oTd = oTr.insertCell(1);			     
		oTd.innerHTML="<input type='text' name='c02update' id='csurompartno' class='txt' style='width:70%;' maxlength='30' />";                             
	 
	  var oTr=ajTable.insertRow(ajTable,ajTable.length);
	  var oTd = oTr.insertCell(0);	   
	  oTd.setAttribute('style','text-align:right;width:15%');					
	  oTd.innerHTML='客戶代號:';
	  var oTd = oTr.insertCell(1);               	            				  
	  oTd.innerHTML="<input type='text' name='c02update' id='customno' class='txt' style='width:35%;' maxlength='6'    />";  				
	  
	  var srchButton3=document.createElement("input");				   
	   srchButton3.setAttribute("type","button");	
	   srchButton3.setAttribute("class","scopelook");				   
	   srchButton3.style.background="url('digits/brows1.png')";   
	  attachEventListener(srchButton3,"click",srchshow,false);				
	  oTd.appendChild(srchButton3);			
	  
	   var oTd = oTr.insertCell(2);
	 oTd.setAttribute('style','text-align:right;width:15%');	
	 oTd.innerHTML='客戶簡稱:';
	  var oTd = oTr.insertCell(3);               
	  oTd.innerHTML="<input type='text' name='c02others' id='customname' class='txt' style='width:35%;' maxlength='8'    />";  				 
	  var srchButton2=document.createElement("input");				   
	   srchButton2.setAttribute("type","button");	
	   srchButton2.setAttribute("class","scopelook");				   
	   srchButton2.style.background="url('digits/brows1.png')";   
	  attachEventListener(srchButton2,"click",srchshow,false);				
	  oTd.appendChild(srchButton2);					
	  
	  var oTr=ajTable.insertRow(ajTable,ajTable.length);
	  var oTd = oTr.insertCell(0);	   
	  oTd.setAttribute('style','text-align:right;width:15%');					
	  oTd.innerHTML='料品編號:';
	  var oTd = oTr.insertCell(1);     
	   oTd.colspan=3;
	  if(txtword==2){   //如果是修改	
		  oTd.innerHTML="<input type='text' name='c02update' id='stockno' class='txt' style='background-color:#B9B9FF;width:60%;' maxlength='43' readOnly=true  />";  	
		   optionitem(aWaitUpdate[4],slt4.id,4,"C01/BKND/C00srch.php");		//幣別欄位	
	  }else{
		  oTd.innerHTML="<input type='text' name='c02update' id='stockno' class='txt' style='width:60%;' maxlength='43'    />";
		   optionitem(getCookie('INT_011'),slt4.id,4,"C01/BKND/C00srch.php");	
		   var srchButton4=document.createElement("input");				   
		srchButton4.setAttribute("type","button");	
		srchButton4.setAttribute("class","scopelook");				   
		srchButton4.style.background="url('digits/brows1.png')";   
		attachEventListener(srchButton4,"click",srchshow,false);				
		oTd.appendChild(srchButton4);	
		
	  }  
	   
	var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	var oTd = oTr.insertCell(0);	             
	oTd.innerHTML='紀錄號碼';
	var oTd = oTr.insertCell(1);
	oTd.colspan=3;
	oTd.innerHTML="<input type='text' name='c02update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
	oTr.setAttribute("style","display:none;");	
}

function topAndWidthModify(dropsheet_content,dropsheet,txtword){
	dropsheet_content.style.width="50%";   //原訊息內框畫面寬度調整  
    dropsheet.style.paddingTop="15px";      // 高度也往上提 	
    return true;
}

function initFocusField(txtword,tbno,aWaitUpdate,notWaitdata,ajTable){
    switch (txtword) {
		case 1:                                   //如果是新增		   
		    var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		    var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日			        
		    document.getElementById("validstart").value=thtdy;  //日期都設為今天
				//以下這一串是在算往後推的日期
			var today=new Date();
			var endday=today.addDays(parseInt(getCookie('INT_126'))); //加上參數預設有效天數
			var endaydash=endday.getFullYear()+'-'+MyMonth(endday.getMonth())+'-'+((endday.getDate()<10) ? "0" : "") + endday.getDate();						
			////////////////
			document.getElementById("validend").value=endaydash;  //日期往後推
			document.getElementById("stockno").focus(); 
			var cstNo=document.getElementById("customno");						 
			 attachEventListener(cstNo,"change",c01CustomName,false);	//找客戶名稱
		    break;
		case 2:                                                     //如果是修改，要先顯示目前該筆資料
		   var cstNo=document.getElementById("customno");
			cstNo.focus();	
			attachEventListener(cstNo,"change",c01CustomName,false);	//找客戶名稱			
		    document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來				 		  
		    var editinit=document.getElementsByName('c02update');		   
		    document.getElementById('customname').value=notWaitdata[0];
		    for(var k=0;k<editinit.length;k++){ 
			   editinit[k].value=aWaitUpdate[k];
		    }										
		    break;	
		case 7:   	   	//搜尋   
			 var txtseek=document.getElementById('searchWords');
			 txtseek.focus();
			 attachEventListener(txtseek,'keypress',textKeypress,false);
			 break;           
	 }				 
}

function  colomnAfterChange(tbno,oTr,args,nongs,rsp){    //TableToJson(args,nongs,tbno)函數內新增紀錄後呼叫的畫面更動
    var fldidx=0;
	var argsNo=0;
	var nongsNo=0;	
    while(rsp.fldsatrr[fldidx]){
	    var oTd = oTr.insertCell(oTr.cells.length); 
		if(rsp.fldsatrr[fldidx][0]=='directdata'){
			oTd.innerHTML=args[argsNo];
			argsNo++;
		}else{
			oTd.innerHTML=nongs[nongsNo];	
			  nongsNo++;
		}
		oTd.setAttribute("class",rsp.fldsatrr[fldidx][0]);
		if(rsp.fldsatrr[fldidx][1]=='none'){
				oTd.setAttribute("style","display:none;");		
		}else{
			   oTd.style.textAlign=rsp.fldsatrr[fldidx][2];				     	
			   oTd.style.width=rsp.fldsatrr[fldidx][3]+"%";				  
		}					 		
        fldidx++;
    }
	//最後異動
    var oTd = oTr.insertCell(oTr.cells.length);				       
    oTd.innerHTML=rsp.lastupdate;			
    oTd.setAttribute("style","display:none;");   		
}
function colomnContextChange(tbno,args,nongs,arglth,rsp){    //TableToJson(args,nongs,tbno)函數修改紀錄後呼叫的畫面更動
	var maintable=document.getElementById("maintbody1");
	  var fldidx=1;
		var argsNo=1;
		var nongsNo=0;	
		while(rsp.fldsatrr[fldidx]){			
			if(rsp.fldsatrr[fldidx][0]=='directdata'){				
				 maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=args[argsNo];				
				argsNo++;			
			}else{
			   if(fldidx==2){
			       maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=nongs[nongsNo];	;
			   }
			}
			fldidx++;
		}				
    //最後異動	 
	maintable.rows[args[arglth-1]].cells[arglth].innerHTML=rsp.lastupdate;		
}

function  addNewRecordHint(tbno){
   return "請輸入相關料號：";		
}
function editRecordHint(tbno){
     return "修改相關料號："; 
}
function searchKeyHint(tbno){    //搜尋畫面出現提示
   return "搜尋報價紀錄欄位選擇";		
}
/////以下處理開窗回傳資料
function srcArgobj(srcId){
	if(srcId=='customno' || srcId=='customname'){
		var custno=document.getElementById(srcId).value; 
		var tttlt='';
		if (srcId=='customno'){		 		    
		    var qrystring = "c01.F01"+"|"+custno; 
			 tttlt='請選擇客戶編號';
	    }else{		    
		    var qrystring = "c01.F05"+"|"+custno;
			tttlt='請選擇客戶簡稱';
	    }					 		
        return {"headtitle":tttlt,"drpshtWidth":"28%","thCntnt":['客戶編號', '客戶簡稱'],"thWidth":['50%','50%'],"urlPth":"C21/BKND/C01srch.php","clickfunc":chsecust,"qryString":qrystring,"mendwidth":"calc( 100% - 1em )"};	
	}else if(srcId=='stockno'){		 
		var stockNo=document.getElementById(srcId).value;		 
		var qrystring  = "b01.F01"+"|"+stockNo;    	
		return {"headtitle":"請選取料號","drpshtWidth":"60%","thCntnt":['料品編號', '品名規格'],"thWidth":['50%','50%'],"urlPth":"C02/BKND/B01srch.php","clickfunc":stckchg,"qryString":qrystring,"mendwidth":"calc( 100% - 1em )"};
	}
}


function stckchg(event)  //選擇料號
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
	 
	 var stockNo=document.getElementById('stockno');
	 stockNo.value="";

	 var basicqty=document.getElementById('basepack');
	 var minumorder=document.getElementById('minumqty');
	 var custstockno=document.getElementById('custompartno');
	 var maintable=document.getElementById("stuffTbody");  
		for(var i=0;i< maintable.rows.length; i++){
			 
		      if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			     stockNo.value=maintable.rows[i].cells[0].innerHTML;								 
	
				
				 if(basicqty){
				    basicqty.value=maintable.rows[i].cells[3].innerHTML ;
			     }
				 
				 if(minumorder){
				    minumorder.value=maintable.rows[i].cells[4].innerHTML;
			       }
			     if(custstockno){
				    custstockno.value=maintable.rows[i].cells[5].innerHTML;
			     }  
				 break;
			   }				 
		}             
	srchblkclose(event);	
	return true;
}	

function chsecust(event)  //選擇客戶
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
	 var maintable=document.getElementById("stuffTbody");  
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
	srchblkclose(event);	
	return true;
}	