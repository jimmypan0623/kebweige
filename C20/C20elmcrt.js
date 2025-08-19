function crtElm(){
	var tabnames=getElementsByAttribute('name','tablbl');	
	tabnames[0].innerHTML="產品包裝資料";
     var thr1=document.getElementById('headrow1');	 
	 var array1 = ['料品編號','品名規格','單位', '包裝基量','包裝方式','外箱數量','最少出貨','外箱才積','單位毛重','單位淨重','備註'];
	 var array2 = ['13%','13%','5%', '8%','7%','8%','8%','8%','8%','8%','13%'];
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
	 <th style="width:5%;">單位</th>  
    <th style="width:8%;">包裝基量</th>  
     <th style="width:7%;">包裝方式</th>  	
    <th style="width:8%;">外箱數量</th>  
	<th style="width:8%;">最少出貨</th>  	
	 <th style="width:8%;">外箱才積</th> 
	 <th style="width:8%;">單位毛重</th> 
	 <th style="width:8%;">單位淨重</th> 	
	 <th >備註</th>     */