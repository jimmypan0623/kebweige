function crtElm(){	     
    var maindiv=getElementsByAttribute('class','tab_css');	
	var beinsertedid=document.getElementById('tab1');
	var spn=document.createElement('span');
	spn.id="APPRVE";
	maindiv[0].insertBefore(spn,beinsertedid);
    var cntdiv=getElementsByAttribute('class','tab_content');	
	var rspn2=document.getElementById('serverResponse2'); 
	 var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	 cntdiv[1].insertBefore(text01,rspn2);
	var spn1=document.createElement('span');
	spn1.id="ttltitle";
	spn1.setAttribute("style","font-size:120%;font-weight:bold;");
     spn1.innerHTML='總金額:';
	cntdiv[1].insertBefore(spn1,rspn2);
	var spn2=document.createElement('span');
	spn2.id="crncy" ;
	spn2.setAttribute("style","font-size:120%;font-weight:bold;");
    cntdiv[1].insertBefore(spn2,rspn2);
	var spn3=document.createElement('span');
	spn3.id="ttlmny";
    spn3.setAttribute("style","font-size:120%;font-weight:bold;");
	spn3.innerHTML='0';
	 cntdiv[1].insertBefore(spn3,rspn2);
     var thr1=document.getElementById('headrow1');	 
	 var array1 = ['出退單號','客戶編號','客戶簡稱', '日期','業務擔當','原出貨月','發票號碼','類別','稅別','幣別','匯率','退/折'];
	 var array2 = ['10%','7%','7%', '4%','7%','7%','10%','4%','5%','4%','8%','4%','8%'];
	for (var j = 0; j < array1.length; j++) {
		var th1 = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell		
		th1.style.width=array2[j];
		th1.appendChild(text);
		thr1.appendChild(th1);
		
	}			
	  var thr2=document.getElementById('headrow2');
     var array3 = ['料品編號','品名規格','訂單號碼', '出貨數量','單價','小計','收貨部門','客戶品號','客戶PO'];
	 var array4 = ['14%','14%','10%', '8%','8%','8%','8%','14%','14%'];
	for (var k = 0; k < array3.length; k++) {
		var th2 = document.createElement('th'); //column		   
		var text = document.createTextNode(array3[k]); //cell	
	
		th2.style.width=array4[k];
		th2.appendChild(text);
		thr2.appendChild(th2);
		
	}			
	var tabnames=getElementsByAttribute('name','tablbl');	
	tabnames[0].innerHTML="出貨退回單瀏覽";
	tabnames[1].innerHTML="出貨退回單內容";
	var keynames=getElementsByAttribute('name','keyname');	
	keynames[0].innerHTML="單號:";
	var fatherkeys=getElementsByAttribute('name','fatherkey');	
/* 	fatherkeys[0].style.width="12%";
	fatherkeys[0].size="10"; */
}







 
