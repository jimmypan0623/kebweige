function crtElm(){	
	var tablblnames=getElementsByAttribute('name','tablbl');	 
	tablblnames[0].innerHTML="部門別庫存量月報表";
     var thr1=document.getElementById('headrow1');	 
	 var array = ['料號','期初','進貨', '進貨退出','出貨數量','出貨退回','轉入','轉出','產出','產耗','損耗','盤差','期末'];
	for (var j = 0; j < array.length; j++) {
		var th = document.createElement('th'); //column		   
		var text = document.createTextNode(array[j]); //cell	
		if (j==0){		
		   th.setAttribute("style","width:12%;");
		   
		}else{
		      th.setAttribute("style","width:7%;");
		}
		th.appendChild(text);
		thr1.appendChild(th);		
	}					
	 

}


