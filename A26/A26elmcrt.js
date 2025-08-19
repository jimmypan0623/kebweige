function crtElm(){	
	var tabnames=getElementsByAttribute('name','tablbl');	
	tabnames[0].innerHTML="系統參數設定";
     var thr1=document.getElementById('headrow1');	 
	 var array1 = ['參數編號','參數說明','使用程式', '型態','長度','設定內容','內容說明','檢查字串','最後異動'];
	 var array2 = ['7%','14%','14%', '5%','5%','14%','14%','14%','12%'];	
	for (var j = 0; j < array1.length; j++) {
		var th = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell		
		th.style.width=array2[j];
		th.appendChild(text);
		thr1.appendChild(th);		
	}				  
}