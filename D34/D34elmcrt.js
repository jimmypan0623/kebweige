function crtElm(){
	var tabnames=getElementsByAttribute('name','tablbl');	
	tabnames[0].innerHTML="廠商品號對照表";
     var thr1=document.getElementById('headrow1');	 
	 var array1 = ['料品編號','品名規格','廠商編號', '廠商簡稱','廠商品號','資料來源'];
	 var array2 = ['24%','24%','8%', '8%','24%','10%'];
	for (var j = 0; j < array1.length; j++) {
		var th = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell		
		th.style.width=array2[j];
		th.appendChild(text);
		thr1.appendChild(th);		
	}				  
}


/* <th >料品編號</th> 
	<th>品名規格</th>	
    <th style="width:8%;">廠商編號</th>  
     <th style="width:8%;">廠商簡稱</th>  
     <th >廠商品號</th>  	 
    <th style="width:10%;">資料來源</th>
	*/