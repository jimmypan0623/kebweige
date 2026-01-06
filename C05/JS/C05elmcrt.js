function crtElm(){
    var thr1=document.getElementById('headrow1');	 
	var array1 = ['料品編號','品名規格','訂單編號', '預定交期','出貨數量','客戶編號','客戶簡稱','客戶品號','客戶PO','業務擔當'];
	var array2=['13%','13%','10%', '10%','7%','7%','7%','13%','13%','7%'];
	for (var j = 0; j < array1.length; j++) {
		var th = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell	
	    th.style.width=array2[j];
		th.appendChild(text);
		thr1.appendChild(th);		
	}	
}