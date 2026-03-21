function getProfile(arr,reccount) {      
    var cnt=0;
	var rnddgt=getCookie('INT_069');  //四捨五入到幾位
	//var arr = str1; 
	var queryttl=0;
	var scndttl=document.getElementById('ttlmny');   //次頁表頭的總金額物件
    var tabs=getElementsByAttribute("class","tab");
	var pagecount=Math.ceil(reccount/parseInt(getAuth[2]()[0].INT_RCD));
	var optdigts= (pagecount.toString()).length;	    
	var slt2=document.getElementById('recmth');
	if (slt2.options.length<pagecount){
		for (var i=slt2.options.length+1;i<=pagecount;i++){
			var item_no=paddingLeft(i,optdigts);				
			var varItem=new Option(item_no,item_no);
			slt2.options.add(varItem);	 
	   }	  
			   //第一個選項位數修正		   
	   slt2.options[0].value=paddingLeft(1,optdigts);
	   slt2.options[0].text=paddingLeft(1,optdigts);
		var bibau=cko[0](0);   //找出閉包筆數變數現值
		cko[0](bibau*(-1));    //將閉包變數歸零
		cko[0](reccount);      //將筆數記起來		  
	}	
	/* var oTable = document.getElementById("maintbody1");	 
	for(var i=0;i<arr.length;i++){		
		var oTr=oTable.insertRow(-1);	
		oTr.setAttribute("name","mainrow");	      		
		cnt++;		
		for(var jk in arr[i]){		   
			var oTd = oTr.insertCell(oTr.cells.length);		     		  
			oTd.innerHTML=arr[i][jk];		 	
			var ara=jk.substr(jk.lastIndexOf('_')-3,3);		
			var ks=ara.split('');		
			//ks[0]:直接或間接 D/I
			//ks[1]:是否顯示   S/H
			//ks[2]:靠左中或右 L/C/R	
			if(ks[0]=="D"){
				oTd.setAttribute("class","directdata");	
			}else{
				oTd.setAttribute("class","indirectdata");	
			}				 
			if(ks[1]=='H'){
				oTd.setAttribute("style","display:none;");		
			}else{
			   oTd.style.textAlign=(ks[2]=="L"?"left":(ks[2]=="C"?"center":"right"));
			   var wdthln=jk.substr(jk.lastIndexOf('_')+1,3);  	  	
			   oTd.style.width=wdthln+"%";
			   attachEventListener(oTd,'click',rowchoose,false);		//點選資料
			}		
			if(jk.substr(0,jk.lastIndexOf('_')-4)=='rcd_total'){
			   queryttl+=Number(oTd.innerHTML);
			}
	    }
	  
	   var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	   oTd.setAttribute("style","width:40px;display:none");   //勾選不顯示
	   var myCheck=document.createElement('input'); 
	   myCheck.type="checkbox";		  
	   myCheck.setAttribute("name","chkbxmember1");   //讓使用者勾選的checkbox表頭			
	   attachEventListener(myCheck,'click',chooserc,false);		   
	   oTd.appendChild(myCheck);     
	   		  
	} */
	////
/*	var oTable = document.getElementById("maintbody1");
 	var queryttl = 0; // 確保有初始化
	var cnt = 0;

	for (var i = 0; i < arr.length; i++) {
		var oTr = oTable.insertRow(-1);
		oTr.setAttribute("name", "mainrow");
		cnt++;

		for (var jk in arr[i]) {
			var oTd = oTr.insertCell(-1);
			var cellValue = arr[i][jk];
			oTd.innerHTML = cellValue;

			// 解析格式字串，例如 "someName_DICL_010"
			var lastIdx = jk.lastIndexOf('_');
			if (lastIdx < 3) continue; // 防呆：如果格式不對就跳過樣式處理

			var ara = jk.substr(lastIdx - 3, 3); // 取得 D/I, S/H, L/C/R 部分
			var ks = ara.split(''); 

			// 1. 設定 Class (直接或間接)
			oTd.className = (ks[0] === "D") ? "directdata" : "indirectdata";

			// 2. 設定顯示與對齊
			if (ks[1] === 'H') {
				oTd.style.display = "none";
			} else {
				// 對齊
				var align = { "L": "left", "C": "center", "R": "right" }[ks[2]] || "left";
				oTd.style.textAlign = align;
				
				// 寬度
				var wdthln = jk.substr(lastIdx + 1, 3);
				if (wdthln) oTd.style.width = wdthln + "%";
				
				// 事件監聽
				attachEventListener(oTd, 'click', rowchoose, false);
			}

			// 3. 累加總計 (檢查 key 是否為 rcd_total)
			if (jk.substr(0, lastIdx - 4) === 'rcd_total') {
				var val = Number(cellValue);
				if (!isNaN(val)) queryttl += val;
			}
		}

		// 4. 新增 Checkbox 欄位 (每一列最後一格)
		var oTdCheck = oTr.insertCell(-1);
		oTdCheck.style.width = "40px";
		oTdCheck.style.display = "none";

		var myCheck = document.createElement('input');
		myCheck.type = "checkbox";
		myCheck.setAttribute("name", "chkbxmember1");
		attachEventListener(myCheck, 'click', chooserc, false);
		
		oTdCheck.appendChild(myCheck);
	}
 */	
 
 
    var oTable = document.getElementById("maintbody1");
	// 1. 使用 DocumentFragment 容器，先在記憶體中構建 DOM
	var fragment = document.createDocumentFragment();

	for (var i = 0; i < arr.length; i++) {
		var rowData = arr[i];
		var oTr = document.createElement("tr"); // 改用 createElement 效能更好
		oTr.setAttribute("name", "mainrow");
		cnt++;

		// 處理資料欄位
		for (var jk in rowData) {
			var oTd = document.createElement("td");
			var cellValue = rowData[jk];
			oTd.innerHTML = cellValue;

			// 解析欄位規則 (例如: ..._DSR_10)
			var lastUnderline = jk.lastIndexOf('_');
			var ruleStr = jk.substr(lastUnderline - 3, 3); // 取得 DSR 部分
			var ks = ruleStr.split(''); 
			// ks[0]: D/I, ks[1]: S/H, ks[2]: L/C/R

			// 設定樣式類別
			oTd.className = (ks[0] === "D") ? "directdata" : "indirectdata";

			if (ks[1] === 'H') {
				oTd.style.display = "none";
			} else {
				// 文字對齊
				var alignMap = { "L": "left", "C": "center", "R": "right" };
				oTd.style.textAlign = alignMap[ks[2]] || "left";

				// 寬度設定
				var wdthln = jk.substr(lastUnderline + 1, 3);
				oTd.style.width = wdthln + "%";

				// 事件綁定 (建議確認 attachEventListener 是否為自定義函數)
				if (typeof attachEventListener === "function") {
					attachEventListener(oTd, 'click', rowchoose, false);
				}
			}

			// 累加總金額
			if (jk.substr(0, lastUnderline - 4) === 'rcd_total') {
				queryttl += Number(cellValue) || 0;
			}

			oTr.appendChild(oTd);
		}

		// 2. 新增隱藏的 Checkbox 欄位
		var oTdCheck = document.createElement("td");
		oTdCheck.style.width = "40px";
		oTdCheck.style.display = "none";

		var myCheck = document.createElement('input');
		myCheck.type = "checkbox";
		myCheck.setAttribute("name", "chkbxmember1");
		
		if (typeof attachEventListener === "function") {
			attachEventListener(myCheck, 'click', chooserc, false);
		}

		oTdCheck.appendChild(myCheck);
		oTr.appendChild(oTdCheck);

		// 將整列加入 Fragment
		fragment.appendChild(oTr);
	}

	// 3. 最後一次性將所有資料掛載到 Table，只觸發一次重繪
	oTable.appendChild(fragment);
	////
	  var responseDiv=document.getElementById("serverResponse1");  			  
	  if(cnt>0){       //初始畫面呼叫
	     if(responseDiv.innerHTML=='Searching......'){	
		      responseDiv.setAttribute("style","color:#536a60;"); 
             responseDiv.innerHTML="搜尋到 "+String(cnt)+" 筆資料。" +String(cnt)+" record"+(cnt>1?"s":"")+" match your search. " +String(cnt)+" レコードを検索。";            		 
		 }else{
			 var seekrcd=document.getElementById("SEEK_BOTT");
		     seekrcd.setAttribute("style","visibility:visible;");
		     attachEventListener(seekrcd,"click",seekrec,false);
		 }			 
	      
		  chooserc(1);
		  scndttl.innerHTML=thousands(Math.round((queryttl + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt));		
	  }else{
	     if(responseDiv.innerHTML=='Searching......'){	
		    responseDiv.setAttribute("style","color:red;"); 
	   	    responseDiv.innerHTML="無此資料！Not found!検索できません。";
		 }else{
			 responseDiv.innerHTML="本月無出貨紀錄。"; 
			 var seekrcd=document.getElementById("SEEK_BOTT");
		    seekrcd.setAttribute("style","visibility:hidden;");
		    detachEventListener(seekrcd,"click",seekrec,false);
		 }			 
	     scndttl.innerHTML="0";
	  }		  
}

function choseExtraDeal(targetTrChildren){   //紀錄移動
    
    return true;			   
}
function rowchoseExtraDeal(targetRow){    //紀錄移動
    
    return true;			   
}	 

  
