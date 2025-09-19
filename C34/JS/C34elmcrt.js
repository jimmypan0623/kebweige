function crtElm(){
	var tabnames=getElementsByAttribute('name','tablbl');	
	tabnames[0].innerHTML="客戶品號對照";
     var thr1=document.getElementById('headrow1');	 
	 var array1 = ['料品編號','品名規格','客戶編號', '客戶簡稱','客戶品號','資料來源'];
	 var array2 = ['24%','24%','8%', '8%','24%','10%'];
	for (var j = 0; j < array1.length; j++) {
		var th = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell		
		th.style.width=array2[j];
		th.appendChild(text);
		thr1.appendChild(th);		
	}				  
}