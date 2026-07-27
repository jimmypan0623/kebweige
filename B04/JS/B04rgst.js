//B04rgst.js 出貨單新增修改與其他查詢畫面
function blocksclose(event) { //關閉註冊彈出視窗
    if (typeof event == "undefined") {
        event = window.event;
    }
    var target = getEventTarget(event);
    var tabs = getElementsByAttribute('class', 'tab');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].setAttribute("accesskey", (i + 1).toString());
    }
    if (tabs[0].checked) {
        if (target.value == "\u{274E}" && getAuth[2]()[0].INT_013 == 'Y') {
            var maintable = document.getElementById("maintbody1");
            var tablerowindex = 0;
            for (var i = 0; i < maintable.rows.length; i++) {
                if (maintable.rows[i].cells[maintable.rows[i].cells.length - 1].childNodes[0].checked) {
                    tablerowindex = i; //記住是目前table的哪一列			 
                    break;
                }
            }

            if (maintable.rows.length > 0) { //如果不為空檔
                var query_no = maintable.rows[tablerowindex].cells[1].innerHTML;
            } else {
                var query_no = "BCxxxxxxxx";
            }
            if (document.getElementById('queryno') != null) {
                var currentNo = document.getElementById('queryno').value;
                if (currentNo.trim() != "" && currentNo.trim() != query_no) { //如果非修改且自動編號		
                    const regexA = /^BC\d{2}[1-9A-C]\d{5}$/;
                    if (regexA.test(currentNo.trim())) {
                        var thtdy = document.getElementById('recmth').value;
                        discardNoRec('BC' + thtdy.substring(2, 4) + parseInt(thtdy.substring(5, 7)).toString(16).toUpperCase(), currentNo.trim());
                    }
                }
            }
        }
    }
    var dropsheet = document.getElementById("myModal");
    dropsheet.style.display = "none"; //關閉視窗 
    dropsheet.remove(); //並將這些元素移除
    var btns = getElementsByAttribute('class', 'btn');
    for (var i = 0; i < btns.length; i++) {
        if (tabs[0].checked) {
            if (right(btns[i].title, 1) == 'M' || right(btns[i].title, 1) == 'I') {
                btns[i].removeAttribute("accesskey");
            } else {
                btns[i].setAttribute("accesskey", right(btns[i].title, 1));
            }
        } else {
            if (right(btns[i].title, 1) == 'J' || right(btns[i].title, 1) == 'K' || right(btns[i].title, 1) == 'T' || right(btns[i].title, 1) == 'V') {
                btns[i].removeAttribute("accesskey");
            } else {
                btns[i].setAttribute("accesskey", right(btns[i].title, 1));
            }
        }
    }
    return true;
}

function sendFilePrc(updflg) { //新增資料及修改程序       
    var tbjsn = [];
    var nonjsn = [];

    //----資料寫入資料庫前過濾程序區-----//
    var tabs = getElementsByAttribute('class', 'tab');
    var tbno = 0;
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].checked) {
            tbno = i;
            break;
        }
    }
    if (tbno == 0) {
        var b04elements = document.getElementsByName('b04update');
        var b04athments = document.getElementsByName('b04others');
    } else {
        var b04elements = document.getElementsByName('b0dupdate');
        var b04athments = document.getElementsByName('b0dothers');
    }
    var recordNo = document.getElementById("rcrd_no" + (tbno + 1).toString());
    for (var r = 0; r < b04athments.length; r++) { //關聯資料
        nonjsn.push(b04athments[r].tagName.toUpperCase() == 'SPAN' ? b04athments[r].innerHTML : b04athments[r].value);
    }
    for (var q = 1; q < b04elements.length; q++) { //開始堆疊待異動資料陣列
        tbjsn.push(b04elements[q].value);
    }
    for (var j = 1; j < b04elements.length - 1; j++) {
        if (tbno == 0 && j == 3) {
            let oDate = new Date(document.getElementById('recmth').value + '-' + b04elements[j].value);
            let cYear = oDate.getFullYear();
            let cMonth = oDate.getMonth() + 1;
            let cDate = oDate.getDate();
            let iYear = left(document.getElementById('recmth').value, 4);
            let iMonth = right(document.getElementById('recmth').value, 2);
            let iDate = paddingLeft(b04elements[j].value.trim(), 2);
            let result = (iYear == cYear) && (iMonth == cMonth) && (iDate == cDate);
            if (!result) {
                filtermsg(b04elements[j], "日期格式不對");
                return false;
            } else {
                if (b04elements[j].nextSibling) {
                    b04elements[j].parentNode.removeChild(b04elements[j].nextSibling);
                }
            }
        }

        if (b04elements[j].value.trim() == "" && !((j == 8 || j == 6) && tbno == 1) && !((j == 7 || j == 8 || j == 9) && tbno == 0)) {
            if (j == 1) {
                b04elements[j].placeholder = "不得空白";
            } else {
                filtermsg(b04elements[j], "不得空白");
            }
            return false;
        } else {
            if (b04elements[j].nextSibling) {
                if (!((j == 4 && tbno == 0) || (j == 1 && tbno == 1))) { //非人名與料號移除
                    b04elements[j].parentNode.removeChild(b04elements[j].nextSibling);
                }
            }
            if ((tbno == 1 && (j == 3 || j == 4)) || (tbno == 0 && j == 6)) {
                if (b04elements[j].value == 0) {
                    filtermsg(b04elements[j], "不得為 0");
                    return false;
                }
            }
        }
    }
    //--------過濾區結束----------//	
    if (tbno == 0) { //處理幣別名稱
        var selectElement = document.getElementById("crntopt");
        var slicelth = selectElement.value.length;
        nonjsn.splice(6, 0, selectElement.options[selectElement.selectedIndex].text.slice(slicelth)); //取得幣別名稱內容		
    }

    if (updflg == 1) { //如果是新增	 	   
        if (b04elements[1].value != "") {
            if (tbno == 0) { //表頭新增
                var blngmth = document.getElementById('recmth').value;
                tbjsn.push(blngmth); //要多一個所屬年月參數				
            } else { //表身新增			  
                tbjsn.push(sourceAccount(2, 0)); //記住表頭客戶編號 		
            }
            tbjsn.push('0');
            tbjsn.push('0');
            var rspns = TableToJson(tbjsn, nonjsn, tbno);
        } else {
            blkshow("欄位資料不齊全無法新增權限");
        }
    } else { //如果是修改
        if (typeof updflg == "undefined") {
            updflg = window.event;
        }
        var target = getEventTarget(updflg);
        if (tbno == 1) { //如果是表身		   
            tbjsn[2] = b04elements[3].value - sourceAccount(4, 1); //傳到後端為新數量減原出貨數之差
            tbjsn.push(sourceAccount(2, 0)); //記住表頭客戶編號
        }
        var tablerowindex = sourceAccount(null, tbno); //記住是目前table的哪一列	
        tbjsn.push(recordNo.value);
        tbjsn.push(tablerowindex);
        var rspns = TableToJson(tbjsn, nonjsn, tbno);
    }
    blocksclose(); //關掉原視窗   
    return true;
}

function calculateTtl(tbno, maintable, i) { //刪除確認(delConfirm)中挑出之個別程序 
    if (tbno == 1) { //計算本單總金額
        var ttlcnt = Number(document.getElementById('ttlmny').innerHTML);
        var crntsum = Number(maintable.rows[i].cells[6].innerHTML);
        document.getElementById('ttlmny').innerHTML = ttlcnt - crntsum;
    }
    return;
}

function billNoReCreate(currentNo) { //刪除確認(delConfirm)中挑出之個別程序
    if (getAuth[2]()[0].INT_099 == 'Y' && getAuth[2]()[0].INT_013 == 'Y') { //如果是系統參數設為自動編號且刪掉號碼重用			
        const regexA = /^BC\d{2}[1-9A-C]\d{5}$/;
        if (regexA.test(currentNo.trim())) {
            var thtdy = document.getElementById('recmth').value;
            discardNoRec('BC' + thtdy.substring(2, 4) + parseInt(thtdy.substring(5, 7)).toString(16).toUpperCase(), currentNo.trim());
        }
    }
    return;
}

// ratechange: 簡化後的匯率搜尋
async function ratechange(event) {
    const e = event || window.event;
    const target = getEventTarget(e);
    const formData = new URLSearchParams({ filename: target.value });

    try {
        const response = await fetch(`B04/BKND/C00srch.php?timestamp=${Date.now()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        if (response.ok) {
            const text = await response.text();
            document.getElementById("curncy").value = Number(text);
        }
    } catch (err) {
        console.error("Rate change search failed:", err);
    }
}

// rateSrch: 採用 async/await 簡化
async function rateSrch(event) {
    const e = event || window.event;
    const target = getEventTarget(e);
    const crtNow = document.getElementById('crntopt').value;
    const ckc = document.getElementById("recmth");
    const rte = document.getElementById('curncy');

    if (getAuth[2]()[0].INT_011 != crtNow) {
        const formData = new URLSearchParams({
            filename: `${crtNow}|${ckc.value}|${target.value}`
        });

        try {
            const response = await fetch(`B04/BKND/C0ZRateChange.php?timestamp=${Date.now()}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });
            if (response.ok) {
                const rsp = await response.json();
                if (rsp[0] && rsp[0]['curncy'] > 0) {
                    rte.value = rsp[0]['curncy'];
                }
            }
        } catch (err) {
            console.error("Rate Srch failed:", err);
        }
    }
}

// c01CustomName: 採用 async/await 簡化
async function c01CustomName(event) {
    const e = event || window.event;
    const targetCustomNo = getEventTarget(e);
    const formData = new URLSearchParams({ filename: targetCustomNo.value });

    try {
        const response = await fetch(`B04/BKND/C01CustomName.php?timestamp=${Date.now()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });

        if (response.ok) {
            const rsp = await response.json();
            if (rsp && rsp[0]) {
                const data = rsp[0];
                document.getElementById('customname').value = data['customname'];
                document.getElementById('customfullname').value = data['customfullname'];
                document.getElementById('unitno').value = data['unitno'];
                document.getElementById('winname').value = data['winname'];
                document.getElementById('telNo').value = data['telNo'];
                document.getElementById('whono').value = data['whono'];
                document.getElementById('whonameEx').innerHTML = data['whonameEx'];
                document.getElementById('crntopt').value = data['crntopt'];
                document.getElementById('curncy').value = data['curncy'];
                document.getElementById('invtype').value = data['invtype'];
                document.getElementById('taxtype').value = data['taxtype'];
                document.getElementById('howpay').value = data['howpay'];
                document.getElementById('dlvrplace').value = data['dlvrplace'];
                document.getElementById('shipdirect').value = data['shipdirect'];
            }
        }
    } catch (err) {
        console.error("Custom Name fetch failed:", err);
    }
}

function modifyFields(tbno, txtword, ajTable, aWaitUpdate) { //新增修改時出現之欄位
    if (tbno == 0) { //如果異動表頭資料			     				
        //var oTr = ajTable.insertRow(ajTable, ajTable.length);
		var oTr = ajTable.insertRow(0);
        var oTd = oTr.insertCell(0);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '出貨指示:';
        var oTd = oTr.insertCell(1);
        oTd.colspan = 3;
        oTd.innerHTML = "<input type='text' name='b04update' id='shipdirect' class='txt' style='width:35%;' maxlength='40'    />";
        var oTr = ajTable.insertRow(ajTable, ajTable.length);
        var oTd = oTr.insertCell(0);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '交貨地點:';
        var oTd = oTr.insertCell(1);
        oTd.colspan = 3;
        oTd.innerHTML = "<input type='text' name='b04update' id='dlvrplace' class='txt' style='width:90%;' maxlength='137'    />";
        var oTr = ajTable.insertRow(ajTable, ajTable.length);

        var oTd = oTr.insertCell(0);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '課稅別:';
        var oTd = oTr.insertCell(1);
        var slt5 = document.createElement("select");
        slt5.options.add(new Option('應稅', '1'));
        slt5.options.add(new Option('零稅', '2'));
        slt5.options.add(new Option('免稅', '3'));
        slt5.setAttribute("id", "taxtype");
        slt5.setAttribute("name", "b04update");
        oTd.appendChild(slt5);
        var oTd = oTr.insertCell(2);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '付款方式:';
        var oTd = oTr.insertCell(3);
        oTd.innerHTML = "<input type='text' name='b04update' id='howpay' class='txt' style='width:50%;' maxlength='30'    />";

        var oTr = ajTable.insertRow(ajTable, ajTable.length);
        var oTd = oTr.insertCell(0);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '發票號碼:';
        var oTd = oTr.insertCell(1);

        oTd.innerHTML = "<input type='text' name='b04update' id='invoiceno' class='txt' style='width:50%;' maxlength='10'    />";
        var oTd = oTr.insertCell(2);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '發票種類:';
        var oTd = oTr.insertCell(3);
        var slt8 = document.createElement("select");
        slt8.options.add(new Option('三聯式', '31'));
        slt8.options.add(new Option('二聯式', '32'));
        slt8.setAttribute("id", "invtype");
        slt8.setAttribute("name", "b04update");
        oTd.appendChild(slt8);

        var oTr = ajTable.insertRow(ajTable, ajTable.length);
        var oTd = oTr.insertCell(0);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '幣別:';
        var oTd = oTr.insertCell(1);
        var slt4 = document.createElement("select");
        slt4.setAttribute("id", "crntopt");
        slt4.setAttribute("name", "b04update");
        attachEventListener(slt4, "change", ratechange, false);
        oTd.appendChild(slt4);
        var oTd = oTr.insertCell(2);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '匯率:';
        var oTd = oTr.insertCell(3);
        oTd.innerHTML = "<input type='number' name='b04update' id='curncy' value=1 class='txt' style='width:35%;text-align:right;' />";
        var oTr = ajTable.insertRow(ajTable, ajTable.length);
        var oTd = oTr.insertCell(0);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '出貨日:';
        var oTd = oTr.insertCell(1);
        oTd.innerHTML = "<input type='text' name='b04update' id='shipdate' class='txt' style='width:18%;' maxlength='2'   />";
        var oTd = oTr.insertCell(2);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '業務擔當:';
        var oTd = oTr.insertCell(3);
        oTd.innerHTML = "<input type='text' name='b04update' id='whono' class='txt' style='width:40%;' maxlength='8'    />";
        oTd.innerHTML += "<span name='b04others' id='whonameEx'></span>&nbsp&nbsp";
        var srchButton1 = document.createElement("input");
        srchButton1.setAttribute("type", "button");
        srchButton1.setAttribute("class", "scopelook");
        srchButton1.style.background = "url('digits/brows1.png')";
        attachEventListener(srchButton1, "click", srchshow, false);
        oTd.appendChild(srchButton1);
        var oTr = ajTable.insertRow(ajTable, ajTable.length);
        var oTd = oTr.insertCell(0);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '聯絡人:';
        var oTd = oTr.insertCell(1);
        oTd.innerHTML = "<input type='text' name='b04others' id='winname' class='txt' style='width:50%;' maxlength='40'    />";
        var oTd = oTr.insertCell(2);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '電話:';
        var oTd = oTr.insertCell(3);
        oTd.innerHTML = "<input type='number' name='b04others' id='telNo'  class='txt' style='width:35%;' maxlength='8'  />";
        oTr.setAttribute("style", "display:none;"); //整列隱藏		
        var oTr = ajTable.insertRow(ajTable, ajTable.length);
        var oTd = oTr.insertCell(0);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '客戶全名:';
        var oTd = oTr.insertCell(1);
        oTd.innerHTML = "<input type='text' name='b04others' id='customfullname' class='txt' style='width:50%;' maxlength='40'    />";
        var oTd = oTr.insertCell(2);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '統一編號:';
        var oTd = oTr.insertCell(3);
        oTd.innerHTML = "<input type='number' name='b04others' id='unitno'  class='txt' style='width:35%;' maxlength='8'  />";
        oTr.setAttribute("style", "display:none;"); //整列隱藏	   
        var oTr = ajTable.insertRow(ajTable, ajTable.length);
        var oTd = oTr.insertCell(0);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '客戶代號:';
        var oTd = oTr.insertCell(1);
        if (txtword == 2) { //如果是修改	
            oTd.innerHTML = "<input type='text' name='b04update' id='customno' class='txt' style='background-color:#B9B9FF;width:35%;' maxlength='6' readOnly=true  />";
        } else {
            oTd.innerHTML = "<input type='text' name='b04update' id='customno' class='txt' style='width:35%;' maxlength='6'    />";
            var srchButton3 = document.createElement("input");
            srchButton3.setAttribute("type", "button");
            srchButton3.setAttribute("class", "scopelook");
            srchButton3.style.background = "url('digits/brows1.png')";
            attachEventListener(srchButton3, "click", srchshow, false);
            oTd.appendChild(srchButton3);
        }
        var oTd = oTr.insertCell(2);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '客戶簡稱:';
        var oTd = oTr.insertCell(3);
        if (txtword == 2) { //如果是修改	
            oTd.innerHTML = "<input type='text' name='b04others' id='customname' class='txt' style='background-color:#B9B9FF;width:40%;' maxlength='8' readOnly=true  />";
        } else {
            oTd.innerHTML = "<input type='text' name='b04others' id='customname' class='txt' style='width:40%;' maxlength='8'    />";
            var srchButton2 = document.createElement("input");
            srchButton2.setAttribute("type", "button");
            srchButton2.setAttribute("class", "scopelook");
            srchButton2.style.background = "url('digits/brows1.png')";
            attachEventListener(srchButton2, "click", srchshow, false);
            oTd.appendChild(srchButton2);
        }
        var oTr = ajTable.insertRow(ajTable, ajTable.length);
        var oTd = oTr.insertCell(0);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '出貨單號:';
        var oTd = oTr.insertCell(1);
        oTd.colspan = 3;
        if (txtword == 2) { //如果是修改		                    
            oTd.innerHTML = "<input type='text' name='b04update' id='queryno' class='txt' style='background-color:#B9B9FF;width:25%;' maxlength='10' readOnly=true  />";
            optionitem(aWaitUpdate[5], slt4.id, 4, "C01/BKND/C00srch.php"); //幣別欄位				   
        } else {
            oTd.innerHTML = "<input type='text' name='b04update' id='queryno' class='txt' style='width:25%;' maxlength='10'/>";
            optionitem(getAuth[2]()[0].INT_011, slt4.id, 4, "C01/BKND/C00srch.php");
        }
        var oTr = ajTable.insertRow(ajTable, ajTable.length); //以下第一列都隱藏起來當變數
        var oTd = oTr.insertCell(0);
        oTd.innerHTML = '紀錄號碼';
        var oTd = oTr.insertCell(1);
        oTd.innerHTML = "<input type='text' name='b04update' id='rcrd_no1' class='txt' maxlength='14' autosize  />";
        oTr.setAttribute("style", "display:none;");
    } else { //異動表身資料			
        var oTr = ajTable.insertRow(ajTable, ajTable.length);
        var oTd = oTr.insertCell(0);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '備註:';
        var oTd = oTr.insertCell(1);
        oTd.innerHTML = "<input type='text' name='b0dupdate' id='extradsp' class='txt' style='width:50%;' maxlength='20'/>";
        var oTr = ajTable.insertRow(ajTable, ajTable.length);
        var oTd = oTr.insertCell(0);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '客戶PO:';
        var oTd = oTr.insertCell(1);
        oTd.innerHTML = "<input type='text' name='b0dupdate' id='customPO' class='txt' style='width:50%;' maxlength='30'/>";
        var oTr = ajTable.insertRow(ajTable, ajTable.length);
        var oTd = oTr.insertCell(0);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '客戶品號:';
        var oTd = oTr.insertCell(1);
        oTd.innerHTML = "<input type='text' name='b0dupdate' id='custompartno' class='txt' style='width:50%;' maxlength='30'/>";
        var oTr = ajTable.insertRow(ajTable, ajTable.length);
        var oTd = oTr.insertCell(0);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '出貨部門:';
        var oTd = oTr.insertCell(1);
        oTd.innerHTML = "<input type='text' name='b0dupdate' id='deptno' class='txt' style='width:15%;' maxlength='6'    />";
        oTd.innerHTML += "<span name='b0dothers' id='deptname'></span>&nbsp&nbsp";
        var srchButton5 = document.createElement("input");
        srchButton5.setAttribute("type", "button");
        srchButton5.setAttribute("class", "scopelook");
        srchButton5.style.background = "url('digits/brows1.png')";
        attachEventListener(srchButton5, "click", srchshow, false);
        oTd.appendChild(srchButton5);
        var oTr = ajTable.insertRow(ajTable, ajTable.length);
        var oTd = oTr.insertCell(0);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '單價:';
        var oTd = oTr.insertCell(1);
        oTd.innerHTML = "<input type='number' name='b0dupdate' id='price' value=0 class='txt' style='width:20%;text-align:right;' />";
        var oTr = ajTable.insertRow(ajTable, ajTable.length);
        var oTd = oTr.insertCell(0);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '數量:';
        var oTd = oTr.insertCell(1);
        oTd.innerHTML = "<input type='number' name='b0dupdate' id='queryqty' value=1 class='txt' style='width:20%;text-align:right;' />";
        var oTr = ajTable.insertRow(ajTable, ajTable.length);
        var oTd = oTr.insertCell(0);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '訂單號碼:';
        var oTd = oTr.insertCell(1);
        if (txtword == 2) { //如果是修改
            oTd.innerHTML = "<input type='text' name='b0dupdate' id='origno' class='txt' style='background-color:#B9B9FF;width:30%;' maxlength='10' readOnly=true />";
        } else {
            oTd.innerHTML = "<input type='text' name='b0dupdate' id='origno' class='txt' style='width:30%;' maxlength='10'    />";
        }
        var oTr = ajTable.insertRow(ajTable, ajTable.length);
        var oTd = oTr.insertCell(0);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '品名規格:';
        var oTd = oTr.insertCell(1);
        if (txtword == 2) { //如果是修改
            oTd.innerHTML = "<input type='text' name='b04others' id='stockname' class='txt' style='background-color:#B9B9FF;width:70%;' maxlength='40' readOnly=true />";
        } else {
            oTd.innerHTML = "<input type='text' name='b0dothers' id='stockname' class='txt' style='width:70%;' maxlength='40'    />";
            var srchButton8 = document.createElement("input");
            srchButton8.setAttribute("type", "button");
            srchButton8.setAttribute("class", "scopelook");
            srchButton8.style.background = "url('digits/brows1.png')";
            attachEventListener(srchButton8, "click", srchshow, false);
            oTd.appendChild(srchButton8);
        }
        var oTr = ajTable.insertRow(ajTable, ajTable.length);
        var oTd = oTr.insertCell(0);
        oTd.setAttribute('style', 'text-align:right;width:15%');
        oTd.innerHTML = '料品編號:';
        var oTd = oTr.insertCell(1);
        if (txtword == 2) { //如果是修改	
            oTd.innerHTML = "<input type='text' name='b0dupdate' id='stockno' class='txt' style='background-color:#B9B9FF;width:60%;' maxlength='43' readOnly=true  />";
        } else {
            oTd.innerHTML = "<input type='text' name='b0dupdate' id='stockno' class='txt' style='width:60%;' maxlength='43'    />";
            var srchButton4 = document.createElement("input");
            srchButton4.setAttribute("type", "button");
            srchButton4.setAttribute("class", "scopelook");
            srchButton4.style.background = "url('digits/brows1.png')";
            attachEventListener(srchButton4, "click", srchshow, false);
            oTd.appendChild(srchButton4);
        }
        var oTr = ajTable.insertRow(ajTable, ajTable.length); //以下第一列都隱藏起來當變數
        var oTd = oTr.insertCell(0);
        oTd.innerHTML = '紀錄號碼';
        var oTd = oTr.insertCell(1);
        oTd.innerHTML = "<input type='text' name='b0dupdate' id='rcrd_no2' class='txt' maxlength='14' autosize  />";
        oTr.setAttribute("style", "display:none;");
    }
}

function topAndWidthModify(dropsheet_content, dropsheet, txtword, tbno) {
    dropsheet_content.style.width = "75%"; //原訊息內框畫面寬度調整  
    dropsheet.style.paddingTop = "25px"; // 高度也往上提 
    if (txtword != 7) {
        if (tbno == 0) {
            var ship_date = document.getElementById('shipdate');
            attachEventListener(ship_date, "focusout", rateSrch, false); //日期變動若為外幣交易也一併修正匯率  
        }
    } else {
        dropsheet_content.style.width = "60%";
    }
    return true;
}

function initFocusField(txtword, tbno, aWaitUpdate, notWaitdata, ajTable) {
    switch (txtword) {
        case 1: //如果是新增
            var thtdy = document.getElementById('recmth').value;
            if (tbno == 0) {
                var nowDate = new Date();
                document.getElementById("shipdate").value = paddingLeft(nowDate.getDate(), 2);
                //單號為系統自動編號
                objGetNo('queryno', 'BC' + thtdy.substring(2, 4) + parseInt(thtdy.substring(5, 7)).toString(16).toUpperCase());

                var cstNo = document.getElementById("customno");
                cstNo.focus();
                attachEventListener(cstNo, "change", c01CustomName, false); //找客戶名稱
                var acntNo1 = document.getElementById("whono");
                attachEventListener(acntNo1, "change", a01AccountName, false); //找帳號姓名
            } else {
                document.getElementById("stockno").focus();
                var dptNo1 = document.getElementById("deptno");
                attachEventListener(dptNo1, "change", a14DepartName, false); //找轉出部門名稱
            }
            break;
        case 2: //如果是修改，要先顯示目前該筆資料
            document.getElementById("rcrd_no" + (tbno + 1).toString()).value = aWaitUpdate[0]; //把紀錄號碼也存起來	
            if (tbno == 0) {
                document.getElementById("shipdate").focus();
                var editinit = document.getElementsByName('b04update');
                document.getElementById('customname').value = notWaitdata[0];
                document.getElementById('whonameEx').innerHTML = notWaitdata[5];
                var acntNo1 = document.getElementById("whono");
                attachEventListener(acntNo1, "change", a01AccountName, false); //找帳號姓名

            } else {
                document.getElementById("queryqty").focus();
                var editinit = document.getElementsByName('b0dupdate');
                document.getElementById('stockname').value = notWaitdata[0];
                document.getElementById('deptname').innerHTML = notWaitdata[2];
                var dptNo1 = document.getElementById("deptno");
                attachEventListener(dptNo1, "change", a14DepartName, false); //找轉出部門名稱
            }
            for (var k = 0; k < editinit.length; k++) {
                editinit[k].value = aWaitUpdate[k];
            }
            break;
        case 7: //搜尋   
            var txtseek = document.getElementById('searchWords');
            txtseek.focus();
            attachEventListener(txtseek, 'keypress', textKeypress, false);
            break;
    }
}

function colomnAfterChange(tbno, oTr, args, nongs, rsp) {
    const rnddgt = Number(getAuth[2]()[0].INT_069) || 0;
    const ttlmnyElem = document.getElementById('ttlmny');
    let ttlcnt = Number(ttlmnyElem.innerHTML);

    // 封裝四捨五入工具
    const roundTo = (num, decimal) => {
        const factor = Math.pow(10, decimal);
        return Math.round((num + Number.EPSILON) * factor) / factor;
    };

    let argsNo = 0;

    // 定義 tbno == 0 的資料對應表
    const tb0Map = {
        2: () => nongs[0], // 客戶簡稱
        3: () => nongs[1], // 客戶全稱
        4: () => nongs[2], // 統一編號
        5: () => nongs[3], // 聯絡人
        6: () => nongs[4], // 電話
        9: () => nongs[5], // 業務名稱
        11: () => nongs[6], // 幣別名稱
        15: () => whichinvoice(args[7]), // 發票別
        17: () => whichtax(args[8]), // 稅別
        21: () => document.getElementById('recmth').value, // 年月
        22: 'N' // 確認
    };

    // 定義 tbno == 1 的資料對應表
    const tb1Map = {
        1: () => nongs[0], // 品名
        7: () => nongs[1], // 部門名稱
        5: () => { // 小計與總額更新
            const subtotal = roundTo(args[2] * args[3], rnddgt);
            ttlcnt += subtotal;
            ttlmnyElem.innerHTML = ttlcnt;
            return subtotal;
        }
    };

    const currentMap = (tbno === 0) ? tb0Map : (tbno === 1 ? tb1Map : {});

    // 遍歷欄位屬性
    rsp.fldsatrr.forEach((attr, fldidx) => {
        const oTd = oTr.insertCell(-1);
        const [className, displayType, textAlign, width] = attr;

        if (className === 'directdata') {
            oTd.innerHTML = args[argsNo++] || "";
        } else if (currentMap[fldidx] !== undefined) {
            const mapValue = currentMap[fldidx];
            oTd.innerHTML = (typeof mapValue === 'function') ? mapValue() : mapValue;
        }

        oTd.className = className;
        if (displayType === 'none') {
            oTd.style.display = 'none';
        } else {
            oTd.style.textAlign = textAlign;
            oTd.style.width = width + "%";
        }
    });

    if (tbno === 0) {
        oTr.style.fontWeight = "bold";
        oTr.style.color = "#704214";
    }

    const lastTd = oTr.insertCell(-1);
    lastTd.className = "directdata";
    lastTd.innerHTML = rsp.lastupdate;
    lastTd.style.display = "none";
}

function colomnContextChange(tbno, args, nongs, arglth, rsp) {
    const rnddgt = Number(getAuth[2]()[0].INT_069) || 0;
    const ttlmnyElem = document.getElementById('ttlmny');

    const tableId = tbno === 0 ? "maintbody1" : "maintbody2";
    const maintable = document.getElementById(tableId);
    const targetRowIndex = args[arglth - 1];
    const targetRow = maintable.rows[targetRowIndex];

    const roundTo = (num, decimal) => {
        const factor = Math.pow(10, decimal);
        return Math.round((num + Number.EPSILON) * factor) / factor;
    };

    let fldidx, argsNo = 2;
    let ttlcnt = 0;

    if (tbno === 0) {
        fldidx = 4;
    } else {
        fldidx = 3;
        const oldSubtotal = Number(targetRow.cells[6].innerHTML) || 0;
        ttlcnt = Number(ttlmnyElem.innerHTML) - oldSubtotal;
    }

    const tb0Map = {
        9: () => nongs[5], // 業務姓名
        11: () => nongs[6], // 幣別名稱
        15: () => whichinvoice(args[7]), // 發票類別
        17: () => whichtax(args[8]) // 稅別
    };

    const tb1Map = {
        5: () => { // 小計更新
            const orderQty = Number(targetRow.cells[4].innerHTML) || 0;
            const subtotal = roundTo(orderQty * args[3], rnddgt);
            ttlcnt += subtotal;
            ttlmnyElem.innerHTML = ttlcnt;
            return subtotal;
        },
        7: () => nongs[0] // 部門名稱
    };

    const currentMap = (tbno === 0) ? tb0Map : tb1Map;

    while (rsp.fldsatrr[fldidx]) {
        const cell = targetRow.cells[fldidx + 1];
        const [className] = rsp.fldsatrr[fldidx];

        if (className === 'directdata') {
            if (tbno === 1 && fldidx === 3) {
                const currentQty = Number(cell.innerHTML) || 0;
                cell.innerHTML = currentQty + Number(args[2]);
            } else {
                cell.innerHTML = args[argsNo] || "";
            }
            argsNo++;
        } else if (currentMap[fldidx]) {
            cell.innerHTML = currentMap[fldidx]();
        }

        fldidx++;
    }

    targetRow.cells[fldidx + 1].innerHTML = rsp.lastupdate;
}

function transConfirm(oTd) {
    return true;
}

function addNewRecordHint(tbno) {
    if (tbno == 0) {
        return "請輸入出貨單表頭資料：";
    } else {
        return "請輸入出貨單:" + sourceAccount(1, 0) + "內容資料：";
    }
}

function editRecordHint(tbno) {
    if (tbno == 0) {
        return "修改出貨單表頭資料：";
    } else {
        return "修改出貨單:" + sourceAccount(1, 0) + "內容資料：";
    }
}

function searchKeyHint(tbno) {
    if (tbno == 0) {
        return "搜尋出貨單單頭欄位選擇";
    } else {
        return "搜尋出貨單單身欄位選擇";
    }
}

function srcArgobj(srcId) {
    if (srcId == 'customno' || srcId == 'customname') {
        var custno = document.getElementById(srcId).value;
        var tttlt = '';
        if (srcId == 'customno') {
            var qrystring = "c01.F01" + "|" + custno;
            tttlt = "請選取客戶代號";
        } else if (srcId == 'customname') {
            var qrystring = "c01.F05" + "|" + custno;
            tttlt = "請選取客戶簡稱";
        }
        return { "headtitle": tttlt, "drpshtWidth": "28%", "urlPth": "B04/BKND/C01srch.php", "clickfunc": chsecust, "qryString": qrystring, "mendwidth": "calc( 100% -1em )" };
    } else if (srcId == 'whono') {
        var qrystring = document.getElementById(srcId).value;

        return { "headtitle": "請選取業務人員帳號姓名", "drpshtWidth": "28%", "urlPth": "C01/BKND/A01srch.php", "clickfunc": chseprg1, "qryString": qrystring, "mendwidth": "calc( 100% - 1em )" };
    } else if (srcId == 'deptno') {
        var qrystring = document.getElementById(srcId).value + "|Y|Y| ";

        return { "headtitle": "請選取出貨部門", "drpshtWidth": "28%", "urlPth": "B02/BKND/A14srch.php", "clickfunc": deptchoose, "qryString": qrystring, "mendwidth": "calc( 100% )" };
    } else {
        var cstno = document.getElementById('keydscrpt1').innerHTML;
        var stockNo = document.getElementById(srcId).value;
        var tttlt = '';
        if (srcId == 'stockno') {
            var qrystring = "c04.F02" + "|" + stockNo + "_" + cstno;
            tttlt = "請選取料號";
        } else if (srcId == 'stockname') {
            var qrystring = "b01.F02" + "|" + stockNo + "_" + cstno;
            tttlt = "請選取品名";
        }
        return { "headtitle": tttlt, "drpshtWidth": "85%", "urlPth": "B04/BKND/B01srch.php", "clickfunc": stckchg, "qryString": qrystring, "mendwidth": "calc( 100% -1 em)" };
    }
}

function chseprg1(event) { //選擇業務
    if (typeof event == "undefined") {
        event = window.event;
    }
    var target = getEventTarget(event);
    var stuffNo = document.getElementById('whono');
    stuffNo.value = "";
    var stuffName = document.getElementById('whonameEx');
    if (stuffName)
        stuffName.innerHTML = "";
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

function stckchg(event) { //選擇料號
    if (typeof event == "undefined") {
        event = window.event;
    }
    var target = getEventTarget(event);
    var stockNo = document.getElementById('stockno');
    stockNo.value = "";
    var stockName = document.getElementById('stockname');
    stockName.value = "";
    var orderNo = document.getElementById('origno');
    var shipQty = document.getElementById('queryqty');
    var shipPrice = document.getElementById('price');
    var custstockno = document.getElementById('custompartno');
    var custpo = document.getElementById('customPO');
    var deptno = document.getElementById('deptno');
    var deptname = document.getElementById('deptname');
    var maintable = document.getElementById("stuffTbody");
    for (var i = 0; i < maintable.rows.length; i++) {
        if (maintable.rows[i].cells[maintable.rows[i].cells.length - 1].childNodes[0].checked) {
            stockNo.value = maintable.rows[i].cells[0].innerHTML;
            stockName.value = maintable.rows[i].cells[1].innerHTML;
            if (orderNo) {
                orderNo.value = maintable.rows[i].cells[2].innerHTML;
            }
            if (shipQty) {
                shipQty.value = maintable.rows[i].cells[4].innerHTML;
            }
            if (shipPrice) {
                shipPrice.value = maintable.rows[i].cells[5].innerHTML;
            }
            if (custstockno) {
                custstockno.value = maintable.rows[i].cells[6].innerHTML;
            }
            if (custpo) {
                custpo.value = maintable.rows[i].cells[7].innerHTML;
            }
            if (deptno) {
                deptno.value = maintable.rows[i].cells[8].innerHTML;
            }
            if (deptname) {
                deptname.innerHTML = maintable.rows[i].cells[9].innerHTML;
            }
            break;
        }
    }
    srchblkclose(event);
    return true;
}

function chsecust(event) { //選擇客戶
    if (typeof event == "undefined") {
        event = window.event;
    }
    var target = getEventTarget(event);

    var custNo = document.getElementById('customno');
    custNo.value = "";
    var custName = document.getElementById('customname');
    custName.value = "";
    var rprsntno = document.getElementById('whono');
    var rprsntname = document.getElementById('whonameEx');
    var crnttpe = document.getElementById('crntopt');
    var contactman = document.getElementById('winname');
    var shipway = document.getElementById('howship');
    var paymenttp = document.getElementById('howpay');
    var shipplace = document.getElementById('dlvrplace');
    var shipdirect = document.getElementById('shipdirect');
    var crntrate = document.getElementById('curncy');
    var invoicetype = document.getElementById('invtype');
    var taxkind = document.getElementById('taxtype');
    var maintable = document.getElementById("stuffTbody");
    var custFullName = document.getElementById('customfullname');
    var custUnitno = document.getElementById('unitno');

    var custTelno = document.getElementById('telNo');
    for (var i = 0; i < maintable.rows.length; i++) {
        if (maintable.rows[i].cells[maintable.rows[i].cells.length - 1].childNodes[0].checked) {
            custNo.value = maintable.rows[i].cells[0].innerHTML;
            custName.value = maintable.rows[i].cells[1].innerHTML;
            if (rprsntno) {
                rprsntno.value = maintable.rows[i].cells[2].innerHTML;
            }
            if (rprsntname) {
                rprsntname.innerHTML = maintable.rows[i].cells[3].innerHTML;
            }
            if (crnttpe) {
                crnttpe.value = maintable.rows[i].cells[4].innerHTML;
            }
            if (contactman) {
                contactman.value = maintable.rows[i].cells[5].innerHTML;
            }
            if (shipway) {
                shipway.value = maintable.rows[i].cells[6].innerHTML;
            }

            if (paymenttp) {
                var tpy = maintable.rows[i].cells[7].innerHTML;
                switch (tpy) {
                    case '0': {
                        tpy = "現結";
                        break;
                    }
                    case '1': {
                        tpy = "月結";
                        break;
                    }
                    case '2': {
                        tpy = "次月結";
                        break;
                    }
                    case '3': {
                        tpy = "T/T";
                        break;
                    }
                    default: {
                        tpy = '現結';
                        break;
                    }

                }
                paymenttp.value = tpy + (maintable.rows[i].cells[8].innerHTML == 0 ? '' : maintable.rows[i].cells[8].innerHTML + '天');
            }
            if (shipplace) {
                shipplace.value = maintable.rows[i].cells[9].innerHTML;
            }
            if (shipdirect) {
                shipdirect.value = maintable.rows[i].cells[10].innerHTML;
            }
            if (crntrate) {
                crntrate.value = maintable.rows[i].cells[11].innerHTML;
            }
            if (invoicetype) {
                invoicetype.value = maintable.rows[i].cells[12].innerHTML;
            }
            if (taxkind) {
                taxkind.value = maintable.rows[i].cells[13].innerHTML;
            }
            if (custFullName) {
                custFullName.value = maintable.rows[i].cells[14].innerHTML;
            }
            if (custUnitno) {
                custUnitno.value = maintable.rows[i].cells[15].innerHTML;
            }

            if (custTelno) {
                custTelno.value = maintable.rows[i].cells[16].innerHTML;
            }
            break;
        }
    }
    srchblkclose(event);
    return true;
}