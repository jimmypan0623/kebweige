/**
 * 關閉註冊彈出視窗與快捷鍵重置
 */
function blocksclose(event) {
    const evt = event || window.event;
    const target = getEventTarget(evt);
    const tabs = getElementsByAttribute('class', 'tab');

    // 重設 Tab 快捷鍵
    tabs.forEach((tab, index) => {
        tab.setAttribute("accesskey", (index + 1).toString());
    });

    if (tabs[0]?.checked) {
        // 當按下關閉圖示且啟用號碼重用參數
        if (target?.value === "\u{274E}" && getCookie('INT_013') === 'Y') {
            const maintable = document.getElementById("maintbody1");
            let tablerowindex = 0;

            if (maintable) {
                for (let i = 0; i < maintable.rows.length; i++) {
                    const lastCell = maintable.rows[i].cells[maintable.rows[i].cells.length - 1];
                    if (lastCell?.childNodes[0]?.checked) {
                        tablerowindex = i;
                        break;
                    }
                }
            }

            const query_no = (maintable && maintable.rows.length > 0) 
                ? maintable.rows[tablerowindex].cells[1].innerHTML 
                : "BDxxxxxxxx";

            const queryNoEl = document.getElementById('queryno');
            if (queryNoEl) {
                const currentNo = queryNoEl.value.trim();
                const regexA = /^BD\d{2}[1-9A-C]\d{5}$/;

                if (currentNo !== "" && currentNo !== query_no && regexA.test(currentNo)) {
                    const thtdy = document.getElementById('recmth').value;
                    const prefix = 'BD' + thtdy.substring(2, 4) + parseInt(thtdy.substring(5, 7), 10).toString(16).toUpperCase();
                    discardNoRec(prefix, currentNo);
                }
            }
        }
    }

    // 關閉並移除 Modal
    const dropsheet = document.getElementById("myModal");
    if (dropsheet) {
        dropsheet.style.display = "none";
        dropsheet.parentNode?.removeChild(dropsheet);
    }

    // 重新指派按鈕快捷鍵
    const btns = getElementsByAttribute('class', 'btn');
    const isFirstTab = tabs[0]?.checked;

    btns.forEach(btn => {
        const lastChar = right(btn.title, 1);
        const disabledKeys = isFirstTab ? ['M', 'I'] : ['J', 'K', 'T', 'V'];

        if (disabledKeys.includes(lastChar)) {
            btn.removeAttribute("accesskey");
        } else {
            btn.setAttribute("accesskey", lastChar);
        }
    });

    return true;
}

/**
 * 新增與修改資料處理程序
 */
function sendFilePrc(updflg) {
    const tbjsn = [];
    const nonjsn = [];
    const recordNo = document.getElementById("rcrd_no");

    const tabs = getElementsByAttribute('class', 'tab');
    let tbno = 0;
    for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].checked) {
            tbno = i;
            break;
        }
    }

    const b05elements = document.getElementsByName(tbno === 0 ? 'b05update' : 'b0eupdate');
    const b05athments = document.getElementsByName(tbno === 0 ? 'b05others' : 'b0eothers');

    // 收集關聯資料
    Array.from(b05athments).forEach(el => {
        nonjsn.push(el.tagName.toUpperCase() === 'SPAN' ? el.innerHTML : el.value);
    });

    // 收集待異動資料
    for (let q = 1; q < b05elements.length; q++) {
        tbjsn.push(b05elements[q].value);
    }

    // 欄位驗證
    for (let j = 1; j < b05elements.length - 1; j++) {
        const el = b05elements[j];

        // 表頭日期驗證
        if (tbno === 0 && j === 3) {
            const recmthVal = document.getElementById('recmth').value;
            const oDate = new Date(`${recmthVal}-${el.value}`);
            const cYear = oDate.getFullYear();
            const cMonth = oDate.getMonth() + 1;
            const cDate = oDate.getDate();

            const iYear = left(recmthVal, 4);
            const iMonth = right(recmthVal, 2);
            const iDate = paddingLeft(el.value.trim(), 2);

            const isValidDate = (iYear == cYear) && (iMonth == cMonth) && (iDate == cDate);
            if (!isValidDate) {
                filtermsg(el, "日期格式不對");
                return false;
            } else if (el.nextSibling) {
                el.parentNode.removeChild(el.nextSibling);
            }
        }

        // 空值驗證排除條款
        const isExemptEmpty = (tbno === 1 && (j === 4 || j === 6)) || (tbno === 0 && (j === 7 || j === 8 || j === 9));
        if (el.value.trim() === "" && !isExemptEmpty) {
            if (j === 1) {
                el.placeholder = "不得空白";
            } else {
                filtermsg(el, "不得空白");
            }
            return false;
        } else {
            if (el.nextSibling && !((j === 4 && tbno === 0) || (j === 1 && tbno === 1))) {
                el.parentNode.removeChild(el.nextSibling);
            }
            // 零值檢查
            if (((tbno === 1 && (j === 3 || j === 4)) || (tbno === 0 && j === 11)) && Number(el.value) === 0) {
                filtermsg(el, "不得為 0");
                return false;
            }
        }
    }

    // 判斷新增或修改模式
    if (updflg === 1) { // 新增
        if (b05elements[1]?.value !== "") {
            if (tbno === 0) {
                tbjsn.push(document.getElementById('recmth').value); // 所屬年月
            }
            tbjsn.push('0', '0');
            TableToJson(tbjsn, nonjsn, tbno);
        } else {
            blkshow("欄位資料不齊全無法新增權限");
        }
    } else { // 修改
        if (tbno === 0) {
            const src20 = Number(sourceAccount(20, 0));
            const val12 = Number(b05elements[12].value);
            const x1 = src20 - val12;
            const y1 = src20 + val12;

            if (x1 !== 0 && y1 > 3) {
                if (x1 < 0) tbjsn[11] = 9;
                else if (x1 === 2) tbjsn[11] = 7;
                else tbjsn[11] = 8;
            }
        }

        if (tbno === 1) {
            tbjsn[2] = Number(b05elements[3].value) - Number(sourceAccount(4, 1));
        }

        const tablerowindex = sourceAccount(null, tbno);
        tbjsn.push(recordNo.value, tablerowindex);
        TableToJson(tbjsn, nonjsn, tbno);
    }

    blocksclose();
    return true;
}

/**
 * 計算總金額
 */
function calculateTtl(tbno, maintable, i) {
    if (tbno === 1 && maintable?.rows[i]) {
        const ttlcnt = Number(document.getElementById('ttlmny').innerHTML);
        const crntsum = Number(maintable.rows[i].cells[6].innerHTML);
        document.getElementById('ttlmny').innerHTML = ttlcnt - crntsum;
    }
}

/**
 * 刪除重用單號處理
 */
function billNoReCreate(currentNo) {
    if (getCookie('INT_099') === 'Y' && getCookie('INT_013') === 'Y') {
        const regexA = /^BD\d{2}[1-9A-C]\d{5}$/;
        if (regexA.test(currentNo.trim())) {
            const thtdy = document.getElementById('recmth').value;
            const prefix = 'BD' + thtdy.substring(2, 4) + parseInt(thtdy.substring(5, 7), 10).toString(16).toUpperCase();
            discardNoRec(prefix, currentNo.trim());
        }
    }
}

/**
 * 匯率變動非同步查詢
 */
async function ratechange(event) {
    const target = getEventTarget(event);
    if (!target?.value) return;

    try {
        const response = await fetch(`B04/BKND/C00srch.php?timestamp=${Date.now()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `filename=${encodeURIComponent(target.value)}`
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const text = await response.text();
        const curncyEl = document.getElementById("curncy");
        if (curncyEl) curncyEl.value = parseFloat(text) || 1;

    } catch (error) {
        console.error("更新匯率失敗:", error);
    }
}

/**
 * 客戶名稱與相關設定帶入
 */
async function c01CustomName(event) {
    const targetCustomNo = getEventTarget(event);
    const customNoValue = targetCustomNo?.value?.trim() ?? '';

    if (!customNoValue) {
        clearCustomFields();
        return;
    }

    try {
        const response = await fetch(`B05/BKND/C01CustomName.php?timestamp=${Date.now()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: `filename=${encodeURIComponent(customNoValue)}`
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const rsp = await response.json();

        if (Array.isArray(rsp) && rsp.length > 0) {
            const data = rsp[0];
            const valueMapping = {
                'customname': data.customname,
                'customfullname': data.customfullname,
                'unitno': data.unitno,
                'winname': data.winname,
                'telNo': data.telNo,
                'whono': data.whono,
                'crntopt': data.crntopt,
                'curncy': data.curncy,
                'invtype': data.invtype,
                'taxtype': data.taxtype
            };

            Object.entries(valueMapping).forEach(([fieldId, val]) => {
                const el = document.getElementById(fieldId);
                if (el) el.value = val ?? '';
            });

            const whonameEx = document.getElementById('whonameEx');
            if (whonameEx) whonameEx.innerHTML = data.whonameEx ?? '';
        } else {
            console.warn('查無此客戶資料');
            clearCustomFields();
        }

    } catch (error) {
        console.error('取得客戶名稱資料失敗:', error);
    }
}

/**
 * 清空客戶相關欄位
 */
function clearCustomFields() {
    const fieldsToClear = [
        'customname', 'customfullname', 'unitno', 'winname', 
        'telNo', 'whono', 'crntopt', 'curncy', 'invtype', 'taxtype'
    ];
    
    fieldsToClear.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    const whonameEx = document.getElementById('whonameEx');
    if (whonameEx) whonameEx.innerHTML = '';
}

/**
 * 動態建立修改/新增 Modal 表單欄位
 */
function modifyFields(tbno, txtword, ajTable, aWaitUpdate) {
    if (tbno === 0) { // 表頭
        // 備註       
		var oTr = ajTable.insertRow(0);
        oTr.insertCell(0).outerHTML = "<td style='text-align:right;width:15%'>備註:</td>";
        oTr.insertCell(1).outerHTML = "<td colspan='3'><input type='text' name='b05update' id='remark' class='txt' maxlength='20' style='width:30%;' /></td>";
        // 匯率 & 退折       
		var oTr = ajTable.insertRow(0);
        oTr.insertCell(0).outerHTML = "<td style='text-align:right;width:15%'>匯率:</td>";
        oTr.insertCell(1).outerHTML = "<td><input type='number' name='b05update' id='curncy' value=1 class='txt' style='width:35%;text-align:right;' /></td>";
        oTr.insertCell(2).outerHTML = "<td style='text-align:right;width:15%'>退貨或折讓:</td>";
        const tdRjt = oTr.insertCell(3);
        const slt19 = document.createElement("select");
        slt19.id = "rjtOrds";
        slt19.name = "b05update";
        slt19.options.add(new Option('退回後補', '1'));
        slt19.options.add(new Option('退貨不補', '2'));
        slt19.options.add(new Option('金額折讓', '3'));
        tdRjt.appendChild(slt19);
        // 課稅別 & 幣別     
		var oTr = ajTable.insertRow(0);
        oTr.insertCell(0).outerHTML = "<td style='text-align:right;width:15%'>課稅別:</td>";
        const tdTax = oTr.insertCell(1);
        const slt6 = document.createElement("select");
        slt6.id = "taxtype";
        slt6.name = "b05update";
        slt6.options.add(new Option('應稅', '1'));
        slt6.options.add(new Option('零稅', '2'));
        slt6.options.add(new Option('免稅', '3'));
        tdTax.appendChild(slt6);
        oTr.insertCell(2).outerHTML = "<td style='text-align:right;width:15%'>幣別:</td>";
        const tdCrnt = oTr.insertCell(3);
        const slt4 = document.createElement("select");
        slt4.id = "crntopt";
        slt4.name = "b05update";
        attachEventListener(slt4, "change", ratechange, false);
        tdCrnt.appendChild(slt4);
        // 發票號碼 & 發票種類       
		var oTr = ajTable.insertRow(0);
        oTr.insertCell(0).outerHTML = "<td style='text-align:right;width:15%'>發票號碼:</td>";
        const tdInvNo = oTr.insertCell(1);
        if (txtword === 2) {
            tdInvNo.innerHTML = "<input type='text' name='b05update' id='invoiceno' class='txt' style='background-color:#B9B9FF;width:55%;' maxlength='10' readOnly=true/>";
        } else {
            tdInvNo.innerHTML = "<input type='text' name='b05update' id='invoiceno' class='txt' style='width:55%;' maxlength='10'/>";
            const btn = createSearchButton();
            tdInvNo.appendChild(btn);
        }

        oTr.insertCell(2).outerHTML = "<td style='text-align:right;width:15%'>發票種類:</td>";
        const tdInvType = oTr.insertCell(3);
        const slt8 = document.createElement("select");
        slt8.id = "invtype";
        slt8.name = "b05update";
        slt8.options.add(new Option('三聯式', '33'));
        slt8.options.add(new Option('二聯式', '34'));
        tdInvType.appendChild(slt8);
        // 原出貨月份 & 出貨單號        
		var oTr = ajTable.insertRow(0);
        oTr.insertCell(0).outerHTML = "<td style='text-align:right;width:15%'>原出貨月份:</td>";
        const tdOrgMth = oTr.insertCell(1);
        const showTime = document.getElementById('currentTime');
        const thtdy = showTime ? `${showTime.innerHTML.substring(0,4)}-${showTime.innerHTML.substring(5,7)}-${showTime.innerHTML.substring(8,10)}` : '';
        const slt11 = document.createElement("select");
        slt11.id = "orgmth";
        slt11.name = "b05update";
        optionitem(left(thtdy, 7), slt11.id, 7, "B04/BKND/A23srch.php");
        tdOrgMth.appendChild(slt11);
        oTr.insertCell(2).outerHTML = "<td style='text-align:right;width:15%'>出貨單號:</td>";
        const tdBillNo = oTr.insertCell(3);
        if (txtword === 2) {
            tdBillNo.innerHTML = "<input type='text' name='b05update' id='billno' class='txt' style='background-color:#B9B9FF;width:55%;' maxlength='10' readOnly=true />";
        } else {
            tdBillNo.innerHTML = "<input type='text' name='b05update' id='billno' class='txt' style='width:55%;' maxlength='10' />";
            tdBillNo.appendChild(createSearchButton());
        }
        // 退貨日 & 業務擔當      
		var oTr = ajTable.insertRow(0);
        oTr.insertCell(0).outerHTML = "<td style='text-align:right;width:15%'>退貨日:</td>";
        oTr.insertCell(1).innerHTML = "<input type='text' name='b05update' id='shipdate' class='txt' style='width:18%;' maxlength='2' />";       
        oTr.insertCell(2).outerHTML = "<td style='text-align:right;width:15%'>業務擔當:</td>";
        const tdWho = oTr.insertCell(3);
        tdWho.innerHTML = "<input type='text' name='b05update' id='whono' class='txt' style='width:40%;' maxlength='8' /><span name='b05others' id='whonameEx'></span>&nbsp;&nbsp;";
        tdWho.appendChild(createSearchButton());
        // 聯絡人 & 電話 (隱藏)       
		var oTr = ajTable.insertRow(0);
        oTr.style.display = "none";
        oTr.insertCell(0).outerHTML = "<td style='text-align:right;width:15%'>聯絡人:</td>";
        oTr.insertCell(1).innerHTML = "<input type='text' name='b05others' id='winname' class='txt' style='width:50%;' maxlength='40' />";
        oTr.insertCell(2).outerHTML = "<td style='text-align:right;width:15%'>電話:</td>";
        oTr.insertCell(3).innerHTML = "<input type='number' name='b05others' id='telNo' class='txt' style='width:35%;' maxlength='8' />";
        // 客戶全名 & 統一編號 (隱藏)
        oTr = ajTable.insertRow(0);
        oTr.style.display = "none";
        oTr.insertCell(0).outerHTML = "<td style='text-align:right;width:15%'>客戶全名:</td>";
        oTr.insertCell(1).innerHTML = "<input type='text' name='b05others' id='customfullname' class='txt' style='width:50%;' maxlength='40' />";
        oTr.insertCell(2).outerHTML = "<td style='text-align:right;width:15%'>統一編號:</td>";
        oTr.insertCell(3).innerHTML = "<input type='number' name='b05others' id='unitno' class='txt' style='width:35%;' maxlength='8' />";

        // 客戶代號 & 客戶簡稱
        oTr = ajTable.insertRow(0);
        oTr.insertCell(0).outerHTML = "<td style='text-align:right;width:15%'>客戶代號:</td>";
        const tdCustNo = oTr.insertCell(1);
        if (txtword === 2) {
            tdCustNo.innerHTML = "<input type='text' name='b05update' id='customno' class='txt' style='background-color:#B9B9FF;width:35%;' maxlength='6' readOnly=true />";
        } else {
            tdCustNo.innerHTML = "<input type='text' name='b05update' id='customno' class='txt' style='width:35%;' maxlength='6' />";
            tdCustNo.appendChild(createSearchButton());
        }

        oTr.insertCell(2).outerHTML = "<td style='text-align:right;width:15%'>客戶簡稱:</td>";
        const tdCustName = oTr.insertCell(3);
        if (txtword === 2) {
            tdCustName.innerHTML = "<input type='text' name='b05others' id='customname' class='txt' style='background-color:#B9B9FF;width:40%;' maxlength='8' readOnly=true />";
        } else {
            tdCustName.innerHTML = "<input type='text' name='b05others' id='customname' class='txt' style='width:40%;' maxlength='8' />";
            tdCustName.appendChild(createSearchButton());
        }
        // 出貨退回單號       
		var oTr = ajTable.insertRow(0);
        oTr.insertCell(0).outerHTML = "<td style='text-align:right;width:15%'>出貨退回單號:</td>";
        const tdQry = oTr.insertCell(1);
        tdQry.colSpan = 3;
        if (txtword === 2) {
            tdQry.innerHTML = "<input type='text' name='b05update' id='queryno' class='txt' style='background-color:#B9B9FF;width:25%;' maxlength='10' readOnly=true />";
            optionitem(aWaitUpdate[10], slt4.id, 4, "C01/BKND/C00srch.php");
            optionitem(aWaitUpdate[5], slt11.id, 7, "B04/BKND/A23srch.php");
            slt11.style.backgroundColor = "#B9B9FF";
            slt11.disabled = true;
        } else {
            tdQry.innerHTML = "<input type='text' name='b05update' id='queryno' class='txt' style='width:25%;' maxlength='10'/>";
            optionitem(getCookie('INT_011'), slt4.id, 4, "C01/BKND/C00srch.php");
        }

        // 隱藏變數 (紀錄號碼)
        
		var oTr = ajTable.insertRow(0);
        oTr.style.display = "none";
        oTr.insertCell(0).innerHTML = '紀錄號碼';
        oTr.insertCell(1).innerHTML = "<input type='text' name='b05update' id='rcrd_no' class='txt' maxlength='14' autosize />";

    } else { // 表身
        // 補貨日期
       
		var oTr = ajTable.insertRow(0);
        oTr.insertCell(0).outerHTML = "<td style='text-align:right;width:15%'>補貨日期:</td>";
        oTr.insertCell(1).innerHTML = "<input type='Date' name='b0eupdate' id='reoutdate' class='txt' style='width:30%;' />";
        if (Number(sourceAccount(20, 0)) > 1) {
            oTr.style.display = "none";
        }

        // 客戶PO       
	   var oTr = ajTable.insertRow(0);
        oTr.insertCell(0).outerHTML = "<td style='text-align:right;width:15%'>客戶PO:</td>";
        oTr.insertCell(1).innerHTML = "<input type='text' name='b0eupdate' id='customPO' class='txt' style='width:50%;' maxlength='30'/>";
        // 客戶品號        
		var oTr = ajTable.insertRow(0);
        oTr.insertCell(0).outerHTML = "<td style='text-align:right;width:15%'>客戶品號:</td>";
        oTr.insertCell(1).innerHTML = "<input type='text' name='b0eupdate' id='custompartno' class='txt' style='width:50%;' maxlength='30'/>";

        // 收貨部門
        
		var oTr = ajTable.insertRow(0);
        oTr.insertCell(0).outerHTML = "<td style='text-align:right;width:15%'>收貨部門:</td>";
        const tdDept = oTr.insertCell(1);
        tdDept.innerHTML = "<input type='text' name='b0eupdate' id='deptno' class='txt' style='width:15%;' maxlength='6' /><span name='b0eothers' id='deptname'></span>&nbsp;&nbsp;";
        tdDept.appendChild(createSearchButton());
        // 單價      
		var oTr = ajTable.insertRow(0);
        oTr.insertCell(0).outerHTML = "<td style='text-align:right;width:15%'>單價:</td>";
        oTr.insertCell(1).innerHTML = "<input type='number' name='b0eupdate' id='price' value=0 class='txt' style='width:20%;text-align:right;' />";
        // 數量        
		var oTr = ajTable.insertRow(0);
        oTr.insertCell(0).outerHTML = "<td style='text-align:right;width:15%'>數量:</td>";
        oTr.insertCell(1).innerHTML = "<input type='number' name='b0eupdate' id='queryqty' value=1 class='txt' style='width:20%;text-align:right;' />";
        // 訂單號碼       
		var oTr = ajTable.insertRow(0);
        oTr.insertCell(0).outerHTML = "<td style='text-align:right;width:15%'>訂單號碼:</td>";
        const tdOrigNo = oTr.insertCell(1);
        if (txtword === 2) {
            tdOrigNo.innerHTML = "<input type='text' name='b0eupdate' id='origno' class='txt' style='background-color:#B9B9FF;width:30%;' maxlength='10' readOnly=true />";
        } else {
            tdOrigNo.innerHTML = "<input type='text' name='b0eupdate' id='origno' class='txt' style='width:30%;' maxlength='10' />";
        }
        // 品名規格      
	   var oTr = ajTable.insertRow(0);
        oTr.insertCell(0).outerHTML = "<td style='text-align:right;width:15%'>品名規格:</td>";
        const tdStockName = oTr.insertCell(1);
        if (txtword === 2) {
            tdStockName.innerHTML = "<input type='text' name='b05others' id='stockname' class='txt' style='background-color:#B9B9FF;width:70%;' maxlength='40' readOnly=true />";
        } else {
            tdStockName.innerHTML = "<input type='text' name='b0eothers' id='stockname' class='txt' style='width:70%;' maxlength='40' />";
            tdStockName.appendChild(createSearchButton());
        }
        // 料品編號       
		var oTr = ajTable.insertRow(0);
        oTr.insertCell(0).outerHTML = "<td style='text-align:right;width:15%'>料品編號:</td>";
        const tdStockNo = oTr.insertCell(1);
        if (txtword === 2) {
            tdStockNo.innerHTML = "<input type='text' name='b0eupdate' id='stockno' class='txt' style='background-color:#B9B9FF;width:60%;' maxlength='43' readOnly=true />";
        } else {
            tdStockNo.innerHTML = "<input type='text' name='b0eupdate' id='stockno' class='txt' style='width:60%;' maxlength='43' />";
            tdStockNo.appendChild(createSearchButton());
        }
        // 隱藏變數 (紀錄號碼)        
		var oTr = ajTable.insertRow(0);
        oTr.style.display = "none";
        oTr.insertCell(0).innerHTML = '紀錄號碼';
        oTr.insertCell(1).innerHTML = "<input type='text' name='b0eupdate' id='rcrd_no' class='txt' maxlength='14' autosize />";
    }
}

/**
 * 輔助建立搜尋按鈕DOM
 */
function createSearchButton() {
    const btn = document.createElement("input");
    btn.type = "button";
    btn.className = "scopelook";
    btn.style.background = "url('digits/brows1.png')";
    attachEventListener(btn, "click", srchshow, false);
    return btn;
}

/**
 * 彈出視窗寬度調整
 */
function topAndWidthModify(dropsheet_content, dropsheet, txtword, tbno) {
    dropsheet_content.style.width = "75%";
    dropsheet.style.paddingTop = "25px";
    if (txtword === 7) {
        dropsheet_content.style.width = "60%";
    }
    return true;
}

/**
 * 初始化焦點欄位與事件綁定
 */
function initFocusField(txtword, tbno, aWaitUpdate, notWaitdata, ajTable) {
    switch (txtword) {
        case 1: { // 新增
            const thtdy = document.getElementById('recmth').value;
            if (tbno === 0) {
                const nowDate = new Date();
                const shipdateEl = document.getElementById("shipdate");
                if (shipdateEl) shipdateEl.value = paddingLeft(nowDate.getDate(), 2);

                objGetNo('queryno', 'BD' + thtdy.substring(2, 4) + parseInt(thtdy.substring(5, 7), 10).toString(16).toUpperCase());
                
                const cstNo = document.getElementById("customno");
                if (cstNo) {
                    cstNo.focus();
                    attachEventListener(cstNo, "change", c01CustomName, false);
                }

                const acntNo1 = document.getElementById("whono");
                if (acntNo1) attachEventListener(acntNo1, "change", a01AccountName, false);

            } else {
                const showTime = document.getElementById('currentTime');
                const thtdyStr = showTime ? `${showTime.innerHTML.substring(0,4)}-${showTime.innerHTML.substring(5,7)}-${showTime.innerHTML.substring(8,10)}` : '';
                const reoutdateEl = document.getElementById("reoutdate");
                if (reoutdateEl) reoutdateEl.value = thtdyStr;

                const stocknoEl = document.getElementById("stockno");
                if (stocknoEl) stocknoEl.focus();

                const dptNo1 = document.getElementById("deptno");
                if (dptNo1) attachEventListener(dptNo1, "change", a14DepartName, false);
            }
            break;
        }
        case 2: { // 修改
            const rcrdNo = document.getElementById("rcrd_no");
            if (rcrdNo) rcrdNo.value = aWaitUpdate[0];

            if (tbno === 0) {
                document.getElementById("shipdate")?.focus();
                const editinit = document.getElementsByName('b05update');
                
                const customNameEl = document.getElementById('customname');
                if (customNameEl) customNameEl.value = notWaitdata[0];

                const whonameExEl = document.getElementById('whonameEx');
                if (whonameExEl) whonameExEl.innerHTML = notWaitdata[5];

                const acntNo1 = document.getElementById("whono");
                if (acntNo1) attachEventListener(acntNo1, "change", a01AccountName, false);

                for (let k = 0; k < editinit.length; k++) {
                    editinit[k].value = aWaitUpdate[k];
                }
            } else {
                document.getElementById("queryqty")?.focus();
                const editinit = document.getElementsByName('b0eupdate');

                const stockNameEl = document.getElementById('stockname');
                if (stockNameEl) stockNameEl.value = notWaitdata[0];

                const deptNameEl = document.getElementById('deptname');
                if (deptNameEl) deptNameEl.innerHTML = notWaitdata[2];

                const dptNo1 = document.getElementById("deptno");
                if (dptNo1) attachEventListener(dptNo1, "change", a14DepartName, false);

                for (let k = 0; k < editinit.length; k++) {
                    editinit[k].value = aWaitUpdate[k];
                }
            }
            break;
        }
        case 7: { // 搜尋
            const txtseek = document.getElementById('searchWords');
            if (txtseek) {
                txtseek.focus();
                attachEventListener(txtseek, 'keypress', textKeypress, false);
            }
            break;
        }
    }
}

/**
 * 新增欄位後的 DOM 動態寫入
 */
function colomnAfterChange(tbno, oTr, args, nongs, rsp) {
    const rnddgt = getCookie('INT_069');
    let ttlcnt = Number(document.getElementById('ttlmny').innerHTML);
    let fldidx = 0;
    let argsNo = 0;

    while (rsp.fldsatrr[fldidx]) {
        const oTd = oTr.insertCell(oTr.cells.length);

        if (rsp.fldsatrr[fldidx][0] === 'directdata') {
            oTd.innerHTML = args[argsNo];
            argsNo++;
        } else {
            if (tbno === 0) {
                if (fldidx === 2) oTd.innerHTML = nongs[0];
                if (fldidx === 3) oTd.innerHTML = nongs[1];
                if (fldidx === 4) oTd.innerHTML = nongs[2];
                if (fldidx === 5) oTd.innerHTML = nongs[3];
                if (fldidx === 6) oTd.innerHTML = nongs[4];
                if (fldidx === 9) oTd.innerHTML = nongs[5];
                if (fldidx === 14) oTd.innerHTML = whichinvoice(args[7]);
                if (fldidx === 16) oTd.innerHTML = whichtax(args[8]);
                if (fldidx === 20) oTd.innerHTML = (args[11] === '1' ? '退回後補' : (args[11] === '2' ? '退貨不補' : '金額折讓'));
                if (fldidx === 22) oTd.innerHTML = 'N';
            } else {
                if (fldidx === 1) oTd.innerHTML = nongs[0];
                if (fldidx === 7) oTd.innerHTML = nongs[1];
                if (fldidx === 5) {
                    const subtotal = Math.round((args[2] * args[3] + Number.EPSILON) * Math.pow(10, rnddgt)) / Math.pow(10, rnddgt);
                    oTd.innerHTML = subtotal;
                    ttlcnt += subtotal;
                    document.getElementById('ttlmny').innerHTML = ttlcnt;
                }
            }
        }

        oTd.className = rsp.fldsatrr[fldidx][0];
        if (rsp.fldsatrr[fldidx][1] === 'none') {
            oTd.style.display = "none";
        } else {
            oTd.style.textAlign = rsp.fldsatrr[fldidx][2];
            oTd.style.width = rsp.fldsatrr[fldidx][3] + "%";
        }
        fldidx++;
    }

    if (tbno === 0) {
        oTr.style.fontWeight = "bold";
        oTr.style.color = "#704214";
    }

    const oTdLast = oTr.insertCell(oTr.cells.length);
    oTdLast.className = "directdata";
    oTdLast.innerHTML = rsp.lastupdate;
    oTdLast.style.display = "none";
}

/**
 * 修改欄位後的 DOM 動態更新
 */
function colomnContextChange(tbno, args, nongs, arglth, rsp) {
    const rnddgt = getCookie('INT_069');
    const maintable = document.getElementById(tbno === 0 ? "maintbody1" : "maintbody2");
    if (!maintable) return;

    let fldidx = tbno === 0 ? 4 : 3;
    let argsNo = 2;
    const targetRow = maintable.rows[args[arglth - 1]];
    if (!targetRow) return;

    let ttlcnt = 0;
    if (tbno === 1) {
        ttlcnt = Number(document.getElementById('ttlmny').innerHTML) - Number(targetRow.cells[6].innerHTML);
    }

    if (parseInt(args[11], 10) > 3) {
        args[11] = (parseInt(args[11], 10) - 6).toString();
    }

    while (rsp.fldsatrr[fldidx]) {
        if (rsp.fldsatrr[fldidx][0] === 'directdata') {
            if (fldidx === 3 && tbno === 1) {
                const orderQty = Number(targetRow.cells[fldidx + 1].innerHTML) + Number(args[2]);
                targetRow.cells[fldidx + 1].innerHTML = orderQty;
            } else {
                targetRow.cells[fldidx + 1].innerHTML = args[argsNo];
            }
            argsNo++;
        } else {
            if (tbno === 0) {
                if (fldidx === 9) targetRow.cells[fldidx + 1].innerHTML = nongs[5];
                if (fldidx === 14) targetRow.cells[fldidx + 1].innerHTML = whichinvoice(args[7]);
                if (fldidx === 16) targetRow.cells[fldidx + 1].innerHTML = whichtax(args[8]);
                if (fldidx === 20) targetRow.cells[fldidx + 1].innerHTML = (args[11] === '1' ? '退回後補' : (args[11] === '2' ? '退貨不補' : '金額折讓'));
            } else {
                if (fldidx === 5) {
                    const orderQty = Number(targetRow.cells[4].innerHTML);
                    const subtotal = Math.round((orderQty * args[3] + Number.EPSILON) * Math.pow(10, rnddgt)) / Math.pow(10, rnddgt);
                    ttlcnt += subtotal;
                    document.getElementById('ttlmny').innerHTML = ttlcnt;
                    targetRow.cells[fldidx + 1].innerHTML = subtotal;
                }
                if (fldidx === 7) targetRow.cells[fldidx + 1].innerHTML = nongs[0];
            }
        }
        fldidx++;
    }

    targetRow.cells[fldidx + 1].innerHTML = rsp.lastupdate;
}

function transConfirm(oTd) {
    return true;
}

function addNewRecordHint(tbno) {
    return tbno === 0 ? "請輸入出貨退回單表頭資料：" : "請輸入出貨退回單內容資料：";
}

function editRecordHint(tbno) {
    return tbno === 0 ? "修改出貨退回單表頭資料：" : "修改出貨退回單內容資料：";
}

function searchKeyHint(tbno) {
    return tbno === 0 ? "搜尋出貨退回單單頭欄位選擇" : "搜尋出貨退回單單身欄位選擇";
}

/**
 * 彈出開窗選擇畫面參數設置
 */
function srcArgobj(srcId) {
    const val = document.getElementById(srcId)?.value ?? '';

    if (srcId === 'customno' || srcId === 'customname') {
        const isNo = srcId === 'customno';
        return {
            "headtitle": isNo ? "請選取客戶代號" : "請選取客戶簡稱",
            "drpshtWidth": "28%",
            "urlPth": "B05/BKND/C01srch.php",
            "clickfunc": chsecust,
            "qryString": `${isNo ? 'c01.F01' : 'c01.F05'}|${val}`,
            "mendwidth": "calc( 100% - 1em )"
        };
    } else if (srcId === 'whono') {
        return {
            "headtitle": "請選取業務人員帳號姓名",
            "drpshtWidth": "28%",
            "urlPth": "C01/BKND/A01srch.php",
            "clickfunc": chseprg1,
            "qryString": val,
            "mendwidth": "calc( 100% )"
        };
    } else if (srcId === 'deptno') {
        return {
            "headtitle": "請選取出貨部門",
            "drpshtWidth": "28%",
            "urlPth": "B02/BKND/A14srch.php",
            "clickfunc": deptchoose,
            "qryString": `${val}|Y| | `,
            "mendwidth": "calc( 100% )"
        };
    } else if (srcId === 'billno' || srcId === 'invoiceno') {
        const isBill = srcId === 'billno';
        const orgmth = document.getElementById('orgmth')?.value ?? '';
        const customno = document.getElementById('customno')?.value ?? '';
        return {
            "headtitle": isBill ? "請選取出貨單號" : "請選取發票號碼",
            "drpshtWidth": "28%",
            "urlPth": "B05/BKND/B04srch.php",
            "clickfunc": bill_no,
            "qryString": `${isBill ? 'b04.F01' : 'b04.F20'}|${val}|${orgmth}|${customno}`,
            "mendwidth": "calc( 100% - 1em )"
        };
    } else {
        const shp_no = sourceAccount(12, 0);
        const isStockNo = srcId === 'stockno';
        return {
            "headtitle": isStockNo ? "請選取料號" : "請選取品名",
            "drpshtWidth": "80%",
            "urlPth": "B05/BKND/B01srch.php",
            "clickfunc": stckchg,
            "qryString": `${isStockNo ? 'b0d.F03' : 'b01.F02'}|${val}_${shp_no}`,
            "mendwidth": "calc( 100% )"
        };
    }
}

/**
 * 彈窗點選值帶回對應欄位 (選擇業務)
 */
function chseprg1(event) {
    const stuffNo = document.getElementById('whono');
    const stuffName = document.getElementById('whonameEx');
    if (stuffNo) stuffNo.value = "";
    if (stuffName) stuffName.innerHTML = "";

    const maintable = document.getElementById("stuffTbody");
    if (maintable) {
        for (let i = 0; i < maintable.rows.length; i++) {
            const row = maintable.rows[i];
            const checkCell = row.cells[row.cells.length - 1];
            if (checkCell?.childNodes[0]?.checked) {
                if (stuffNo) stuffNo.value = row.cells[0].innerHTML;
                if (stuffName) stuffName.innerHTML = row.cells[1].innerHTML;
                break;
            }
        }
    }
    srchblkclose(event);
    return true;
}

/**
 * 彈窗點選值帶回對應欄位 (選擇料號)
 */
function stckchg(event) {
    const elements = {
        stockNo: document.getElementById('stockno'),
        stockName: document.getElementById('stockname'),
        orderNo: document.getElementById('origno'),
        shipQty: document.getElementById('queryqty'),
        shipPrice: document.getElementById('price'),
        custstockno: document.getElementById('custompartno'),
        custpo: document.getElementById('customPO'),
        deptno: document.getElementById('deptno'),
        deptname: document.getElementById('deptname')
    };

    if (elements.stockNo) elements.stockNo.value = "";
    if (elements.stockName) elements.stockName.value = "";

    const maintable = document.getElementById("stuffTbody");
    if (maintable) {
        for (let i = 0; i < maintable.rows.length; i++) {
            const row = maintable.rows[i];
            const checkCell = row.cells[row.cells.length - 1];
            if (checkCell?.childNodes[0]?.checked) {
                if (elements.stockNo) elements.stockNo.value = row.cells[0].innerHTML;
                if (elements.stockName) elements.stockName.value = row.cells[1].innerHTML;
                if (elements.orderNo) elements.orderNo.value = row.cells[2].innerHTML;
                if (elements.shipQty) elements.shipQty.value = row.cells[3].innerHTML;
                if (elements.shipPrice) elements.shipPrice.value = row.cells[4].innerHTML;
                if (elements.custstockno) elements.custstockno.value = row.cells[5].innerHTML;
                if (elements.custpo) elements.custpo.value = row.cells[6].innerHTML;
                if (elements.deptno) elements.deptno.value = row.cells[7].innerHTML;
                if (elements.deptname) elements.deptname.innerHTML = row.cells[8].innerHTML;
                break;
            }
        }
    }
    srchblkclose(event);
    return true;
}

/**
 * 彈窗點選值帶回對應欄位 (選擇客戶)
 */
function chsecust(event) {
    const elements = {
        custNo: document.getElementById('customno'),
        custName: document.getElementById('customname'),
        rprsntno: document.getElementById('whono'),
        rprsntname: document.getElementById('whonameEx'),
        crnttpe: document.getElementById('crntopt'),
        contactman: document.getElementById('winman'),
        crntrate: document.getElementById('curncy'),
        invoicetype: document.getElementById('invtype'),
        taxkind: document.getElementById('taxtype'),
        custFullName: document.getElementById('customfullname'),
        custUnitno: document.getElementById('unitno'),
        custTelno: document.getElementById('telNo')
    };

    if (elements.custNo) elements.custNo.value = "";
    if (elements.custName) elements.custName.value = "";

    const maintable = document.getElementById("stuffTbody");
    if (maintable) {
        for (let i = 0; i < maintable.rows.length; i++) {
            const row = maintable.rows[i];
            const checkCell = row.cells[row.cells.length - 1];
            if (checkCell?.childNodes[0]?.checked) {
                if (elements.custNo) elements.custNo.value = row.cells[0].innerHTML;
                if (elements.custName) elements.custName.value = row.cells[1].innerHTML;
                if (elements.rprsntno) elements.rprsntno.value = row.cells[2].innerHTML;
                if (elements.rprsntname) elements.rprsntname.innerHTML = row.cells[3].innerHTML;
                if (elements.crnttpe) elements.crnttpe.value = row.cells[4].innerHTML;
                if (elements.contactman) elements.contactman.value = row.cells[5].innerHTML;
                if (elements.crntrate) elements.crntrate.value = row.cells[6].innerHTML;
                if (elements.invoicetype) elements.invoicetype.value = Number(row.cells[7].innerHTML) + 2;
                if (elements.taxkind) elements.taxkind.value = row.cells[8].innerHTML;
                if (elements.custFullName) elements.custFullName.value = row.cells[9].innerHTML;
                if (elements.custUnitno) elements.custUnitno.value = row.cells[10].innerHTML;
                if (elements.custTelno) elements.custTelno.value = row.cells[11].innerHTML;
                break;
            }
        }
    }
    srchblkclose(event);
    return true;
}

/**
 * 彈窗點選值帶回對應欄位 (選擇出貨單號)
 */
function bill_no(event) {
    const elements = {
        billNo: document.getElementById('billno'),
        invoiceNo: document.getElementById('invoiceno'),
        crnttpe: document.getElementById('crntopt'),
        crntrate: document.getElementById('curncy'),
        invoicetype: document.getElementById('invtype'),
        taxkind: document.getElementById('taxtype')
    };

    if (elements.billNo) elements.billNo.value = "";
    if (elements.invoiceNo) elements.invoiceNo.value = "";

    const maintable = document.getElementById("stuffTbody");
    if (maintable) {
        for (let i = 0; i < maintable.rows.length; i++) {
            const row = maintable.rows[i];
            const checkCell = row.cells[row.cells.length - 1];
            if (checkCell?.childNodes[0]?.checked) {
                if (elements.billNo) elements.billNo.value = row.cells[0].innerHTML;
                if (elements.invoiceNo) elements.invoiceNo.value = row.cells[1].innerHTML;
                if (elements.crnttpe) elements.crnttpe.value = row.cells[2].innerHTML;
                if (elements.crntrate) elements.crntrate.value = row.cells[3].innerHTML;
                if (elements.invoicetype) elements.invoicetype.value = Number(row.cells[4].innerHTML) + 2;
                if (elements.taxkind) elements.taxkind.value = row.cells[5].innerHTML;
                break;
            }
        }
    }
    srchblkclose(event);
    return true;
}