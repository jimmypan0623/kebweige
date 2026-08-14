function srchStockNo(arr,ajTable) {       //顯示相關料號庫存明細
    let cnt=0;
	let array1=[];
	let array2=[];
	for(let i=0;i<arr.length;i++){				 
        var oTr=ajTable.insertRow(0);		
		cnt++;         
		
		for(let jk in arr[i]){		   
    let meta = parseFieldMeta(jk);
    var oTd = oTr.insertCell(oTr.cells.length); 
    oTd.innerHTML=arr[i][jk];	
    if (meta) {
        oTd.className = meta.isDirect ? "directdata" : "indirectdata";				
        oTd.style.width = meta.width;
        if(i==0 && !meta.isHidden){   
            array1.push(meta.name);  
            array2.push(meta.width); 
        }
        oTd.style.textAlign = meta.align;
        if (meta.isHidden) oTd.style.display = "none";

        if(meta.name=='庫存數量'){   // ← 移進來這裡
            if(arr[i]['列入計算_IHC_000']!='Y'){
                oTd.setAttribute("style",`width:${meta.width};text-align:right;text-decoration: line-through;color:#7f8890;`);
            }else{
                oTd.setAttribute("style",`width:${meta.width};text-align:right;`);
            }
        }
    }
}
        if(arr[i]['呆滯天數_IHC_000']>210 ){  //最後異動日期距今超過210天紅字		   
			oTr.setAttribute("style","font-weight:bold;color:#E60000;");			
		}else if(arr[i]['呆滯天數_IHC_000']>90 ){//最後異動日期距今超過90天低於210天棕色字
			oTr.setAttribute("style","font-weight:bold;color:#704214;");			
		}
	}	
   
    if(cnt==0){
	  blkshow("無庫存資料!");
	  //return false;
	}else{
	    var oTr=ajTable.insertRow(0);
	    for (let j = 0; j < array1.length; j++) {
		    var th = document.createElement('th'); //column		   
		    var text = document.createTextNode(array1[j]); //cell	
			th.style.width=array2[j];
		    th.appendChild(text);
		    oTr.appendChild(th);		
	    }						
	}			
}

function searchHaveshiped(arr, ajTable, screenType) {       //顯示相關料號未來預期異動
    let cnt=0;
	let array3=[];
	let array4=[];	 
	let initqty=sourceAccount(2,0);    //
	for(var i=arr.length-1;i>-1;i--){				 
	    var oTr=ajTable.insertRow(0);
		cnt++;         
		
		for(let jk in arr[i]){		   
		    var meta = parseFieldMeta(jk);
		    var oTd = oTr.insertCell(oTr.cells.length); 
			oTd.innerHTML=arr[i][jk];	
            if (meta) {
				oTd.className = meta.isDirect ? "directdata" : "indirectdata";				
				oTd.style.width = meta.width;
				if(i==0 && !meta.isHidden){   //第一輪就塞進去											  
					array3.push(meta.name);  //欄名
				    array4.push(meta.width); //欄寬
				}
				oTd.style.textAlign = meta.align;
				if (meta.isHidden) oTd.style.display = "none";
			}		
	
	    }	
		if( arr[i]['預期結餘_ISR_010']<0){  //預期結餘超過今天紅字
			oTr.setAttribute("style","font-weight:bold;color:#E60000;");				 
		}	 
        if( arr[i]['異動數量_ISR_010']>0){  //進倉靠左			
			oTr.style.fontStyle='oblique';
		}	
		// 依畫面來源決定是否比對「同一筆」變色，B01 不需要
		switch(screenType){
			case 'PLAN':   // C05/D08：從 F07 json 展開，序號含日期，需完整比對
				if(arr[i]['序號_IHC_000']==left(sourceAccount(3,0),2)+sourceAccount('0',0)){
					oTr.style.background = "linear-gradient(to bottom, #C2C2FF 0%, #8E8EFF 100%)";
				}
				break;
			case 'MAIN':   // C04/D04：主表本身，序號不含日期，需去掉尾端日期後比對
				if(arr[i]['序號_IHC_000'].slice(0, -10)== sourceAccount(1,0).substring(0, 2) +sourceAccount('0',1)){
					oTr.style.background = "linear-gradient(to bottom, #C2C2FF 0%, #8E8EFF 100%)";
				}
				break;
			case 'B01':    // 純查詢，不需標示「目前這一筆」
			default:
				break;
		}
	}	
	
	
    if(cnt==0){
	  blkshow("無資料!");
	  return false;
	}else{
	    var oTr=ajTable.insertRow(0);		
	    for (let j = 0; j < array3.length; j++) {
		    var th = document.createElement('th'); //column		   
		    var text = document.createTextNode(array3[j]); //cell	
			th.style.width=array4[j];
		    th.appendChild(text);
		    oTr.appendChild(th);		
	    }						
	}
}