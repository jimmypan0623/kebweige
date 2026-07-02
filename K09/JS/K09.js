function getProfile(str1, reccount, tbno) {
    var cnt = 0;
    var rnddgt = getCookie('INT_069') || 0; // 四捨五入位數
    var arr = str1;
    
    // 初始化統計變數
    var queryttl = 0; // 逾期總餘額
    var querytt2 = 0; // 總結餘 (restmoney)
    var querytt3 = 0; // 總金額 (amount)
    
    // 預先取得 DOM 物件
    var elements = {
        scndttl: document.getElementById('ttlmny1'),
        scndtt2: document.getElementById('ttlmny2'),
        scndtt3: document.getElementById('ttlmny3'),
        slt2: document.getElementById('recmth'),
        oTable: document.getElementById("maintbody1"),
        responseDiv: document.getElementById("serverResponse1")
    };

    // 1. 分頁選單優化
    var intRcd = parseInt(getAuth[2]()[0].INT_RCD) || 10;
    var pagecount = Math.ceil(reccount / intRcd);
    var optdigts = pagecount.toString().length;

    if (elements.slt2.options.length < pagecount) {
        var optFrag = document.createDocumentFragment();
        for (var i = elements.slt2.options.length + 1; i <= pagecount; i++) {
            var item_no = paddingLeft(i, optdigts);
            optFrag.appendChild(new Option(item_no, item_no));
        }
        elements.slt2.appendChild(optFrag);
        elements.slt2.options[0].value = elements.slt2.options[0].text = paddingLeft(1, optdigts);
        
        // 更新閉包變數
        cko[0](cko[0](0) * -1);
        cko[0](reccount);
    }

    // 2. 資料渲染 (使用 DocumentFragment)
    var fragment = document.createDocumentFragment();
    var alignMap = { "L": "left", "C": "center", "R": "right" };

    for (var i = 0; i < arr.length; i++) {
        var rowData = arr[i];
        var oTr = document.createElement("tr");
        oTr.setAttribute("name", "mainrow");
        cnt++;

        // 該列暫存變數（用於判定樣式與加總）
        var rowOverDays = 0;
        var rowRestMoney = 0;

        for (var jk in rowData) {
            var cellValue = rowData[jk];
            var oTd = document.createElement("td");
            oTd.innerHTML = cellValue;

            // 解析標籤規則 (名稱_DSL_寬度)
            var match = jk.match(/^(.*)_([DI])([SH])([LCR])_(\d{3})$/);
            if (match) {
                var fieldName = match[1];
                var isHidden = match[3] === 'H';
                var align = alignMap[match[4]] || "left";
                var width = match[5];
                var numValue = Number(cellValue) || 0;

                oTd.className = (match[2] === "D") ? "directdata" : "indirectdata";

                if (isHidden) {
                    oTd.style.display = "none";
                } else {
                    oTd.style.textAlign = align;
                    oTd.style.width = width + "%";
                    if (typeof attachEventListener === "function") {
                        attachEventListener(oTd, 'click', rowchoose, false);
                    }
                }

                // 數值統計邏輯 (模糊匹配 Key 名稱)
                if (fieldName.indexOf('逾期天數') !== -1) {
                    rowOverDays = numValue;
                } else if (fieldName.indexOf('未沖金額') !== -1) {
                    rowRestMoney = numValue;
                    querytt2 += numValue;
                } else if (fieldName.indexOf('憑證總額') !== -1) {
                    querytt3 += numValue;
                }
            }
            oTr.appendChild(oTd);
        }

        // 3. 處理逾期加總與整列顏色
        if (rowOverDays > 0) {
            queryttl += rowRestMoney; 
            if (rowOverDays > 90) {
                oTr.style.cssText = "font-weight:bold; color:#E60000;"; // 嚴重逾期
            } else {
                oTr.style.cssText = "font-weight:bold; color:#704214;"; // 一般逾期
            }
        }

        // 4. 新增 Checkbox 欄位 (隱藏)
        var oTdCheck = document.createElement("td");
        oTdCheck.style.cssText = "width:40px; display:none;";
        var myCheck = document.createElement('input');
        myCheck.type = "checkbox";
        myCheck.name = "chkbxmember1";
        if (typeof attachEventListener === "function") {
            attachEventListener(myCheck, 'click', chooserc, false);
        }
        oTdCheck.appendChild(myCheck);
        oTr.appendChild(oTdCheck);

        fragment.appendChild(oTr);
    }

    // 一次性更新表格
    elements.oTable.innerHTML = "";
    elements.oTable.appendChild(fragment);

    // 5. 介面回饋與統計更新
    updateUIFeedback(cnt, elements, queryttl, querytt2, querytt3);
}

/** 介面輔助函數 */
function updateUIFeedback(cnt, el, q1, q2, q3) {
    var isSearching = el.responseDiv.innerHTML === 'Searching......';

    if (cnt > 0) {
        if (isSearching) {
            el.responseDiv.style.color = "#536a60";
            el.responseDiv.innerHTML = "搜尋到 "+String(cnt)+" 筆資料。" +String(cnt)+" record"+(cnt>1?"s":"")+" match your search. " +String(cnt)+" レコードを検索。";            		 
        }
        chooserc(1);
        el.scndttl.innerHTML = thousands(q1.toFixed(0)); // 逾期總餘額
        el.scndtt2.innerHTML = thousands(q2.toFixed(0)); // 總結餘
        el.scndtt3.innerHTML = thousands(q3.toFixed(0)); // 總金額
    } else {
        if (isSearching) {
            el.responseDiv.style.color = "red";
            el.responseDiv.innerHTML = "無此資料！Not found!";
        }
        el.scndttl.innerHTML = el.scndtt2.innerHTML = el.scndtt3.innerHTML = '0';
    }
}

/** 歷史紀錄按鈕連動：解決「數格子」失效問題 */
function checkHistorySum(row) {
    var total = 0;
    // 使用 cells 代替 childNodes 避開文字節點干擾
    for (var i = 3; i < 13; i++) {
        if (row.cells[i]) {
            total += (Number(row.cells[i].innerHTML) || 0);
        }
    }
    return total;
}

function choseExtraDeal(targetTrChildren) { 
    checkHistorySum(targetTrChildren[0].parentNode); 
    return true; 
}
function rowchoseExtraDeal(targetRow) { 
    checkHistorySum(targetRow); 
    return true; 
}