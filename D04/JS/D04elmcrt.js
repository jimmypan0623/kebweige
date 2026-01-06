function crtElm(){	     
    var maindiv=getElementsByAttribute('class','tab_css');	
	var beinsertedid=document.getElementById('tab1');
	var spn=document.createElement('span');
	spn.id="APPRVE";
	maindiv[0].insertBefore(spn,beinsertedid);
    var cntdiv=getElementsByAttribute('class','tab_content');	
	var rspn2=document.getElementById('serverResponse2'); 	
	var orpButton10=document.createElement("input");		   
	orpButton10.setAttribute("type","button");
	orpButton10.setAttribute("class","btn");
	orpButton10.setAttribute("value","\u{1F4DA}");          
    orpButton10.setAttribute("style","font-size:17px;");       			
	orpButton10.setAttribute("title","查看出貨紀錄，快速鍵 Alt+B");   
	orpButton10.setAttribute("accesskey","B");	
	attachEventListener(orpButton10,"click",page2OtherButton1,false);
	orpButton10.id="OUTRCD_BOTT";		
	var text16 = document.createTextNode('\u{A0}\u{A0}');
	var text17 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}');   
	cntdiv[1].insertBefore(text16,rspn2);
	cntdiv[1].insertBefore(orpButton10,rspn2);
	cntdiv[1].insertBefore(text17,rspn2);		
	var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}');
	cntdiv[1].insertBefore(text01,rspn2);
	var spn1=document.createElement('span');
	spn1.id="ttltitle";
     spn1.innerHTML='總金額:';
	cntdiv[1].insertBefore(spn1,rspn2);
	var spn2=document.createElement('span');
	spn2.id="crncy" ;
    cntdiv[1].insertBefore(spn2,rspn2);
	var spn3=document.createElement('span');
	spn3.id="ttlmny";
	spn3.innerHTML='0';
	cntdiv[1].insertBefore(spn3,rspn2);
    var thr1=document.getElementById('headrow1');	 
	var array1 = ['採購單號','廠商編號','廠商簡稱', '下單日期','採購人員','幣別','需求用途','交貨地點','運送方式'];
	var array2 = ['10%','7%','7%', '10%','7%','4%','12%','32%','10%'];
	for (var j = 0; j < array1.length; j++) {
		var th1 = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell		
		th1.style.width=array2[j];
		th1.appendChild(text);
		thr1.appendChild(th1);		
	}			
	var thr2=document.getElementById('headrow2');
    var array3 = ['料品編號','品名規格','採購數量', '單價','小計','廠商品號','希望交期','已進數量','取消數量','未進數量'];
	var array4 = ['13%','13%','8%', '8%','8%','13%','10%','8%','8%','8%'];
	for (var k = 0; k < array3.length; k++) {
		var th2 = document.createElement('th'); //column		   
		var text = document.createTextNode(array3[k]); //cell		
		th2.style.width=array4[k];
		th2.appendChild(text);
		thr2.appendChild(th2);		
	}			
	var keynames=getElementsByAttribute('name','keyname');	
	keynames[0].innerHTML="單號:";
	var fatherkeys=getElementsByAttribute('name','fatherkey');
	
}




 
