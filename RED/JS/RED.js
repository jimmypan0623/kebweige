function getProfile(arr,cmpnme) {  

	// ★防呆1:避免同一時間被重複呼叫(例如快速連續觸發、非預期的重入)
	if(getProfile._isRendering){
		console.warn('getProfile 正在執行中，本次呼叫已略過');
		return;
	}
	getProfile._isRendering = true;

	try{
		if(getAuth[2]().length<1){	 	
			// ★防呆2:確認 cmpnme 為合法陣列，避免資料格式異常導致整段崩潰
			if(Array.isArray(cmpnme)){
				var paraObj={};		
				for(var j=0;j<cmpnme.length;j++){	       
					paraObj[cmpnme[j]['paraNo']]=cmpnme[j]['cngpra'];
				}
				getAuth[2](paraObj);	
			}else{
				console.warn('getProfile: cmpnme 非陣列格式，略過系統參數設定');
			}

			// ★防呆3:確認 arr 為合法陣列，避免 getAuth[7] 被寫入非陣列值
			if(Array.isArray(arr)){
				getAuth[7]=arr;  //將此帳號的權限功能主選單存起來
			}else{
				console.warn('getProfile: arr 非陣列格式，略過選單資料更新');
			}
		}    

		// ★防呆4:確認公司名稱欄位存在再寫入，避免畫面尚未就緒時報錯
		var companyNameEl=document.getElementById('company_name');
		if(companyNameEl && getAuth[2]()[0]){
			companyNameEl.innerHTML="\u{1F4FF}"+getAuth[2]()[0].INT_000;   //顯示公司名稱
		}

		var authField='';    
		var pageNames='';
		var tmpItemName='';
		var mainPrgNo=' ';	

		// ★防呆5:確認 mainUl 存在，不存在就直接中止，避免後續 appendChild 報錯
		var mainUl=document.getElementById("listUL");    	 
		if(!mainUl){
			console.warn('getProfile: 找不到 listUL，選單無法渲染');
			return;
		}
		mainUl.innerHTML = '';   //重建前先清空舊選單內容

		// ★防呆6:確認 getAuth[7] 為陣列且有資料，沒資料就不進入迴圈（避免殘留半成品選單）
		if(!Array.isArray(getAuth[7]) || getAuth[7].length<1){
			console.warn('getProfile: 選單資料為空，不進行渲染');
			return;
		}

		var LastFunc=getAuth[1]()[1]; //紀錄上一次選擇的作業項目;		  	
		for(var i=0;i<getAuth[7].length;i++){		
			var oUl; // ★防呆7:每輪迴圈明確宣告，避免資料異常時沿用上一輪殘留的 oUl
			for(var jk in getAuth[7][i]){	
				if(jk=='prg_no'){
					if(mainPrgNo!=getAuth[7][i][jk].slice(0,1)){		
						 var oLiFather=document.createElement('li');
						 oLiFather.setAttribute("class","hasmenu");
						 attachEventListener(oLiFather,"click",redmenuchange,false);					 
						 var newA=document.createElement("a");
						 newA.setAttribute("href","javascript:void(0)");					 
						 newA.appendChild(document.createTextNode(getAuth[7][i][jk].slice(0,1)+'.'+summaryName(getAuth[7][i][jk].slice(0,1))));					 
						 oLiFather.appendChild(newA);							 
						 mainUl.appendChild(oLiFather)
						 oUl=document.createElement('ul');	
						 if(LastFunc && left(getAuth[7][i][jk],1)==left(LastFunc,1)){  //如果從子功能返回主選單恢復原狀		                        				
							oUl.setAttribute("class","myShow");		   						 
						 }else{
							oUl.setAttribute("class","myHide");								 	 
						 }											 
						 oLiFather.appendChild(oUl);
						 mainPrgNo=getAuth[7][i][jk].slice(0,1);	
					}							
					if(LastFunc && getAuth[7][i][jk]==left(LastFunc,3)){		
						 oUl.parentNode.childNodes[0].style.backgroundImage="url('digits/up.gif')";												 
						window.scrollTo(0,0);  //先置頂	
						oUl.scrollIntoView({	 
						 behavior: 'smooth'
						}); 							 
					}				 		
					tmpItemName=getAuth[7][i][jk]+'.';	
				}else if(jk=='dscrpt'){
					// ★防呆8:確認 oUl 已建立才繼續，避免資料缺 prg_no 時對 undefined 操作
					if(!oUl) continue;

					tmpItemName+=getAuth[7][i][jk];
					var oLison=document.createElement('li');               
					var newB=document.createElement("a");				 
					newB.setAttribute("href","javascript:void(0)"); 
					newB.appendChild(document.createTextNode(tmpItemName));					 
					oLison.appendChild(newB);				     	
					attachEventListener(oLison,"click",excuteFun,false);
					oUl.appendChild(oLison);
					tmpItemName='';
					authField='';	
					pageNames='';			 
				}else{								
					authField+=getAuth[7][i][jk]+',';
				}					  
			}		     		
			// ★防呆9:確認 oLison 存在才建立 span，避免該筆資料格式異常時報錯
			if(typeof oLison !== 'undefined' && oLison){
				var newSpan=document.createElement('span');
				newSpan.setAttribute("style","display:none;");
				newSpan.appendChild(document.createTextNode(authField.slice(0,-1)));
				oLison.appendChild(newSpan);			
			}
		}
		var oLiUncle=document.createElement('li');   //最底下再新增一個li tag修改密碼
		attachEventListener(oLiUncle,"click",blockPsdshow,false);  //修改密碼按鈕程序		   
		var newC=document.createElement("a");
		newC.setAttribute("href","javascript:void(0)");
		newC.appendChild(document.createTextNode("變更登入系統密碼"));
		oLiUncle.appendChild(newC);
		mainUl.appendChild(oLiUncle);	      
		if(getAuth[1]().length>0){
		  delCookie('useraccount');	
		}		
	}finally{
		// ★防呆1收尾:無論成功或中途 return/例外，都要釋放鎖，避免下次呼叫被永久卡死
		getProfile._isRendering = false;
	}
}

function summaryName(dtshow) {
    const names = {
        'A': '系統設定', 'B': '庫存管理', 'C': '營業管理', 
        'D': '採購管理', 'E': '生產管理', 'F': '料表管理', 
        'G': '成本管理', 'K': '發票帳款', 'Q': '品保文管', 'S': '出勤管理'
    };
    return names[dtshow] || '其他';
}