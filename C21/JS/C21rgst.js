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

// 4. 快速建立表單動態列的工具 (報價單管理格式調整)
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

// C21rgst.js 報價單新增修改與其他查詢畫面
function blocksclose(clsevt) { // 關閉註冊彈出視窗
    var e = clsevt || window.event || (typeof event !== "undefined" ? event : null);
    var target = e ? getEventTarget(e) : null;
    var tabs = getElementsByAttribute('class', 'tab');	
    
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].setAttribute("accesskey", (i + 1).toString());
    }		
    
    if (tabs.length > 0 && tabs[0].checked) {
        if (target && target.value == "\u{274E}" && getAuth[2]()[0].INT_127 == 'Y') {
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
                    : "CCxxxxxxxx";
            }
            
            var queryNoEl = document.getElementById('queryno');
            if (queryNoEl) {			  
                var currentNo = queryNoEl.value.trim();	            	 
                if (currentNo !== "" && currentNo !== query_no) { 
                    var thtdy = _getUiDateStr();
                    var hexM = _getYearHexMonth(thtdy);	
					const regexA = /^CC\d{2}[1-9A-C]\d{5}$/;
					if('CC' + hexM == currentNo.substr(0,5) && regexA.test(currentNo)){						
                        discardNoRec('CC' + hexM, currentNo);
					}
                } 
            }
        }
    }
    
    if (target && target.value == "\u{274E}" && document.getElementById('newPono') != null) {
        var currentNo = document.getElementById('newPono').value.trim();
        var thtdy = _getUiDateStr();
        var hexM = _getYearHexMonth(thtdy);
		const regexB = /^CA\d{2}[1-9A-C]\d{5}$/;
		if(regexB.test(currentNo)){
           discardNoRec('CA' + hexM, currentNo);
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
            if (['M', 'I'].indexOf(lastChar) !== -1) {		      
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
    var c21elements = document.getElementsByName(isTab0 ? 'c26update' : 'c27update');
    var c21athments = document.getElementsByName(isTab0 ? 'c26others' : 'c27others');	
    
    var recordNo = document.getElementById("rcrd_no" + (tbno + 1).toString());
    
    for (var r = 0; r < c21athments.length; r++) { // 關聯資料
        nonjsn.push(c21athments[r].tagName.toUpperCase() == 'SPAN' ? c21athments[r].innerHTML : c21athments[r].value);		
    }
    for (var q = 1; q < c21elements.length; q++) { // 開始堆疊待異動資料陣列
         tbjsn.push(c21elements[q].value);    
    }
    for (var j = 1; j < c21elements.length - 1; j++) {
        if (c21elements[j].value.trim() == "" && !(j == 4 && tbno == 1)) {		
            if (j == 1) {
                c21elements[j].placeholder = "不得空白";
            } else {
                filtermsg(c21elements[j], "不得空白");
            }
            return false;
        } else {		      
            if (c21elements[j].nextSibling) {		
                if (!((j == 4 && tbno == 0) || (j == 1 && tbno == 1))) { // 非人名與料號移除
                    c21elements[j].parentNode.removeChild(c21elements[j].nextSibling);
                }			    
            }
            if (tbno == 1 && (j == 2 || j == 3 || j == 5 || j == 6) && c21elements[j].value == 0) {			  
                filtermsg(c21elements[j], "不得為 0");
                return false;
            }
            if (tbno == 1 && (j == 6)) {
                if (c21elements[6].value % c21elements[5].value != 0) {  
                    var sgstnumner = parseInt(c21elements[6].value) + parseInt(c21elements[5].value) - (c21elements[6].value % c21elements[5].value);			  
                    filtermsg(c21elements[j], "必須為包裝基量的倍數，建議：" + sgstnumner);
                    return false;
                }
            }
            if (tbno == 1 && (j == 2)) {			  
                if (parseInt(c21elements[2].value) < parseInt(c21elements[6].value)) {    
                    filtermsg(c21elements[j], "不得小於最少採購");
                    return false;
                }
                if (c21elements[2].value % c21elements[5].value != 0 && parseInt(c21elements[5].value) > 0) {
                    var sgstnumner = parseInt(c21elements[2].value) + parseInt(c21elements[5].value) - (c21elements[2].value % c21elements[5].value);			
                    filtermsg(c21elements[j], "必須為包裝基量的倍數，建議：" + sgstnumner);
                    return false;
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
        if (c21elements[1] && c21elements[1].value !== "") {
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
    if (getAuth[2]()[0].INT_099 == 'Y' && getAuth[2]()[0].INT_127 == 'Y') { // 如果是系統參數設為自動編號且刪掉號碼重用						       
        var thtdy = _getUiDateStr();
        var crntmth = _getYearHexMonth(thtdy);		
        if (currentNo.substring(2, 5) == crntmth ) {
			const regexA = /^CC\d{2}[1-9A-C]\d{5}$/;
			if(regexA.test(currentNo.trim())){
               discardNoRec('CC' + crntmth, currentNo.trim());
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
    var url = "B01/BKND/C01CustomName.php?timestamp=" + Date.now();			
    
    try {
        var response = await fetch(url, {
            method: "POST",
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
        _createFormRow(ajTable, '備註:', "<input type='text' name='c26update' id='dscrpt' class='txt' style='width:80%;' onkeyup='checkLength(this, 36);' />");
        _createFormRow(ajTable, '付款方式:', "<input type='text' name='c26update' id='howpay' class='txt' style='width:50%;' maxlength='30' />");
        _createFormRow(ajTable, '交貨方式:', "<input type='text' name='c26update' id='howship' class='txt' style='width:80%;' maxlength='30' />");
        _createFormRow(ajTable, '聯絡人:', "<input type='text' name='c26update' id='winman' class='txt' style='width:50%;' maxlength='10' />");
        
        // 幣別 Select 元素建立
        var sltRow = _createFormRow(ajTable, '幣別:', "");
        var slt4 = document.createElement("select");
        slt4.setAttribute("id", "crntopt");
        slt4.setAttribute("name", "c26update");
        sltRow.inputCell.appendChild(slt4);
        
        // 業務擔當
        var bsnRow = _createFormRow(ajTable, '業務擔當:', "<input type='text' name='c26update' id='whono' class='txt' style='width:30%;' maxlength='8' /><span name='c26others' id='whonameEx'></span>&nbsp;&nbsp;");
        var srchButton1 = document.createElement("input");				   
        srchButton1.setAttribute("type", "button");	
        srchButton1.setAttribute("class", "scopelook");				   
        srchButton1.style.background = "url('digits/brows1.png')";   
        attachEventListener(srchButton1, "click", srchshow, false);				
        bsnRow.inputCell.appendChild(srchButton1);
        
        _createFormRow(ajTable, '報價日期:', "<input type='date' name='c26update' id='querydate' class='txt' style='width:35%;' />");
        _createFormRow(ajTable, '客戶全名:', "<input type='text' name='c26others' id='customfullname' class='txt' style='width:50%;' maxlength='40' />", true);
        
        // 客戶簡稱
        var cstNameHtml = (txtword == 1) 
            ? "<input type='text' name='c26others' id='customname' class='txt' style='width:25%;' maxlength='8' />"
            : "<input type='text' name='c26others' id='customname' class='txt' style='background-color:#B9B9FF;width:25%;' maxlength='8' readOnly=true />";
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
            ? "<input type='text' name='c26update' id='customno' class='txt' style='width:20%;' maxlength='6' />"
            : "<input type='text' name='c26update' id='customno' class='txt' style='background-color:#B9B9FF;width:20%;' maxlength='6' readOnly=true />";
        var cstNoRow = _createFormRow(ajTable, '客戶代號:', cstNoHtml);
        if (txtword == 1) {
            var srchButton3 = document.createElement("input");				   
            srchButton3.setAttribute("type", "button");	
            srchButton3.setAttribute("class", "scopelook");				   
            srchButton3.style.background = "url('digits/brows1.png')";   
            attachEventListener(srchButton3, "click", srchshow, false);				
            cstNoRow.inputCell.appendChild(srchButton3);
        }
        
        // 報價單號
        var qryNoHtml = (txtword == 2)
            ? "<input type='text' name='c26update' id='queryno' class='txt' style='background-color:#B9B9FF;width:25%;' maxlength='10' readOnly=true />"
            : "<input type='text' name='c26update' id='queryno' class='txt' style='width:25%;' maxlength='10'/>";
        _createFormRow(ajTable, '報價單號:', qryNoHtml);
        
        if (txtword == 2) {
            optionitem(aWaitUpdate[5], slt4.id, 4, "C01/BKND/C00srch.php");
        } else {
            optionitem(getAuth[2]()[0].INT_011, slt4.id, 4, "C01/BKND/C00srch.php");
        }
        
        // 紀錄號碼 (隱藏列)
        _createFormRow(ajTable, '紀錄號碼', "<input type='text' name='c26update' id='rcrd_no1' class='txt' maxlength='14' autosize />", true);
        
    } else { // 異動表身資料			       		 
        _createFormRow(ajTable, '有效期限:', "<input type='date' name='c27update' class='txt' id='validend' style='width:35%;' />");
        _createFormRow(ajTable, '生效日期:', "<input type='date' name='c27update' class='txt' id='validstart' style='width:35%;' />");
        _createFormRow(ajTable, '最少採購:', "<input type='number' name='c27update' id='minumqty' value=1 class='txt' style='width:20%;text-align:right;' maxlength='6' />");
        _createFormRow(ajTable, '包裝基量:', "<input type='number' name='c27update' id='basepack' value=1 class='txt' style='width:20%;text-align:right;' maxlength='6' />");
        
        // 客戶品號
        var custPartRow = _createFormRow(ajTable, '客戶品號:', "<input type='text' name='c27update' id='custompartno' class='txt' style='width:50%;' maxlength='30'/>");
        if (txtword == 1) {
            var srchButton12 = document.createElement("input");				   
            srchButton12.setAttribute("type", "button");	
            srchButton12.setAttribute("class", "scopelook");				   
            srchButton12.style.background = "url('digits/brows1.png')";   
            attachEventListener(srchButton12, "click", srchshow, false);				
            custPartRow.inputCell.appendChild(srchButton12);
        }

        _createFormRow(ajTable, '單價:', "<input type='number' name='c27update' value=0 class='txt' style='width:20%;text-align:right;' />");
        _createFormRow(ajTable, '數量:', "<input type='number' name='c27update' id='queryqty' value=1 class='txt' style='width:20%;text-align:right;' />");
        
        // 品名規格
        var specHtml = (txtword == 2)
            ? "<input type='text' name='c27others' id='stockname' class='txt' style='background-color:#B9B9FF;width:70%;' maxlength='40' readOnly=true />"
            : "<input type='text' name='c27others' id='stockname' class='txt' style='width:70%;' maxlength='40' />";
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
            ? "<input type='text' name='c27update' id='stockno' class='txt' style='background-color:#B9B9FF;width:60%;' maxlength='43' readOnly=true />"
            : "<input type='text' name='c27update' id='stockno' class='txt' style='width:60%;' maxlength='43' />";
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
        _createFormRow(ajTable, '紀錄號碼', "<input type='text' name='c27update' id='rcrd_no2' class='txt' maxlength='14' autosize />", true);
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
                if (getAuth[2]()[0].INT_127 == 'Y') {       
                    objGetNo('queryno', 'CC' + _getYearHexMonth(thtdy));
                    var cstNo = document.getElementById("customno");
                    if (cstNo) {
                        cstNo.focus();	
                        attachEventListener(cstNo, "change", c01CustomName, false); 
                    }
                } else {	 
                    if (document.getElementById("queryno")) document.getElementById("queryno").focus();
                }   
            } else {
                if (document.getElementById("validstart")) document.getElementById("validstart").value = thtdy; 												
                
                var today = new Date();
                var endday = today.addDays(parseInt(getAuth[2]()[0].INT_126, 10)); 
                var endaydash = endday.getFullYear() + '-' + MyMonth(endday.getMonth()) + '-' + ((endday.getDate() < 10) ? "0" : "") + endday.getDate();						
                if (document.getElementById("validend")) document.getElementById("validend").value = endaydash;
                
                if (document.getElementById("stockno")) document.getElementById("stockno").focus();
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
            } else {
                if (document.getElementById("queryqty")) document.getElementById("queryqty").focus();				 			 				  
                if (document.getElementById('stockname')) document.getElementById('stockname').value = notWaitdata[0];
            }
            
            var editinit = document.getElementsByName(tbno == 0 ? 'c26update' : 'c27update');
            for (var k = 0; k < editinit.length; k++) { 
                if (aWaitUpdate[k] !== undefined) editinit[k].value = aWaitUpdate[k];
            }									
            break;	
        case 6: // 轉正式訂單
            objGetNo('newPono', 'CA' + _getYearHexMonth(thtdy));				 				
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
                if (fldidx == 13) { nongs[4] = 'N'; oTd.innerHTML = 'N'; } // 轉單
                if (fldidx == 14) { nongs[5] = 'N'; oTd.innerHTML = 'N'; } // 確認
            }
            if (tbno == 1) {
                if (fldidx == 1) { oTd.innerHTML = nongs[nongsNo]; nongsNo++; } // 品名
                if (fldidx == 4) { // 小計
                    var subTotal = _roundTo(args[1] * args[2], rnddgt);
                    oTd.innerHTML = subTotal;			
                    ttlcnt += subTotal;	
                    if (ttlMnyEl) ttlMnyEl.innerHTML = ttlcnt; 
                }
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
    var nongsNo = (tbno == 0) ? 2 : 0;	
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
                nongsNo++;
            }
            if (fldidx == 4 && tbno == 1) {
                var subTotal = _roundTo(args[1] * args[2], rnddgt);
                ttlcnt += subTotal;					
                if (ttlMnyEl) ttlMnyEl.innerHTML = ttlcnt; 
                nongs[nongsNo] = subTotal;
                targetRow.cells[fldidx + 1].innerHTML = subTotal;	
            }	
        }         
        fldidx++;
    }		
    targetRow.cells[fldidx + 1].innerHTML = rsp.lastupdate;
}

function transConfirm(oTd) { 			 
    oTd.innerHTML = "<input type='text' name='c03update' id='newPono' class='txt' style='display:none;' maxlength='10'/>"; 				 
    return true;
}   

function addNewRecordHint(tbno) { return (tbno == 0) ? "請輸入報價單表頭資料：" : "請輸入報價單內容資料："; }
function editRecordHint(tbno) { return (tbno == 0) ? "修改報價單表頭資料：" : "修改報價單內容資料："; }
function searchKeyHint(tbno) { return (tbno == 0) ? "搜尋單頭欄位選擇" : "搜尋單身欄位選擇"; }

function transRecordHint(tbno) {
    var fatherKeyEl = document.getElementById('fatherkey1');
    var fatherKey = fatherKeyEl ? fatherKeyEl.innerHTML : "";
    return (tbno == 0) 
        ? '報價單號:' + sourceAccount(1, tbno) + ",轉正式訂單?"
        : '報價單號:' + fatherKey + ",轉正式訂單?";
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
        return { "headtitle": "請選取業務人員帳號姓名", "drpshtWidth": "28%", "urlPth": "C01/BKND/A01srch.php", "clickfunc": chseprg1, "qryString": val, "mendwidth": "calc( 100% - 1em )" };
    } 
    
    var keyDscrpt = document.getElementById('keydscrpt1') ? document.getElementById('keydscrpt1').innerHTML : "";
    var qryField = "";
    var tttlt = "";
    
    if (srcId == 'stockno') {			     
        qryField = "b01.F01";
        tttlt = "請選取料號";          			
    } else if (srcId == 'stockname') {			 
        qryField = "b01.F02"; 			 
        tttlt = "請選取品名";
    } else {
        qryField = "c34.F03";  
        tttlt = "請選取客戶料號";
    }
    
    var qrystring = qryField + "|" + val + "_" + left(keyDscrpt, 6); 			 
    return { "headtitle": tttlt, "drpshtWidth": "70%", "urlPth": "C21/BKND/B01srch.php", "clickfunc": stckchg, "qryString": qrystring, "mendwidth": "calc( 100% - 1em )" };
}

function chseprg1(event) { // 選擇業務
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
    if (stockName) stockName.value = "";  	
    var unitName = document.getElementById('unitname');
    var basicqty = document.getElementById('basepack');
    var minumorder = document.getElementById('minumqty');
    var custstockno = document.getElementById('custompartno');
    var queryquintity = document.getElementById('queryqty');	 
    
    var maintable = document.getElementById("stuffTbody");  
    for (var i = 0; i < maintable.rows.length; i++) {			 
        if (maintable.rows[i].cells[maintable.rows[i].cells.length - 1].childNodes[0].checked) {
             stockNo.value = maintable.rows[i].cells[0].innerHTML;								 
             if (stockName) stockName.value = maintable.rows[i].cells[1].innerHTML;	
             if (unitName) unitName.innerHTML = maintable.rows[i].cells[2].innerHTML;
             if (basicqty) basicqty.value = maintable.rows[i].cells[3].innerHTML;
             if (minumorder) minumorder.value = maintable.rows[i].cells[4].innerHTML;  
             if (custstockno) custstockno.value = maintable.rows[i].cells[5].innerHTML;
             if (queryquintity) queryquintity.value = minumorder.value;
             break;
        }				 
    }             
    srchblkclose(event);	
    return true;
}	

function chsecust(event) { // 選擇客戶
    if (typeof event == "undefined") {
        event = window.event;
    }
    var target = getEventTarget(event);	 
    var custNo = document.getElementById('customno');
    custNo.value = "";
    var custName = document.getElementById('customname');			
    custName.value = "";
    var custFullName = document.getElementById('customfullname');
    var rprsntno = document.getElementById('whono');
    var rprsntname = document.getElementById('whonameEx');
    var crnttpe = document.getElementById('crntopt');
    var contactman = document.getElementById('winman');
    var shipway = document.getElementById('howship');
    var paymenttp = document.getElementById('howpay');
    var shipplace = document.getElementById('dlvrplace');
    var shipdirect = document.getElementById('shipdirect');
    
    var maintable = document.getElementById("stuffTbody");  
    for (var i = 0; i < maintable.rows.length; i++) {			 
        if (maintable.rows[i].cells[maintable.rows[i].cells.length - 1].childNodes[0].checked) {
            custNo.value = maintable.rows[i].cells[0].innerHTML;								 
            custName.value = maintable.rows[i].cells[1].innerHTML;
            if (rprsntno) rprsntno.value = maintable.rows[i].cells[2].innerHTML;
            if (rprsntname) rprsntname.innerHTML = maintable.rows[i].cells[3].innerHTML;
            if (crnttpe) crnttpe.value = maintable.rows[i].cells[4].innerHTML;
            if (contactman) contactman.value = maintable.rows[i].cells[5].innerHTML;
            if (shipway) shipway.value = maintable.rows[i].cells[6].innerHTML;   
            if (custFullName) custFullName.value = maintable.rows[i].cells[11].innerHTML;  
            
            if (paymenttp) {
                var tpy = maintable.rows[i].cells[7].innerHTML;   
                switch (tpy) {				        
                    case '0': tpy = "現結"; break;
                    case '1': tpy = "月結"; break;
                    case '2': tpy = "次月結"; break;
                    case '3': tpy = "T/T"; break;
                    default: tpy = '現結'; break;
                }	 
                paymenttp.value = tpy + (maintable.rows[i].cells[8].innerHTML == 0 ? '' : maintable.rows[i].cells[8].innerHTML + '天');
            }	
            if (shipplace) shipplace.value = maintable.rows[i].cells[9].innerHTML;
            if (shipdirect) shipdirect.value = maintable.rows[i].cells[10].innerHTML;
            break;
        }						   
    }             
    srchblkclose(event);	
    return true;
}