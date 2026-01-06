function crtElm(){		
     var thr1=document.getElementById('headrow1');	 
	 var array1 = ['交易日期','憑證單號','發票號碼','憑證總額','未沖金額','客戶編號','客戶簡稱','統一編號','業務人員','收款日期','逾期天數','付款條件'];
	 var array2 = ['9%','10%','10%','9%','9%','7%', '7%','7%','7%','9%','7%','8%'];	
	for (var j = 0; j < array1.length; j++) {
		var th = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell	
		 th.style.width=array2[j];
		th.appendChild(text);
		thr1.appendChild(th);		
	}						 
}


