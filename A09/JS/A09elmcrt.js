function crtElm(){

	var tablblnames=getElementsByAttribute('name','tablbl');	
	tablblnames[0].innerHTML="部門設定作業";	
	
     var thr1=document.getElementById('headrow1');	 
	 var array1 = ['部門編號','部門名稱','物料存放', '生產加工','庫存計價','庫存可用','備註說明','最後異動'];
	 var array2 = ['8%','10%','8%', '8%','8%','8%','30%','18%'];
	for (var j = 0; j < array1.length; j++) {
		var th = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell	
	
		th.style.width=array2[j];
		th.appendChild(text);
		thr1.appendChild(th);
		
	}				
}
