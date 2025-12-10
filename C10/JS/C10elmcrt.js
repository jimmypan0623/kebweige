function crtElm(){	
	var cntdiv=getElementsByAttribute('class','tab_content');	
	var rspn1=document.getElementById('serverResponse1'); 
	 var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	 cntdiv[0].insertBefore(text01,rspn1);		
	var spn1=document.createElement('span');
	spn1.id="ttltitle";	 
     spn1.innerHTML='總金額:';
	cntdiv[0].insertBefore(spn1,rspn1);
	var spn2=document.createElement('span');
	spn2.id="crncy" ;
    cntdiv[0].insertBefore(spn2,rspn1);
	var spn3=document.createElement('span');
	spn3.id="ttlmny";  
	spn3.innerHTML='0';
	 cntdiv[0].insertBefore(spn3,rspn1);	
	var tabnames=getElementsByAttribute('name','tablbl');	
	tabnames[0].innerHTML="出貨月報表";
	var oMember = document.getElementById("member1");	  
	oMember.setAttribute("style","width:127%;");
     var thr1=document.getElementById('headrow1');	 
	 var array1 = ['料品編號','出貨單號','日', '訂單號碼','客戶編號','客戶簡稱','數量','單價','幣別','匯率','小計','出貨部門','業務人員','業務助理','客戶PO','客戶品號'];
	 var array2 = ['10%','9%','3%', '9%','7%','7%','7%','7%','4%','7%','8%','7%','7%','7%','10%','10%'];	
	for (var j = 0; j < array1.length; j++) {
		var th = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell			
		th.style.width=array2[j];
		th.appendChild(text);
		thr1.appendChild(th);		
	}					 
}