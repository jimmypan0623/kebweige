// C04rgst.js 客戶訂單新增編及確認==========================================
// 檔案內部共用輔助工具 (Helper Functions)
// ==========================================

// 1. 取得畫面的 YYYY-MM-DD 日期
function _getUiDateStr() {
    var showTime = document.getElementById('currentTime');
    if (!showTime) return "";
    var txt = showTime.innerHTML.trim();
    if (txt.length < 10) return "";
    return txt.substring(0, 4) + '-' + txt.substring(5, 7) + '-' + txt.substring(8, 10);
}

// 2. 產生 ERP 專用的年兩碼+月份16進位字串 (例如 2026年7月 -> "267")
function _getYearHexMonth(dateStr) {
    if (!dateStr || dateStr.length < 7) return "";
    var yy = dateStr.substring(2, 4);
    var mm = parseInt(dateStr.substring(5, 7), 10).toString(16).toUpperCase();
    return yy + mm;
}

// 3. 嚴謹的四捨五入計算
function _roundTo(value, digits) {
    var factor = Math.pow(10, digits);
    return Math.round((value + Number.EPSILON) * factor) / factor;
}

// 4. 快速建立表單動態列的工具
function _createFormRow(ajTable, label, inputHtml, isHidden) {
	var oTr=ajTable.insertRow(0);    
    if (isHidden) oTr.style.display = "none";
    
    var oTdLabel = oTr.insertCell(0);
    oTdLabel.setAttribute('style', 'text-align:right; width:15%');
    oTdLabel.innerHTML = label;
    
       var oTdInput = oTr.insertCell(1);
   
       oTdInput.innerHTML = inputHtml;
    
    return { row: oTr, labelCell: oTdLabel, inputCell: oTdInput };
}


// ==========================================
// 主要業務邏輯函數
// ==========================================

// C04rgst.js 客戶訂單新增修改與其他查詢畫面
function blocksclose(clsevt) { // 關閉註冊彈出視窗
    var e = clsevt || window.event || (typeof event !== "undefined" ? event : null);
    var target = e ? getEventTarget(e) : null;
    var tabs = getElementsByAttribute('class', 'tab');	
    
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].setAttribute("accesskey", (i + 1).toString());
    }		
    
    if (target && tabs.length > 0 && tabs[0].checked) {
        if (target.value == "\u{274E}" && getAuth[2]()[0].INT_013 == 'Y') {
            var maintable = document.getElementById("maintbody1");		 		
            var tablerowindex = 0;
            if (maintable) {
                for (var i = 0; i < maintable.rows.length; i++) {			 
                    if (maintable.rows[i].cells[maintable.rows[i].cells.length - 1].childNodes[0].checked) {		 			 				 							
                        tablerowindex = i; // 記住是目前table的哪一列			 
                        break;
                    }
                } 		
                var query_no = (maintable.rows.length > 0) 
                    ? maintable.rows[tablerowindex].cells[1].innerHTML 
                    : "CAxxxxxxxx";
            }
            
            var queryNoEl = document.getElementById('queryno');
            if (queryNoEl) {			  
                var currentNo = queryNoEl.value.trim();	            	 
                if (currentNo !== "" && currentNo !== query_no) { 
                    var thtdy = _getUiDateStr();
                    var hexM = _getYearHexMonth(thtdy);
					const regexA = /^CA\d{2}[1-9A-C]\d{5}$/;	
					if('CA' + hexM == currentNo.substr(0,5) && regexA.test(currentNo)){					   
                       discardNoRec('CA' + hexM, currentNo);
					}
                } 
            }
        }
    }
    
    if (target && target.value == "\u{274E}" && document.getElementById('newPono') != null) {
        var currentNo = document.getElementById('newPono').value.trim();
        var thtdy = _getUiDateStr();
        var hexM = _getYearHexMonth(thtdy);
		const regexB = /^BC\d{2}[1-9A-C]\d{5}$/;
		if(regexB.test(currentNo)){
           discardNoRec('BC' + hexM, currentNo);
		}
    }
    
    var dropsheet = document.getElementById("myModal");
    if (dropsheet) {
        dropsheet.style.display = "none"; // 關閉視窗 		
        dropsheet.remove(); // 並將這些元素移除
    }
    
    var btns = getElementsByAttribute('class', 'btn');			 
    for (var i = 0; i < btns.length; i++) {		
        var lastChar = right(btns[i].title, 1);
        if (tabs.length > 0 && tabs[0].checked) {
            if (['M', 'I', 'B'].indexOf(lastChar) !== -1) {		      
                btns[i].removeAttribute("accesskey");
            } else {
                btns[i].setAttribute("accesskey", lastChar);
            }				
        } else {
            if (['J', 'K', 'T', 'V'].indexOf(lastChar) !== -1) {		      
                btns[i].removeAttribute("accesskey");
            } else {
                btns[i].setAttribute("accesskey", lastChar);
            }				
        }			
    }		       	
    return true;
}	

function sendFilePrc(updflg) { // 新增資料及修改程序       
    var tbjsn = [];
    var nonjsn = [];
    
    // ----資料寫入資料庫前過濾程序區-----//
    var tabs = getElementsByAttribute('class', 'tab');	
    var tbno = 0;	 
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].checked) {
            tbno = i;
            break;
        }
    }					 				
    ////
	// 如果是單身 (tbno == 1)，檢查並打包分批出貨明細
    if (tbno == 1) {
        var shipmentList = getShipmentDetailData();
        if (!shipmentList) {
            return false; // 驗證不通過，阻擋送出
        }
      
    }
	////
    var isTab0 = (tbno == 0);
    var c04elements = document.getElementsByName(isTab0 ? 'c03update' : 'c04update');
    var c04athments = document.getElementsByName(isTab0 ? 'c03others' : 'c04others');	
    
    var recordNo = document.getElementById("rcrd_no" + (tbno + 1).toString());
    
    for (var r = 0; r < c04athments.length; r++) { // 關聯資料
        nonjsn.push(c04athments[r].tagName.toUpperCase() == 'SPAN' ? c04athments[r].innerHTML : c04athments[r].value);		
    }
    for (var q = 1; q < c04elements.length; q++) { // 開始堆疊待異動資料陣列
         tbjsn.push(c04elements[q].value);    
    }
    for (var j = 1; j < c04elements.length - 1; j++) {
        if (c04elements[j].value.trim() == "" && !(j == 4 && tbno == 1)) {		
            if (j == 1) {
                c04elements[j].placeholder = "不得空白";
            } else {
                filtermsg(c04elements[j], "不得空白");
            }
            return false;
        } else {		      
            if (c04elements[j].nextSibling) {		
                if ((j != 4 && tbno != 0) && (j != 1 && tbno != 1)) { // 非人名與料號移除
                    c04elements[j].parentNode.removeChild(c04elements[j].nextSibling);
                }			    
            }
            if (tbno == 1 && (j == 2 || j == 3)) {	
                if (c04elements[j].value == 0) {
                    filtermsg(c04elements[j], "不得為 0");
                    return false;
                }
                if (j == 2 && updflg != 1) {
                    var limitAmt = sourceAccount(8, 1) * 1 + sourceAccount(9, 1) * 1 + sourceAccount(10, 1) * 1;
                    if (c04elements[2].value * 1 < limitAmt) {
                        filtermsg(c04elements[2], "不得小於已出量加取消量加開單未出量");
                        return false;
                    }
                }
            }
        }
    }
	
    // --------過濾區結束----------//	
    
    if (isTab0) { // 處理幣別名稱
        var selectElement = document.getElementById("crntopt");
        if (selectElement) {
            var slicelth = selectElement.value.length;		
            nonjsn.splice(3, 0, selectElement.options[selectElement.selectedIndex].text.slice(slicelth)); // 取得幣別名稱內容		
        }
    }else{	    
	      // 將分批出貨資料轉成 JSON 字串，放入送出陣列中
		 
        nonjsn.push(JSON.stringify(shipmentList));		
	    tbjsn.push(JSON.stringify(shipmentList));   //分批出貨陣列資料推入堆疊	

	}
    
    if (updflg == 1) { // 如果是新增     
        if (c04elements[1] && c04elements[1].value !== "") {
			
            tbjsn.push('0', '0');
            TableToJson(tbjsn, nonjsn, tbno);        
        } else {
            blkshow("欄位資料不齊全無法新增權限");
        }		
    } else { // 如果是修改
        var tablerowindex = sourceAccount(null, tbno); // 記住是目前table的哪一列	
        if (recordNo) tbjsn.push(recordNo.value);	
        tbjsn.push(tablerowindex);			
        TableToJson(tbjsn, nonjsn, tbno); 	
    }   
    blocksclose(); // 關掉原視窗   
    return true;	 	
}

function calculateTtl(tbno, maintable, i) {
    if (tbno == 1) { // 計算本單總金額
        var ttlMnyEl = document.getElementById('ttlmny');
        if (ttlMnyEl && maintable.rows[i]) {
            var ttlcnt = Number(ttlMnyEl.innerHTML);
            var crntsum = Number(maintable.rows[i].cells[5].innerHTML);							
            ttlMnyEl.innerHTML = ttlcnt - crntsum;
        }
    }
    return;
}

function billNoReCreate(currentNo) {
    if (getAuth[2]()[0].INT_099 == 'Y' && getAuth[2]()[0].INT_013 == 'Y') { // 如果是系統參數設為自動編號且刪掉號碼重用						       
        var thtdy = _getUiDateStr();
        var crntmth = _getYearHexMonth(thtdy);			
        if (currentNo.substring(2, 5) == crntmth) {
			const regexA = /^CA\d{2}[1-9A-C]\d{5}$/;	
			if(regexA.test(currentNo.trim())){			   
               discardNoRec('CA' + crntmth, currentNo.trim());
			}
        } 							   
    } 
    return;
}

async function c01CustomName(evt) {	
    var e = evt || window.event || (typeof event !== "undefined" ? event : null);
    var targetCustomNo = e ? getEventTarget(e) : null;	
    if (!targetCustomNo || !targetCustomNo.value) return;

    var sendSrcRec = new URLSearchParams();
    sendSrcRec.append("filename", targetCustomNo.value);
    var url = "C04/BKND/C01CustomName.php";			
    
    try {
        var response = await fetch(url, {
            method: "POST",
			cache: 'no-store', // 👈 關鍵：強制每次都向伺服器重新請求
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: sendSrcRec.toString()
        });
        if (!response.ok) throw new Error("網路回應失敗，狀態碼：" + response.status);

        var rsp = await response.json(); 	
        if (rsp && rsp[0]) {
            if (document.getElementById('customname')) document.getElementById('customname').value = rsp[0]['customname'] || '';   
            if (document.getElementById('customfullname')) document.getElementById('customfullname').value = rsp[0]['customfullname'] || '';   
        }
    } catch (error) {
        console.error("發生錯誤:", error);
    }
}

function modifyFields(tbno, txtword, ajTable, aWaitUpdate) { // 新增修改時出現之欄位
    if (tbno == 0) { // 如果異動表頭資料			      				
        _createFormRow(ajTable, '出貨指示:', "<input type='text' name='c03update' id='shipdirect' class='txt' style='width:80%;' maxlength='40' />");
        _createFormRow(ajTable, '交貨地點:', "<input type='text' name='c03update' id='dlvrplace' class='txt' style='width:90%;' maxlength='137' />");
        _createFormRow(ajTable, '客戶PO:', "<input type='text' name='c03update' id='custompo' class='txt' style='width:50%;' maxlength='20' />");
        
        // 幣別 Select 元素建立
        var sltRow = _createFormRow(ajTable, '幣別:', "");
        var slt4 = document.createElement("select");
        slt4.setAttribute("id", "crntopt");
        slt4.setAttribute("name", "c03update");
        sltRow.inputCell.appendChild(slt4);
        
        // 業務擔當
        var bsnRow = _createFormRow(ajTable, '業務擔當:', "<input type='text' name='c03update' id='whono' class='txt' style='width:30%;' maxlength='8' /><span name='c03others' id='whonameEx'></span>&nbsp;&nbsp;");
        var srchButton1 = document.createElement("input");				   
        srchButton1.setAttribute("type", "button");	
        srchButton1.setAttribute("class", "scopelook");				   
        srchButton1.style.background = "url('digits/brows1.png')";   
        attachEventListener(srchButton1, "click", srchshow, false);				
        bsnRow.inputCell.appendChild(srchButton1);
        
        _createFormRow(ajTable, '接單日期:', "<input type='date' name='c03update' id='querydate' class='txt' style='width:35%;' />");
        _createFormRow(ajTable, '客戶全名:', "<input type='text' name='c03others' id='customfullname' class='txt' style='width:50%;' maxlength='40' />", true);
        
        // 客戶簡稱
        var cstNameHtml = (txtword == 1) 
            ? "<input type='text' name='c03others' id='customname' class='txt' style='width:25%;' maxlength='8' />"
            : "<input type='text' name='c03others' id='customname' class='txt' style='background-color:#B9B9FF;width:25%;' maxlength='8' readOnly=true />";
        var cstNameRow = _createFormRow(ajTable, '客戶簡稱:', cstNameHtml);
        if (txtword == 1) {
            var srchButton2 = document.createElement("input");				   
            srchButton2.setAttribute("type", "button");	
            srchButton2.setAttribute("class", "scopelook");				   
            srchButton2.style.background = "url('digits/brows1.png')";   
            attachEventListener(srchButton2, "click", srchshow, false);				
            cstNameRow.inputCell.appendChild(srchButton2);
        }
        
        // 客戶代號
        var cstNoHtml = (txtword == 1)
            ? "<input type='text' name='c03update' id='customno' class='txt' style='width:20%;' maxlength='6' />"
            : "<input type='text' name='c03update' id='customno' class='txt' style='background-color:#B9B9FF;width:20%;' maxlength='6' readOnly=true />";
        var cstNoRow = _createFormRow(ajTable, '客戶代號:', cstNoHtml);
        if (txtword == 1) {
            var srchButton3 = document.createElement("input");				   
            srchButton3.setAttribute("type", "button");	
            srchButton3.setAttribute("class", "scopelook");				   
            srchButton3.style.background = "url('digits/brows1.png')";   
            attachEventListener(srchButton3, "click", srchshow, false);				
            cstNoRow.inputCell.appendChild(srchButton3);
        }
        
        // 訂單號碼
        var qryNoHtml = (txtword == 2)
            ? "<input type='text' name='c03update' id='queryno' class='txt' style='background-color:#B9B9FF;width:25%;' maxlength='10' readOnly=true />"
            : "<input type='text' name='c03update' id='queryno' class='txt' style='width:25%;' maxlength='10'/>";
        _createFormRow(ajTable, '訂單號碼:', qryNoHtml);
        
        if (txtword == 2) {
            optionitem(aWaitUpdate[5], slt4.id, 4, "C01/BKND/C00srch.php");
        } else {
            
			optionitem(getAuth[2]()[0].INT_011,slt4.id,4,"C01/BKND/C00srch.php");	
        }
        
        // 紀錄號碼 (隱藏列)
        _createFormRow(ajTable, '紀錄號碼', "<input type='text' name='c03update' id='rcrd_no1' class='txt' maxlength='14' autosize />", true);
        
    } else { // 異動表身資料	
        
  
	   _createFormRow(ajTable, '預定交期:', "<input type='date' name='c04update' id='deliverydate' class='txt' style='width:30%;display:none;' maxlength='10' />", true);
		_createFormRow(ajTable, '分批出貨:', "<div id='shipmentContainer'></div>"); // 放置分批出貨控制元件
	
        _createFormRow(ajTable, '客戶品號:', "<input type='text' name='c04update' id='custompartno' class='txt' style='width:50%;' maxlength='30'/>");
        _createFormRow(ajTable, '單價:', "<input type='number' name='c04update' value=0 id='price' class='txt' style='text-align:right;width:20%;' />");
        _createFormRow(ajTable, '訂單數量:', "<input type='number' name='c04update' id='queryqty' value=1 class='txt' style='text-align:right;width:20%;' />");
        // 品名規格
        var specHtml = (txtword == 2)
            ? "<input type='text' name='c04others' id='stockname' class='txt' style='background-color:#B9B9FF;width:70%;' maxlength='40' readOnly=true />"
            : "<input type='text' name='c04others' id='stockname' class='txt' style='width:70%;' maxlength='40' />";
        var specRow = _createFormRow(ajTable, '品名規格:', specHtml);
        if (txtword != 2) {
            var srchButton8 = document.createElement("input");				   
            srchButton8.setAttribute("type", "button");	
            srchButton8.setAttribute("class", "scopelook");				   
            srchButton8.style.background = "url('digits/brows1.png')";   
            attachEventListener(srchButton8, "click", srchshow, false);				
            specRow.inputCell.appendChild(srchButton8);
        }
        
        // 料品編號
        var stockHtml = (txtword == 2)
            ? "<input type='text' name='c04update' id='stockno' class='txt' style='background-color:#B9B9FF;width:60%;' maxlength='43' readOnly=true />"
            : "<input type='text' name='c04update' id='stockno' class='txt' style='width:60%;' maxlength='43' />";
        var stockRow = _createFormRow(ajTable, '料品編號:', stockHtml);
        if (txtword != 2) {
            var srchButton4 = document.createElement("input");				   
            srchButton4.setAttribute("type", "button");	
            srchButton4.setAttribute("class", "scopelook");				   
            srchButton4.style.background = "url('digits/brows1.png')";   
            attachEventListener(srchButton4, "click", srchshow, false);				
            stockRow.inputCell.appendChild(srchButton4);
        }
        
        // 紀錄號碼 (隱藏列)
        _createFormRow(ajTable, '紀錄號碼', "<input type='text' name='c04update' id='rcrd_no2' class='txt' maxlength='14' autosize />", true);
    }				 						 
}

function topAndWidthModify(dropsheet_content, dropsheet, txtword, tbno) {	 	 
    if (dropsheet_content) dropsheet_content.style.width = "60%"; 
    if (dropsheet) dropsheet.style.paddingTop = "25px";     
    return true;
}

function initFocusField(txtword, tbno, aWaitUpdate, notWaitdata, ajTable) {
    var thtdy = _getUiDateStr();
    
    switch (txtword) {
        case 1: // 新增
            if (tbno == 0) {					  
                if (document.getElementById("querydate")) document.getElementById("querydate").value = thtdy; 
                if (getAuth[2]()[0].INT_013 == 'Y') {       
                    objGetNo('queryno', 'CA' + _getYearHexMonth(thtdy));
                    var cstNo = document.getElementById("customno");
                    if (cstNo) {
                        cstNo.focus();	
                        attachEventListener(cstNo, "change", c01CustomName, false); 
                    }
                    var acntNo1 = document.getElementById("whono");				 
                    if (acntNo1) attachEventListener(acntNo1, "change", a01AccountName, false); 
                } else {	 
                    if (document.getElementById("queryno")) document.getElementById("queryno").focus();
                }   
            } else {
                if (document.getElementById("deliverydate")) document.getElementById("deliverydate").value = thtdy; 												
                if (document.getElementById("stockno")) document.getElementById("stockno").focus();
				// 【新增】：初始化分批出貨元件
                initShipmentContainer(1,1);
            }
            break;
        case 2: // 修改
            var rcrdEl = document.getElementById("rcrd_no" + (tbno + 1).toString());
            if (rcrdEl) rcrdEl.value = aWaitUpdate[0];       
            
            if (tbno == 0) {
                if (document.getElementById("querydate")) document.getElementById("querydate").focus();				 			 				  
                if (document.getElementById('customname')) document.getElementById('customname').value = notWaitdata[0];
                if (document.getElementById('customfullname')) document.getElementById('customfullname').value = notWaitdata[1];
                if (document.getElementById('whonameEx')) document.getElementById('whonameEx').innerHTML = notWaitdata[2];
                var acntNo1 = document.getElementById("whono");				 
                if (acntNo1) attachEventListener(acntNo1, "change", a01AccountName, false); 
            } else {
                if (document.getElementById("queryqty")) document.getElementById("queryqty").focus();				 			 				  
                if (document.getElementById('stockname')) document.getElementById('stockname').value = notWaitdata[0];
				// 【新增】：修改時載入分批出貨元件
                var initQty = (aWaitUpdate && aWaitUpdate[2]) ? aWaitUpdate[2] : 1;
                initShipmentContainer(initQty,2);
            }
            
            var editinit = document.getElementsByName(tbno == 0 ? 'c03update' : 'c04update');
            for (var k = 0; k < editinit.length; k++) { 
                if (aWaitUpdate[k] !== undefined) editinit[k].value = aWaitUpdate[k];
            }							
			//dlvdte();
            break;	
        case 6: // 轉出貨單
            objGetNo('newPono', 'BC' + _getYearHexMonth(thtdy));				 				
            break;			
        case 7: // 搜尋   
            var txtseek = document.getElementById('searchWords');
            if (txtseek) {
                txtseek.focus();
                attachEventListener(txtseek, 'keypress', textKeypress, false);
            }
            break;
    }		
}

function colomnAfterChange(tbno, oTr, args, nongs, rsp) { // TableToJson 新增紀錄後呼叫
    var rnddgt = getAuth[2]()[0].INT_069;     
    var ttlMnyEl = document.getElementById('ttlmny');
    var ttlcnt = ttlMnyEl ? Number(ttlMnyEl.innerHTML) : 0;
    var fldidx = 0;
    var argsNo = 0;
    var nongsNo = 0;	
    
    while (rsp.fldsatrr[fldidx]) {
        var oTd = oTr.insertCell(oTr.cells.length); 			
        if (rsp.fldsatrr[fldidx][0] == 'directdata') {
            oTd.innerHTML = args[argsNo];
            argsNo++;
        } else {		
            if (tbno == 0) {
                if (fldidx == 2) oTd.innerHTML = nongs[0]; // 客戶簡稱
                if (fldidx == 3) oTd.innerHTML = nongs[1]; // 客戶全稱
                if (fldidx == 6) oTd.innerHTML = nongs[2]; // 業務名稱
                if (fldidx == 8) oTd.innerHTML = nongs[3]; // 幣別名稱
                if (fldidx == 12) { nongs[4] = 'N'; oTd.innerHTML = 'N'; } // 確認
                if (fldidx == 13) { nongs[5] = 'N'; oTd.innerHTML = 'N'; } // 轉單
            }
            if (tbno == 1) {
                if (fldidx == 1) { oTd.innerHTML = nongs[nongsNo]; nongsNo++; } // 品名
                if (fldidx == 4) { // 小計
                    var subTotal = _roundTo(args[1] * args[2], rnddgt);
                    oTd.innerHTML = subTotal;			
                    ttlcnt += subTotal;	
                    if (ttlMnyEl) ttlMnyEl.innerHTML = ttlcnt; 
                }
                if (fldidx == 7 || fldidx == 8 || fldidx == 9) oTd.innerHTML = 0; // 開單未出等
                if (fldidx == 10) oTd.innerHTML = args[1] * 1; // 未出數量
				if (fldidx == 11) oTd.innerHTML = nongs[1]; // 分批出貨
				
            }
        }
        oTd.setAttribute("class", rsp.fldsatrr[fldidx][0]);
        if (rsp.fldsatrr[fldidx][1] == 'none') {
            oTd.setAttribute("style", "display:none;");		
        } else {
            oTd.style.textAlign = rsp.fldsatrr[fldidx][2];				   	
            oTd.style.width = rsp.fldsatrr[fldidx][3] + "%";				  
        }					 		
        fldidx++;
    }				
    if (tbno == 0) oTr.setAttribute("style", "font-weight:bold;color:#704214;");			 
    
    var oTdLast = oTr.insertCell(oTr.cells.length);	
    oTdLast.setAttribute("class", "directdata");					   
    oTdLast.innerHTML = rsp.lastupdate;	
    oTdLast.setAttribute("style", "display:none;"); 
}

function colomnContextChange(tbno, args, nongs, arglth, rsp) { // TableToJson 修改紀錄後呼叫
    var rnddgt = getAuth[2]()[0].INT_069;     
    var maintable = document.getElementById(tbno == 0 ? "maintbody1" : "maintbody2");
    if (!maintable) return;
    
    var fldidx = (tbno == 0) ? 4 : 2;
    var argsNo = (tbno == 0) ? 2 : 1;
    var nongsNo = (tbno == 0) ? 2 : 1;	
    var targetRow = maintable.rows[args[arglth - 1]];
    if (!targetRow) return;
    
    var ttlMnyEl = document.getElementById('ttlmny');
    var ttlcnt = Number(ttlMnyEl.innerHTML);   //Math.notWaitdata ? 0 : 
    
    if (tbno == 1) {
        ttlcnt -= Number(targetRow.cells[5].innerHTML);
		
    }
    
    while (rsp.fldsatrr[fldidx]) {			
        if (rsp.fldsatrr[fldidx][0] == 'directdata') {
            targetRow.cells[fldidx + 1].innerHTML = args[argsNo];				
            argsNo++;
        } else {				
            if (tbno == 0) {
                targetRow.cells[fldidx + 1].innerHTML = nongs[nongsNo];
            }
            if (fldidx == 4 && tbno == 1) {
                var subTotal = _roundTo(args[1] * args[2], rnddgt);
                ttlcnt += subTotal;					
                if (ttlMnyEl) ttlMnyEl.innerHTML = ttlcnt; 
                
                targetRow.cells[fldidx + 1].innerHTML = subTotal;	
            }	
            if (fldidx == 10 && tbno == 1) {	
                targetRow.cells[fldidx + 1].innerHTML = args[1] * 1 - targetRow.cells[fldidx - 2].innerHTML * 1 - targetRow.cells[fldidx - 1].innerHTML * 1;	  
            }
			if (fldidx == 11 && tbno == 1) {
    
			   targetRow.cells[fldidx + 1].innerHTML =nongs[1];
			}				
            
        }         
        fldidx++;
    }		
	
    targetRow.cells[fldidx + 1].innerHTML = rsp.lastupdate;
	 if (tbno == 1) {
		
	   rowchoseSecond(targetRow); 
	 }
}

function transConfirm(oTd) { 			 
    oTd.innerHTML = "<input type='text' name='b04update' id='newPono' class='txt' style='display:none;' maxlength='10'/>"; 				 
    return true;
}   

function page2Detail01(ajTable) {
    if (!ajTable || !ajTable.childNodes[0] || !ajTable.childNodes[0].childNodes[0]) return;
    ajTable.childNodes[0].childNodes[0].style.backgroundColor = 'white';
    ajTable.id = "srchTable";		
    ajTable.className = "gridlist";               
    
    var url = "C04/BKND/C10srch.php";    
    var fatherKey = document.getElementById("fatherkey1") ? document.getElementById("fatherkey1").innerHTML : "";
    var queryString = "filename=" + fatherKey + '|' + sourceAccount(1, 1);
    
    fetch(url, {
        method: 'POST',
		cache: 'no-store', // 👈 關鍵：強制每次都向伺服器重新請求
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: queryString
    })
    .then(res => res.json())
    .then(rsp => srchOutRcd(rsp, ajTable)); 
}

function page2Detail02(ajTable){
	ajTable.childNodes[0].childNodes[0].style.backgroundColor='white';
    ajTable.id="srchTable";
	ajTable.className="gridlist";                 	 		          				 
	 var url="B01/BKND/B11srch.php";   	    		    
	 var queryString ="filename="+sourceAccount(1,1);
	  
	 
	fetch(url, {
     method: 'POST',
	 cache: 'no-store', // 👈 關鍵：強制每次都向伺服器重新請求
     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: queryString
    })
     .then(res => res.json())
     .then(rsp => srchStockNo(rsp, ajTable));
}
async function page2Detail03(ajTable) {    // 查看預期結餘
    ajTable.childNodes[0].childNodes[0].style.backgroundColor = 'white';
    ajTable.id = "srchTable";   
    ajTable.className = "gridlist";                         
                        
    const account = sourceAccount(1, 1);

    try {
        // 1. 呼叫後端 API 查詢 INVENTORY (假設後端有提供相應的查詢接口，如 C05/BKND/getInventory.php)
        const invRes = await fetch("C05/BKND/getInventory.php", {
            method: 'POST',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `account=${encodeURIComponent(account)}`
        });

        const invData = await invRes.json();
        // 取得計算後的 SUM(b11.F04) 數值，若無資料則預設為 0
        const INVENTORY = invData.inventory || 0; 
        let qtyElem = document.getElementById('runningQtyVal');
	if (qtyElem) {
		qtyElem.textContent = INVENTORY;
	}
        // 2. 帶入 INVENTORY 數值後發送主請求
        const queryString = `filename=${encodeURIComponent(account)}|${INVENTORY}`;    

        const mainRes = await fetch("C05/BKND/E07srch.php", {
            method: 'POST',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: queryString
        });

        const rsp = await mainRes.json();
        searchHaveshiped(rsp,ajTable,'MAIN');

    } catch (error) {
        console.error("查詢過程發生錯誤:", error);
    }
}

function srchOutRcd(arr, ajTable) { // 搜尋相關料號
    if (!arr || !ajTable) return;
    var cnt = 0;
    var array = [];
    var array4 = [];
    
    for (var i = 0; i < arr.length; i++) {				 
        var oTr = ajTable.insertRow(0);
		
        cnt++;          
        for (var jk in arr[i]) {        
            var meta = parseFieldMeta(jk);
            var oTd = oTr.insertCell(oTr.cells.length); 
            oTd.innerHTML = arr[i][jk]; 
            if (meta) {
                oTd.className = meta.isDirect ? "directdata" : "indirectdata";				
                oTd.style.width = meta.width;
                if (i == 0) { 				  
                    array.push(meta.name); // 欄名
                    array4.push(meta.width); // 欄寬
                }
                oTd.style.textAlign = meta.align;
                if (meta.isHidden) oTd.style.display = "none";
            }		
        }     
    }   
    
     var oTrHeader = ajTable.insertRow(0);
	//var oTrHeader=ajTable.insertRow(ajTable,ajTable.length);
    for (var j = 0; j < array.length; j++) {
        var th = document.createElement('th');    
        var text = document.createTextNode(array[j]); 
        th.style.width = array4[j];
        th.appendChild(text);
        oTrHeader.appendChild(th);		
    }						
}

function addNewRecordHint(tbno) { return (tbno == 0) ? "請輸入客戶訂單表頭資料：" : "請輸入客戶訂單內容資料："; }
function editRecordHint(tbno) { return (tbno == 0) ? "修改客戶訂單表頭資料：" : "修改客戶訂單內容資料："; }
function searchKeyHint(tbno) { return (tbno == 0) ? "搜尋單頭欄位選擇" : "搜尋單身欄位選擇"; }

function transRecordHint(tbno) {
    var fatherKeyEl = document.getElementById('fatherkey1');
    var fatherKey = fatherKeyEl ? fatherKeyEl.innerHTML : "";
    return (tbno == 0) 
        ? '客戶訂單:' + sourceAccount(1, tbno) + ",轉出貨單?"
        : '客戶訂單:' + fatherKey + ",轉出貨單?";
}

function page2OtherWindow1() {
    var fatherKey = document.getElementById("fatherkey1") ? document.getElementById("fatherkey1").innerHTML : "";
    return "\u{1F4D1}" + fatherKey + "\u{A0}\u{1F4E6}:\u{300C}" + sourceAccount(1, 1) + "\u{300D}的出貨紀錄";
}
function page2OtherWindow2() {
    return "\u{1F4E6}:\u{300E}"+sourceAccount(1,1)+"\u{300F}\u{26A1}:\u{300E}"+sourceAccount(2,1)+"\u{300F}\u{A0}\u{A0}之庫存明細";
}
function page2OtherWindow3() {
    return "\u{A0}\u{1F4E6}:\u{300C}" + sourceAccount(1, 1) + "\u{300D}預期異動明細\u{A0}\u{A0}\u{1F4C4}目前庫存:<span id='runningQtyVal'></span>";
}

function srcArgobj(srcId) {
    var srcEl = document.getElementById(srcId);
    var val = srcEl ? srcEl.value : "";
    
    if (srcId == 'customno' || srcId == 'customname') {
        var qrystring = (srcId == 'customno' ? "c01.F01" : "c01.F05") + "|" + val; 
        var tttlt = (srcId == 'customno' ? '請選擇客戶編號' : '請選擇客戶簡稱');
        return { "headtitle": tttlt, "drpshtWidth": "28%", "urlPth": "C04/BKND/C01srch.php", "clickfunc": chsecust, "qryString": qrystring, "mendwidth": "calc( 100% - 1em )" };
    } 
    if (srcId == 'whono') {
        return { "headtitle": "請選取業務人員帳號姓名", "drpshtWidth": "28%", "urlPth": "C01/BKND/A01srch.php", "clickfunc": chseprg1, "qryString": val, "mendwidth": "calc( 100% - 0em )" };
    } 
    
    var keyDscrpt = document.getElementById('keydscrpt1') ? document.getElementById('keydscrpt1').innerHTML : "";
    var crncy = document.getElementById('crncy') ? document.getElementById('crncy').innerHTML : "";
    var qryField = (srcId == 'stockno') ? "b01.F01" : "b01.F02";
    var tttlt = (srcId == 'stockno') ? "請選取料號" : "請選取品名";
    
    var qrystring = qryField + "," + val + "," + left(keyDscrpt, 6) + "," + crncy; 			 
    return { "headtitle": tttlt, "drpshtWidth": "80%", "urlPth": "C04/BKND/B01srch.php", "clickfunc": stckchg, "qryString": qrystring, "mendwidth": "calc( 100% - 1em )" };
}


function chseprg1(event)  //選擇業務
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);	 
	var stuffNo=document.getElementById('whono');
	stuffNo.value="";
    var stuffName=document.getElementById('whonameEx');		
    if(stuffName)	 
	    stuffName.innerHTML="";
	var maintable=document.getElementById("stuffTbody");  
	for(var i=0;i< maintable.rows.length; i++){			 
		if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			 stuffNo.value=maintable.rows[i].cells[0].innerHTML;								 
			 stuffName.innerHTML=maintable.rows[i].cells[1].innerHTML;				
			 break;
		  }				 
	}             
	srchblkclose(event);	
 
	return true;
}	

function stckchg(event)  //選擇料號
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);	 
	var stockNo=document.getElementById('stockno');
	stockNo.value="";
    var stockName=document.getElementById('stockname');			
	stockName.value="";  	
	var unitName=document.getElementById('unitname');
	var orderPrice=document.getElementById('price');
	var orderQty=document.getElementById('queryqty');
	var custstockno=document.getElementById('custompartno');
	var dlvdate=document.getElementById('deliverydate');		
	var maintable=document.getElementById("stuffTbody");  
	for(var i=0;i< maintable.rows.length; i++){			 
		if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			 stockNo.value=maintable.rows[i].cells[0].innerHTML;								 
			 stockName.value=maintable.rows[i].cells[1].innerHTML;	
			 if(unitName){
				unitName.innerHTML=maintable.rows[i].cells[2].innerHTML;
			 }
		
			 if(orderQty){
				 orderQty.value=maintable.rows[i].cells[4].innerHTML;
				 document.getElementsByClassName('shipment-qty')[0].value=orderQty.value>0?orderQty.value:1;
			 }
			 
			 if(custstockno){
				custstockno.value=maintable.rows[i].cells[5].innerHTML;
			 }  
			  if(orderPrice){
				 orderPrice.value=maintable.rows[i].cells[7].innerHTML;
			 }
			
			if(dlvdate){
				var outdate=new Date(sourceAccount(5,0)); //接單日
			 
				var endday=outdate.addDays(parseInt(maintable.rows[i].cells[8].innerHTML));
			
				 dlvdate.value=endday.getFullYear()+'-'+MyMonth(endday.getMonth())+'-'+((endday.getDate()<10) ? "0" : "") + endday.getDate();	
			     document.getElementsByClassName('shipment-date')[0].value=dlvdate.value;
			 }
			 break;
		}				 
	}             
	srchblkclose(event);	
	return true;
}	

function chsecust(event)  //選擇客戶
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);	 
	var custNo=document.getElementById('customno');
	custNo.value="";
    var custName=document.getElementById('customname');			
	custName.value="";
	var custFullName=document.getElementById('customfullname');
	var rprsntno=document.getElementById('whono');
	var rprsntname=document.getElementById('whonameEx');
	var crnttpe=document.getElementById('crntopt');
	var contactman=document.getElementById('winman');
    var shipway=document.getElementById('howship');
	var paymenttp=document.getElementById('howpay');
	var shipplace=document.getElementById('dlvrplace');
	var shipdirect=document.getElementById('shipdirect');
	var maintable=document.getElementById("stuffTbody");  
	for(var i=0;i< maintable.rows.length; i++){			 
		if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			custNo.value=maintable.rows[i].cells[0].innerHTML;								 
			custName.value=maintable.rows[i].cells[1].innerHTML;
			if(rprsntno){
				rprsntno.value=maintable.rows[i].cells[2].innerHTML;
			}
			if(rprsntname){
			   rprsntname.innerHTML=maintable.rows[i].cells[3].innerHTML;
			}
			if(crnttpe){
				crnttpe.value=maintable.rows[i].cells[4].innerHTML;
			}
			if(contactman){
				contactman.value=maintable.rows[i].cells[5].innerHTML;
			}
			if(shipway){
				shipway.value=maintable.rows[i].cells[6].innerHTML;
			}
			if(custFullName){
			    custFullName.value=maintable.rows[i].cells[11].innerHTML;
			}  
			if(paymenttp){
				var tpy=maintable.rows[i].cells[7].innerHTML;
				switch (tpy){				        
					case '0' :{
						 tpy="現結";
						 break;
					}
					case '1' :{
						 tpy="月結";
						 break;
					}
					case '2' :{
						 tpy="次月結";
						 break;
					}
					case '3' :{
						 tpy="T/T";
						 break;
					}
					default: {
					   tpy='現結';
					  break;
				   }					
				}	 
				paymenttp.value=tpy+(maintable.rows[i].cells[8].innerHTML==0?'':maintable.rows[i].cells[8].innerHTML+'天');
			}	
			if(shipplace){
				 shipplace.value=maintable.rows[i].cells[9].innerHTML;
			}
				if(shipdirect){
				 shipdirect.value=maintable.rows[i].cells[10].innerHTML;
				}  
			break;
		}						   
	}             
	srchblkclose(event);	
	return true;
}	