function crtElm(){
	var tabnames=getElementsByAttribute('name','tablbl');	
	tabnames[0].innerHTML="詢價紀錄";
     var thr1=document.getElementById('headrow1');	 
	 var array1 = ['料品編號','廠商編號','廠商簡稱', '廠商品號','幣別','單價','最少訂購','包裝基量','付款條件','前置天數','生效日期','有效日期','備註'];
	 var array2 = ['9%','7%','7%', '9%','4%','7%','7%','7%','9%','9%','8%','8%','9%'];	
	for (var j = 0; j < array1.length; j++) {
		var th = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell		
		th.style.width=array2[j];
		th.appendChild(text);
		thr1.appendChild(th);		
	}				  
}