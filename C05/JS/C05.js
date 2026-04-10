function getProfile(arr, reccount) {
    var cnt = 0;
    var oTable = document.getElementById("maintbody1");
    var slt2 = document.getElementById('recmth');
    var responseDiv = document.getElementById("serverResponse1");
    var rdyship = document.getElementById("REDYSHIP_BOTT");
    var seekrcd = document.getElementById("SEEK_BOTT");

    // 1. 分頁選單優化
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

    // 2. 表格渲染優化 (使用 DocumentFragment)
    var fragment = document.createDocumentFragment();
    var alignMap = { "L": "left", "C": "center", "R": "right" };

    for (var i = 0; i < arr.length; i++) {
        var rowData = arr[i];
        var oTr = document.createElement("tr");
        oTr.setAttribute("name", "mainrow");
        
        // --- 【關鍵修復：自動校對錯誤資料】 ---
        var realReadyQty = 0;
        var realDiffDate = 0;
        for (var key in rowData) {
            // 模糊匹配：只要包含關鍵字就抓取數值，預防後端欄位結尾更動
            if (key.indexOf('readyship_qty') !== -1) realReadyQty = Number(rowData[key]) || 0;
            if (key.indexOf('diffdate') !== -1) realDiffDate = Number(rowData[key]) || 0;
        }
        // 將數值存入 dataset，供 toggleShipButton 精準讀取 (不再數格子)
        oTr.dataset.readyQty = realReadyQty;
        // ------------------------------------

        cnt++;

        for (var jk in rowData) {
            var cellValue = rowData[jk];
            var oTd = document.createElement("td");
            oTd.innerHTML = cellValue;

            var match = jk.match(/^(.*)_([DI])([SH])([LCR])_(\d{3})$/);
            if (match) {
                var isDirect = match[2] === "D";
                var isHidden = match[3] === "H";
                var align = alignMap[match[4]] || "left";
                var width = match[5];

                oTd.className = isDirect ? "directdata" : "indirectdata";
                
                if (isHidden) {
                    oTd.style.display = "none";
                } else {
                    oTd.style.textAlign = align;
                    oTd.style.width = width + "%";
                    if (typeof attachEventListener === "function") {
                        attachEventListener(oTd, 'click', rowchoose, false);
                    }
                }
            }
            oTr.appendChild(oTd);
        }

        // 3. Checkbox 欄位
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

        // 4. 特殊狀態顏色處理 (使用校對後的數值)
        if (realReadyQty > 0) {
            oTr.style.cssText = "font-weight:bold; color:#704214;"; // 有開單未過帳
        } else if (realDiffDate > 0) {
            oTr.style.cssText = "font-weight:bold; color:#E60000;"; // 逾期紅字
        }

        fragment.appendChild(oTr);
    }

    oTable.innerHTML = ""; 
    oTable.appendChild(fragment);

    updateUIFeedback(cnt, responseDiv, seekrcd, rdyship);
}

/** 修正後的按鈕連動：解決「沒內容」與「抓錯列」問題 */
function toggleShipButton(target, isRow) {
    var rdyship = document.getElementById("REDYSHIP_BOTT");
    if (!rdyship) return;

    // 取得正確的 TR 物件
    var oTr = isRow ? target : target[0].parentNode;
    
    // 直接讀取渲染時預存的 dataset 數值，最準確
    var qty = Number(oTr.dataset.readyQty) || 0;

    if (qty === 0) {
        rdyship.style.visibility = "hidden";
        detachEventListener(rdyship, "click", page1OtherButton1, false);
    } else {
        rdyship.style.cssText = "visibility:visible; font-size:17px; cursor:pointer;";
        // 重新綁定事件
        detachEventListener(rdyship, "click", page1OtherButton1, false);
        attachEventListener(rdyship, "click", page1OtherButton1, false);
    }
    return true;
}

// 介面反饋保持不變
function updateUIFeedback(cnt, responseDiv, seekrcd, rdyship) {
    var isSearching = responseDiv.innerHTML === 'Searching......';
    if (cnt > 0) {
        if (isSearching) {
            responseDiv.style.color = "#536a60";
            responseDiv.innerHTML = "搜尋到 " + cnt + " 筆資料。";
        }
        chooserc(1);
    } else {
        if (isSearching) {
            responseDiv.style.color = "red";
            responseDiv.innerHTML = "無此資料！Not found!";
        } else {
            responseDiv.innerHTML = "客戶訂單均已出清....";
            if (seekrcd) {
                seekrcd.style.visibility = "hidden";
                detachEventListener(seekrcd, "click", seekrec, false);
            }
        }
        rdyship.style.visibility = "hidden";
        detachEventListener(rdyship, "click", page1OtherButton1, false);
    }
}

function choseExtraDeal(targetTrChildren) { return toggleShipButton(targetTrChildren, false); }
function rowchoseExtraDeal(targetRow) { return toggleShipButton(targetRow, true); }