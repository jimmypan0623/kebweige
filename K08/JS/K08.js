function getProfile(str1, reccount, tbno) {
    var cnt = 0;
    var rnddgt = getCookie('INT_069') || 0;
    var arr = str1;
    var queryttl = 0; // 逾期總金額
    var querytt2 = 0; // 剩餘總金額
    var querytt3 = 0; // 原始總金額

    // 1. 取得 DOM 元素
    var scndttl = document.getElementById('ttlmny1');
    var scndtt2 = document.getElementById('ttlmny2');
    var scndtt3 = document.getElementById('ttlmny3');
    var slt2 = document.getElementById('recmth');
    var oTable = document.getElementById("maintbody1");
    var responseDiv = document.getElementById("serverResponse1");

    // 2. 分頁處理 (優化為一次性加入)
    var intRcd = parseInt(getAuth[2]()[0].INT_RCD) || 10;
    var pagecount = Math.ceil(reccount / intRcd);
    var optdigts = pagecount.toString().length;

    if (slt2.options.length < pagecount) {
        var optFrag = document.createDocumentFragment();
        for (var i = slt2.options.length + 1; i <= pagecount; i++) {
            var item_no = paddingLeft(i, optdigts);
            optFrag.appendChild(new Option(item_no, item_no));
        }
        slt2.appendChild(optFrag);
        slt2.options[0].value = slt2.options[0].text = paddingLeft(1, optdigts);
        cko[0](cko[0](0) * -1);
        cko[0](reccount);
    }

    // 3. 資料渲染 (使用 Fragment 提升效能)
    var fragment = document.createDocumentFragment();
    var alignMap = { "L": "left", "C": "center", "R": "right" };

    for (var i = 0; i < arr.length; i++) {
        var rowData = arr[i];
        var oTr = document.createElement("tr");
        oTr.setAttribute("name", "mainrow");
        cnt++;

        // 預先校對數值 (因應資料可能有誤)
        var rowOverDays = 0;
        var rowRestMoney = 0;
        var rowAmount = 0;

        for (var jk in rowData) {
            var cellValue = rowData[jk];
            var oTd = document.createElement("td");
            oTd.innerHTML = cellValue;

            // 解析標籤規則 (Regex: 名稱_DIC_寬度)
            var match = jk.match(/^(.*)_([DI])([SH])([LCR])_(\d{3})$/);
            if (match) {
                var fieldName = match[1];
                var isHidden = match[3] === "H";
                
                oTd.className = (match[2] === "D") ? "directdata" : "indirectdata";
                
                if (isHidden) {
                    oTd.style.display = "none";
                } else {
                    oTd.style.textAlign = alignMap[match[4]] || "left";
                    oTd.style.width = match[5] + "%";
                    if (typeof attachEventListener === "function") {
                        attachEventListener(oTd, 'click', rowchoose, false);
                    }
                }

                // 數值統計與樣式判定 (校對欄位名稱)
                var val = Number(cellValue) || 0;
                if (fieldName.indexOf('over_days') !== -1) rowOverDays = val;
                if (fieldName.indexOf('restmoney') !== -1) {
                    rowRestMoney = val;
                    querytt2 += val;
                }
                if (fieldName.indexOf('amount') !== -1) querytt3 += val;
            }
            oTr.appendChild(oTd);
        }

        // 4. 處理逾期邏輯與整列樣式
        if (rowOverDays > 0) {
            queryttl += rowRestMoney; // 只有逾期的才加進 ttl1
            if (rowOverDays > 90) {
                oTr.style.cssText = "font-weight:bold; color:#E60000;"; // 嚴重逾期(紅)
            } else {
                oTr.style.cssText = "font-weight:bold; color:#704214;"; // 一般逾期(褐)
            }
        }

        // 5. 新增 Checkbox
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

    oTable.innerHTML = "";
    oTable.appendChild(fragment);

    // 6. UI 反饋與金額顯示
    if (responseDiv.innerHTML === 'Searching......') {
        if (cnt === 0) {
            responseDiv.style.color = "red";
            responseDiv.innerHTML = "無此資料！Not found!";
        } else {
            responseDiv.style.color = "#536a60";
            responseDiv.innerHTML = "搜尋到 "+String(cnt)+" 筆資料。" +String(cnt)+" record"+(cnt>1?"s":"")+" match your search. " +String(cnt)+" レコードを検索。";            		 
        }
    }

    if (cnt > 0) {
        chooserc(1);
        scndttl.innerHTML = thousands(queryttl);
        scndtt2.innerHTML = thousands(querytt2);
        scndtt3.innerHTML = thousands(querytt3);
    } else {
        scndttl.innerHTML = scndtt2.innerHTML = scndtt3.innerHTML = '0';
    }
}

/**
 * 歷史紀錄按鈕連動邏輯優化
 * 原本的 targetRow.childNodes[i] 非常容易出錯，建議透過 dataset 傳遞
 */
function checkHistoryAvailability(row) {
    var jdgnm = 0;
    // 遍歷指定的數值欄位範圍 (第 3 到 12 欄)
    // 建議：如果可以，直接在渲染時計算好總和存入 row.dataset.sum
    for (var i = 3; i < 13; i++) {
        var cell = row.cells ? row.cells[i] : row.childNodes[i];
        if (cell) jdgnm += (Number(cell.innerHTML) || 0);
    }
    // 這裡可以根據 jdgnm 決定 HISTORY_BOTT 的狀態
    return jdgnm;
}

function choseExtraDeal(targetTrChildren) { 
    checkHistoryAvailability(targetTrChildren[0].parentNode); 
    return true; 
}
function rowchoseExtraDeal(targetRow) { 
    checkHistoryAvailability(targetRow); 
    return true; 
}