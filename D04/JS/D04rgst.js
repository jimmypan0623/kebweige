// ==========================================
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
    var oTr = ajTable.insertRow(0);    
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

// D04rgst.js 採購訂單新增修改與其他查詢畫面
function blocksclose(clsevt) { // 關閉註冊彈出視窗
    var e = clsevt || window.event || (typeof event !== "undefined" ? event : null);
    var target = e ? getEventTarget(e) : null;
    var tabs = getElementsByAttribute('class', 'tab');	
    
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].setAttribute("accesskey", (i + 1).toString());
    }		
    
    if (tabs.length > 0 && tabs[0].checked) {
        if (target && target.value == "\u{274E}" && getAuth[2]()[0].INT_111 == 'Y') {
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
                    : "DAxxxxxxxx";
            }
            
            var queryNoEl = document.getElementById('queryno');
            if (queryNoEl) {			  
                var currentNo = queryNoEl.value.trim();	            	 
                if (currentNo !== "" && currentNo !== query_no) { 
                    var thtdy = _getUiDateStr();
                    var hexM = _getYearHexMonth(thtdy);
					const regexA = /^DA\d{2}[1-9A-C]\d{5}$/;
					if('DA' + hexM == currentNo.substr(0,5) && regexA.test(currentNo)){
                       discardNoRec('DA' + hexM, currentNo);
					}
                } 
            }
        }
    }
    
    if (target && target.value == "\u{274E}" && document.getElementById('newPono') != null) {
        var currentNo = document.getElementById('newPono').value.trim();
        var thtdy = _getUiDateStr();
        var hexM = _getYearHexMonth(thtdy);
		const regexB = /^BA\d{2}[1-9A-C]\d{5}$/;
		if(regexB.test(currentNo)){
           discardNoRec('BA' + hexM, currentNo);
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
    
    var isTab0 = (tbno == 0);
    var d04elements = document.getElementsByName(isTab0 ? 'd03update' : 'd04update');
    var d04athments = document.getElementsByName(isTab0 ? 'd03others' : 'd04others');	
    
    var recordNo = document.getElementById("rcrd_no" + (tbno + 1).toString());
    
    for (var r = 0; r < d04athments.length; r++) { // 關聯資料
        nonjsn.push(d04athments[r].tagName.toUpperCase() == 'SPAN' ? d04athments[r].innerHTML : d04athments[r].value);		
    }
    for (var q = 1; q < d04elements.length; q++) { // 開始堆疊待異動資料陣列
         tbjsn.push(d04elements[q].value);    
    }
    for (var j = 1; j < d04elements.length - 1; j++) {
        if (d04elements[j].value.trim() == "" && !(j == 4 && tbno == 1) && !((j == 6 || j == 8) && tbno == 0)) {		
            if (j == 1) {
                d04elements[j].placeholder = "不得空白";
            } else {
                filtermsg(d04elements[j], "不得空白");
            }
            return false;
        } else {		      
            if (d04elements[j].nextSibling) {		
                if ((j != 4 && tbno != 0) && (j != 1 && tbno != 1)) { // 非人名與料號移除
                    d04elements[j].parentNode.removeChild(d04elements[j].nextSibling);
                }			    
            }
            if (tbno == 1 && (j == 2 || j == 3)) {	
                if (d04elements[j].value == 0) {
                    filtermsg(d04elements[j], "不得為 0");
                    return false;
                }
                if (j == 2 && updflg != 1) {
                    var limitAmt = sourceAccount(8, 1) * 1 + sourceAccount(9, 1) * 1 + sourceAccount(10, 1) * 1;
                    if (d04elements[2].value * 1 < limitAmt) {
                        filtermsg(d04elements[2], "不得小於已出量加取消量加開單未出量");
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
    }
    
    if (updflg == 1) { // 如果是新增     
        if (d04elements[1] && d04elements[1].value !== "") {
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
    if (getAuth[2]()[0].INT_099 == 'Y' && getAuth[2]()[0].INT_111 == 'Y') { // 如果是系統參數設為自動編號且刪掉號碼重用						       
        var thtdy = _getUiDateStr();
        var crntmth = _getYearHexMonth(thtdy);			
        if (currentNo.substring(2, 5) == crntmth) {
			const regexA = /^DA\d{2}[1-9A-C]\d{5}$/;
		    if(regexA.test(currentNo.trim())){
               discardNoRec('DA' + crntmth, currentNo.trim());
		    }
		} 							   
    } 
    return;
}

async function d01VendorName(evt) {	
    var e = evt || window.event || (typeof event !== "undefined" ? event : null);
    var targetVendorNo = e ? getEventTarget(e) : null;	
    if (!targetVendorNo || !targetVendorNo.value) return;

    var sendSrcRec = new URLSearchParams();
    sendSrcRec.append("filename", targetVendorNo.value);
    var url = "D04/BKND/D01VendorName.php";			
    
    try {
        var response = await fetch(url, {
            method: "POST",
            cache: 'no-store', // 強制每次都向伺服器重新請求
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: sendSrcRec.toString()
        });
        if (!response.ok) throw new Error("網路回應失敗，狀態碼：" + response.status);

        var rsp = await response.json(); 	
        if (rsp && rsp[0]) {
            if (document.getElementById('vendorname')) document.getElementById('vendorname').value = rsp[0]['vendorname'] || '';   
            if (document.getElementById('vendorfullname')) document.getElementById('vendorfullname').value = rsp[0]['vendorfullname'] || '';   
        }
    } catch (error) {
        console.error("發生錯誤:", error);
    }
}

function modifyFields(tbno, txtword, ajTable, aWaitUpdate) { // 新增修改時出現之欄位
    if (tbno == 0) { // 如果異動表頭資料			      				
        _createFormRow(ajTable, '運送方式:', "<input type='text' name='d03update' id='howship' class='txt' style='width:50%;' maxlength='40' />");
        _createFormRow(ajTable, '交貨地點:', "<input type='text' name='d03update' id='dlvrplace' class='txt' style='width:90%;' maxlength='100' />");
        _createFormRow(ajTable, '需求用途:', "<input type='text' name='d03update' id='whypurchase' class='txt' style='width:60%;' maxlength='50' />");
        
        // 幣別 Select 元素建立
        var sltRow = _createFormRow(ajTable, '幣別:', "");
        var slt4 = document.createElement("select");
        slt4.setAttribute("id", "crntopt");
        slt4.setAttribute("name", "d03update");
        sltRow.inputCell.appendChild(slt4);
        
        // 採購人員
        var bsnRow = _createFormRow(ajTable, '採購人員:', "<input type='text' name='d03update' id='whono' class='txt' style='width:30%;' maxlength='8' /><span name='d03others' id='whonameEx'></span>&nbsp;&nbsp;");
        var srchButton1 = document.createElement("input");				   
        srchButton1.setAttribute("type", "button");	
        srchButton1.setAttribute("class", "scopelook");				   
        srchButton1.style.background = "url('digits/brows1.png')";   
        attachEventListener(srchButton1, "click", srchshow, false);				
        bsnRow.inputCell.appendChild(srchButton1);
        
        _createFormRow(ajTable, '下單日期:', "<input type='date' name='d03update' id='querydate' class='txt' style='width:35%;' />");
        _createFormRow(ajTable, '廠商全名:', "<input type='text' name='d03others' id='vendorfullname' class='txt' style='width:50%;' maxlength='40' />", true);
        
        // 廠商簡稱
        var vndNameHtml = (txtword == 1) 
            ? "<input type='text' name='d03others' id='vendorname' class='txt' style='width:25%;' maxlength='8' />"
            : "<input type='text' name='d03others' id='vendorname' class='txt' style='background-color:#B9B9FF;width:25%;' maxlength='8' readOnly=true />";
        var vndNameRow = _createFormRow(ajTable, '廠商簡稱:', vndNameHtml);
        if (txtword == 1) {
            var srchButton2 = document.createElement("input");				   
            srchButton2.setAttribute("type", "button");	
            srchButton2.setAttribute("class", "scopelook");				   
            srchButton2.style.background = "url('digits/brows1.png')";   
            attachEventListener(srchButton2, "click", srchshow, false);				
            vndNameRow.inputCell.appendChild(srchButton2);
        }
        
        // 廠商代號
        var vndNoHtml = (txtword == 1)
            ? "<input type='text' name='d03update' id='vendorno' class='txt' style='width:20%;' maxlength='6' />"
            : "<input type='text' name='d03update' id='vendorno' class='txt' style='background-color:#B9B9FF;width:20%;' maxlength='6' readOnly=true />";
        var vndNoRow = _createFormRow(ajTable, '廠商代號:', vndNoHtml);
        if (txtword == 1) {
            var srchButton3 = document.createElement("input");				   
            srchButton3.setAttribute("type", "button");	
            srchButton3.setAttribute("class", "scopelook");				   
            srchButton3.style.background = "url('digits/brows1.png')";   
            attachEventListener(srchButton3, "click", srchshow, false);				
            vndNoRow.inputCell.appendChild(srchButton3);
        }
        
        // 採購單號
        var qryNoHtml = (txtword == 2)
            ? "<input type='text' name='d03update' id='queryno' class='txt' style='background-color:#B9B9FF;width:25%;' maxlength='10' readOnly=true />"
            : "<input type='text' name='d03update' id='queryno' class='txt' style='width:25%;' maxlength='10'/>";
        _createFormRow(ajTable, '採購單號:', qryNoHtml);
        
        if (txtword == 2) {
            optionitem(aWaitUpdate[5], slt4.id, 4, "D01/BKND/D00srch.php");
        } else {
            optionitem(getAuth[2]()[0].INT_011, slt4.id, 4, "D01/BKND/D00srch.php");
        }
        
        // 紀錄號碼 (隱藏列)
        _createFormRow(ajTable, '紀錄號碼', "<input type='text' name='d03update' id='rcrd_no1' class='txt' maxlength='14' autosize />", true);
        
    } else { // 異動表身資料			       		 
        _createFormRow(ajTable, '預定交期:', "<input type='date' name='d04update' id='deliverydate' class='txt' style='width:30%;' maxlength='10' />");
        _createFormRow(ajTable, '廠商品號:', "<input type='text' name='d04update' id='vendorpartno' class='txt' style='width:50%;' maxlength='30'/>");
        _createFormRow(ajTable, '單價:', "<input type='number' name='d04update' value=0 id='price' class='txt' style='text-align:right;width:20%;' />");
        _createFormRow(ajTable, '數量:', "<input type='number' name='d04update' id='queryqty' value=1 class='txt' style='text-align:right;width:20%;' />");
        
        // 品名規格
        var specHtml = (txtword == 2)
            ? "<input type='text' name='d04others' id='stockname' class='txt' style='background-color:#B9B9FF;width:70%;' maxlength='40' readOnly=true />"
            : "<input type='text' name='d04others' id='stockname' class='txt' style='width:70%;' maxlength='40' />";
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
            ? "<input type='text' name='d04update' id='stockno' class='txt' style='background-color:#B9B9FF;width:60%;' maxlength='43' readOnly=true />"
            : "<input type='text' name='d04update' id='stockno' class='txt' style='width:60%;' maxlength='43' />";
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
        _createFormRow(ajTable, '紀錄號碼', "<input type='text' name='d04update' id='rcrd_no2' class='txt' maxlength='14' autosize />", true);
    }				 						 
}

function topAndWidthModify(dropsheet_content, dropsheet, txtword, tbno) {	 	 
    if (dropsheet_content) dropsheet_content.style.width = "50%"; 
    if (dropsheet) dropsheet.style.paddingTop = "25px";     
    return true;
}

function initFocusField(txtword, tbno, aWaitUpdate, notWaitdata, ajTable) {
    var thtdy = _getUiDateStr();
    
    switch (txtword) {
        case 1: // 新增
            if (tbno == 0) {					  
                if (document.getElementById("querydate")) document.getElementById("querydate").value = thtdy; 
                if (getAuth[2]()[0].INT_111 == 'Y') {       
                    objGetNo('queryno', 'DA' + _getYearHexMonth(thtdy));
                    var cstNo = document.getElementById("vendorno");
                    if (cstNo) {
                        cstNo.focus();	
                        attachEventListener(cstNo, "change", d01VendorName, false); 
                    }
                    if (document.getElementById('dlvrplace')) {
                        document.getElementById('dlvrplace').value = getAuth[2]()[0].INT_071;
                    }
                    var acntNo1 = document.getElementById("whono");				 
                    if (acntNo1) attachEventListener(acntNo1, "change", a01AccountName, false); 
                } else {	 
                    if (document.getElementById("queryno")) document.getElementById("queryno").focus();
                }   
            } else {
                if (document.getElementById("deliverydate")) document.getElementById("deliverydate").value = thtdy; 												
                if (document.getElementById("stockno")) document.getElementById("stockno").focus();
            }
            break;
        case 2: // 修改
            var rcrdEl = document.getElementById("rcrd_no" + (tbno + 1).toString());
            if (rcrdEl) rcrdEl.value = aWaitUpdate[0];       
            
            if (tbno == 0) {
                if (document.getElementById("querydate")) document.getElementById("querydate").focus();				 			 				  
                if (document.getElementById('vendorname')) document.getElementById('vendorname').value = notWaitdata[0];
                if (document.getElementById('vendorfullname')) document.getElementById('vendorfullname').value = notWaitdata[1];
                if (document.getElementById('whonameEx')) document.getElementById('whonameEx').innerHTML = notWaitdata[2];
                var acntNo1 = document.getElementById("whono");				 
                if (acntNo1) attachEventListener(acntNo1, "change", a01AccountName, false); 
            } else {
                if (document.getElementById("queryqty")) document.getElementById("queryqty").focus();				 			 				  
                if (document.getElementById('stockname')) document.getElementById('stockname').value = notWaitdata[0];
            }
            
            var editinit = document.getElementsByName(tbno == 0 ? 'd03update' : 'd04update');
            for (var k = 0; k < editinit.length; k++) { 
                if (aWaitUpdate[k] !== undefined) editinit[k].value = aWaitUpdate[k];
            }									
            break;	
        case 6: // 轉進貨單
            objGetNo('newPono', 'BA' + _getYearHexMonth(thtdy));				 				
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
    var rnddgt = getAuth[2]()[0].INT_068;     
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
                if (fldidx == 2) oTd.innerHTML = nongs[0]; // 廠商簡稱
                if (fldidx == 3) oTd.innerHTML = nongs[1]; // 廠商全稱
                if (fldidx == 6) oTd.innerHTML = nongs[2]; // 採購名稱
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
                if (fldidx == 7 || fldidx == 8 || fldidx == 9) oTd.innerHTML = 0; 
                if (fldidx == 10) oTd.innerHTML = args[1] * 1; // 未出數量
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
    var rnddgt = getAuth[2]()[0].INT_068;     
    var maintable = document.getElementById(tbno == 0 ? "maintbody1" : "maintbody2");
    if (!maintable) return;
    
    var fldidx = (tbno == 0) ? 4 : 2;
    var argsNo = (tbno == 0) ? 2 : 1;
    var nongsNo = (tbno == 0) ? 2 : 1;	
    var targetRow = maintable.rows[args[arglth - 1]];
    if (!targetRow) return;
    
    var ttlMnyEl = document.getElementById('ttlmny');
    var ttlcnt = !ttlMnyEl ? 0 : Number(ttlMnyEl.innerHTML);
    
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
                nongs[nongsNo] = subTotal;
                targetRow.cells[fldidx + 1].innerHTML = subTotal;	
            }	
            if (fldidx == 10 && tbno == 1) {	
                targetRow.cells[fldidx + 1].innerHTML = args[1] * 1 - targetRow.cells[fldidx - 2].innerHTML * 1 - targetRow.cells[fldidx - 1].innerHTML * 1;	  
            }
            nongsNo++;
        }         
        fldidx++;
    }		
    targetRow.cells[fldidx + 1].innerHTML = rsp.lastupdate;
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
    
    var url = "D04/BKND/D11srch.php";    
    var fatherKey = document.getElementById("fatherkey1") ? document.getElementById("fatherkey1").innerHTML : "";
    var queryString = "filename=" + fatherKey + '|' + sourceAccount(1, 1);
    
    fetch(url, {
        method: 'POST',
        cache: 'no-store', // 強制每次都向伺服器重新請求
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: queryString
    })
    .then(res => res.json())
    .then(rsp => srchOutRcd(rsp, ajTable)); 
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
    for (var j = 0; j < array.length; j++) {
        var th = document.createElement('th');    
        var text = document.createTextNode(array[j]); 
        th.style.width = array4[j];
        th.appendChild(text);
        oTrHeader.appendChild(th);		
    }						
}

function addNewRecordHint(tbno) { return (tbno == 0) ? "請輸入採購單表頭資料：" : "請輸入採購單內容資料："; }
function editRecordHint(tbno) { return (tbno == 0) ? "修改採購單表頭資料：" : "修改採購單內容資料："; }
function searchKeyHint(tbno) { return (tbno == 0) ? "搜尋單頭欄位選擇" : "搜尋單身欄位選擇"; }

function transRecordHint(tbno) {
    var fatherKeyEl = document.getElementById('fatherkey1');
    var fatherKey = fatherKeyEl ? fatherKeyEl.innerHTML : "";
    return (tbno == 0) 
        ? '採購單:' + sourceAccount(1, tbno) + ",轉進貨單?"
        : '採購單:' + fatherKey + ",轉進貨單?";
}

function page2OtherWindow1() {
    var fatherKey = document.getElementById("fatherkey1") ? document.getElementById("fatherkey1").innerHTML : "";
    return "\u{1F4E4}" + fatherKey + "\u{A0}\u{1F4E6}:\u{300C}" + sourceAccount(1, 1) + "\u{300D}的進貨紀錄";
}

function srcArgobj(srcId) {
    var srcEl = document.getElementById(srcId);
    var val = srcEl ? srcEl.value : "";
    
    if (srcId == 'vendorno' || srcId == 'vendorname') {
        var qrystring = (srcId == 'vendorno' ? "d01.F01" : "d01.F05") + "|" + val; 
        var tttlt = (srcId == 'vendorno' ? '請選擇廠商編號' : '請選擇廠商簡稱');
        return { "headtitle": tttlt, "drpshtWidth": "28%", "urlPth": "D04/BKND/D01srch.php", "clickfunc": chsecust, "qryString": qrystring, "mendwidth": "calc( 100% - 1em )" };
    } 
    if (srcId == 'whono') {
        return { "headtitle": "請選取採購人員帳號姓名", "drpshtWidth": "28%", "urlPth": "C01/BKND/A01srch.php", "clickfunc": chseprg1, "qryString": val, "mendwidth": "calc( 100% - 1em )" };
    } 
    
    var keyDscrpt = document.getElementById('keydscrpt1') ? document.getElementById('keydscrpt1').innerHTML : "";
    var crncy = document.getElementById('crncy') ? document.getElementById('crncy').innerHTML : "";
    var qryField = (srcId == 'stockno') ? "b01.F01" : "b01.F02";
    var tttlt = (srcId == 'stockno') ? "請選取料號" : "請選取品名";
    
    var qrystring = qryField + "," + val + "," + left(keyDscrpt, 6) + "," + crncy; 			 
    return { "headtitle": tttlt, "drpshtWidth": "80%", "urlPth": "D04/BKND/B01srch.php", "clickfunc": stckchg, "qryString": qrystring, "mendwidth": "calc( 100% - 1em )" };
}

function chseprg1(event) { // 選擇採購
    if (typeof event == "undefined") {
        event = window.event;
    }
    var target = getEventTarget(event);	 
    var stuffNo = document.getElementById('whono');
    stuffNo.value = "";
    var stuffName = document.getElementById('whonameEx');		
    if (stuffName) stuffName.innerHTML = "";
    
    var maintable = document.getElementById("stuffTbody");  
    for (var i = 0; i < maintable.rows.length; i++) {			 
        if (maintable.rows[i].cells[maintable.rows[i].cells.length - 1].childNodes[0].checked) {
             stuffNo.value = maintable.rows[i].cells[0].innerHTML;								 
             stuffName.innerHTML = maintable.rows[i].cells[1].innerHTML;				
             break;
        }				 
    }             
    srchblkclose(event);	
    return true;
}	

function stckchg(event) { // 選擇料號
    if (typeof event == "undefined") {
        event = window.event;
    }
    var target = getEventTarget(event);	 
    var stockNo = document.getElementById('stockno');
    stockNo.value = "";
    var stockName = document.getElementById('stockname');			
    stockName.value = "";  	
    var unitName = document.getElementById('unitname');
    var orderPrice = document.getElementById('price');
    var orderQty = document.getElementById('queryqty');
    var custstockno = document.getElementById('vendorpartno');
    var dlvdate = document.getElementById('deliverydate');		
    
    var maintable = document.getElementById("stuffTbody");  
    for (var i = 0; i < maintable.rows.length; i++) {			 
        if (maintable.rows[i].cells[maintable.rows[i].cells.length - 1].childNodes[0].checked) {
             stockNo.value = maintable.rows[i].cells[0].innerHTML;								 
             stockName.value = maintable.rows[i].cells[1].innerHTML;	
             if (unitName) unitName.innerHTML = maintable.rows[i].cells[2].innerHTML;
             if (orderQty) orderQty.value = maintable.rows[i].cells[4].innerHTML;
             if (custstockno) custstockno.value = maintable.rows[i].cells[5].innerHTML;  
             if (orderPrice) orderPrice.value = maintable.rows[i].cells[7].innerHTML;
            
             if (dlvdate) {
                 var outdate = new Date(sourceAccount(5, 0)); // 接單日
                 var endday = outdate.addDays(parseInt(maintable.rows[i].cells[8].innerHTML, 10));
                 dlvdate.value = endday.getFullYear() + '-' + MyMonth(endday.getMonth()) + '-' + ((endday.getDate() < 10) ? "0" : "") + endday.getDate();	
             }
             break;
        }				 
    }             
    srchblkclose(event);	
    return true;
}	

function chsecust(event) { // 選擇廠商
    if (typeof event == "undefined") {
        event = window.event;
    }
    var target = getEventTarget(event);	 
    var custNo = document.getElementById('vendorno');
    custNo.value = "";
    var custName = document.getElementById('vendorname');			
    custName.value = "";
    var custFullName = document.getElementById('vendorfullname');
    var rprsntno = document.getElementById('whono');
    var rprsntname = document.getElementById('whonameEx');
    var crnttpe = document.getElementById('crntopt');
    var contactman = document.getElementById('winman');
    var shipway = document.getElementById('howship');
    var paymenttp = document.getElementById('howpay');
    
    var maintable = document.getElementById("stuffTbody");  
    for (var i = 0; i < maintable.rows.length; i++) {			 
        if (maintable.rows[i].cells[maintable.rows[i].cells.length - 1].childNodes[0].checked) {
            custNo.value = maintable.rows[i].cells[0].innerHTML;								 
            custName.value = maintable.rows[i].cells[1].innerHTML;
            if (rprsntno) rprsntno.value = maintable.rows[i].cells[2].innerHTML;
            if (rprsntname) rprsntname.innerHTML = maintable.rows[i].cells[3].innerHTML;
            if (crnttpe) crnttpe.value = maintable.rows[i].cells[4].innerHTML;
            if (contactman) contactman.value = maintable.rows[i].cells[5].innerHTML;

            if (paymenttp) {
                var tpy = maintable.rows[i].cells[6].innerHTML;   
                switch (tpy) {				        
                    case '0': tpy = "現結"; break;
                    case '1': tpy = "月結"; break;
                    case '2': tpy = "次月結"; break;
                    case '3': tpy = "T/T"; break;
                    default: tpy = '現結'; break;
                }	 
                paymenttp.value = tpy + (maintable.rows[i].cells[7].innerHTML == 0 ? '' : maintable.rows[i].cells[7].innerHTML + '天');
            }	
            if (shipway) shipway.value = maintable.rows[i].cells[8].innerHTML;   
            if (custFullName) custFullName.value = maintable.rows[i].cells[9].innerHTML;  
            break;
        }						   
    }             
    srchblkclose(event);	
    return true;
}