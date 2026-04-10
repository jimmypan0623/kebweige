function getProfile(arr, reccount) {
    var cnt = 0;
    // 1. 預先取得 DOM 元素，避免在迴圈中反覆查詢
    const elements = {
        oTable: document.getElementById("maintbody1"),
        slt2: document.getElementById('recmth'),
        responseDiv: document.getElementById("serverResponse1"),
        rdyship: document.getElementById("REDYSHIP_BOTT"),
        seekrcd: document.getElementById("SEEK_BOTT")
    };

    // 2. 分頁選項處理
    const intRcd = parseInt(getAuth[2]()[0].INT_RCD) || 10;
    const pagecount = Math.ceil(reccount / intRcd);
    const optdigts = pagecount.toString().length;

    if (elements.slt2.options.length < pagecount) {
        const optFrag = document.createDocumentFragment();
        for (let i = elements.slt2.options.length + 1; i <= pagecount; i++) {
            const item_no = paddingLeft(i, optdigts);
            optFrag.appendChild(new Option(item_no, item_no));
        }
        elements.slt2.appendChild(optFrag);
        
        // 修正首項與閉包狀態
        const firstVal = paddingLeft(1, optdigts);
        elements.slt2.options[0].value = elements.slt2.options[0].text = firstVal;
        
        cko[0](cko[0](0) * -1); 
        cko[0](reccount);
    }

    // 3. 表格渲染 (使用 DocumentFragment)
    const fragment = document.createDocumentFragment();
    const alignMap = { "L": "left", "C": "center", "R": "right" };

    for (let i = 0; i < arr.length; i++) {
        const rowData = arr[i];
        const oTr = document.createElement("tr");
        oTr.setAttribute("name", "mainrow");
        cnt++;

        // 處理資料欄位
        for (let jk in rowData) {
            const cellValue = rowData[jk];
            const oTd = document.createElement("td");
            oTd.innerHTML = cellValue;

            // 解析規則標籤 (Regex 優化)
            const match = jk.match(/^(.*)_([DI])([SH])([LCR])_(\d{3})$/);
            if (match) {
                const isHidden = match[3] === "H";
                const align = alignMap[match[4]] || "left";
                const width = match[5];

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
            }
            oTr.appendChild(oTd);
        }

        // 4. 新增 Checkbox 欄位
        const oTdCheck = document.createElement("td");
        oTdCheck.style.cssText = "width:40px; display:none;";
        const myCheck = document.createElement('input');
        myCheck.type = "checkbox";
        myCheck.name = "chkbxmember1";
        if (typeof attachEventListener === "function") {
            attachEventListener(myCheck, 'click', chooserc, false);
        }
        oTdCheck.appendChild(myCheck);
        oTr.appendChild(oTdCheck);

        // 5. 進貨計劃專屬樣式判斷 (警示顏色)
        applyRowStyles(oTr, rowData);

        fragment.appendChild(oTr);
    }

    // 清空並掛載
    elements.oTable.innerHTML = "";
    elements.oTable.appendChild(fragment);

    // 6. UI 狀態回饋
    handleUIFeedback(cnt, elements);
}

/**
 * 輔助函數：處理列樣式
 */
function applyRowStyles(oTr, data) {
    const shipQty = Number(data['readyship_qty_IHC_000']) || 0;
    const diffDate = Number(data['diffdate_IHL_000']) || 0;

    if (shipQty > 0) {
        // 有開單未過帳：褐色加粗
        oTr.style.cssText = "font-weight:bold; color:#704214;";
    } else if (diffDate > 0) {
        // 逾期未進貨：紅色加粗
        oTr.style.cssText = "font-weight:bold; color:#E60000;";
    }
}

/**
 * 輔助函數：處理搜尋結果回饋
 */
function handleUIFeedback(cnt, el) {
    const isSearching = el.responseDiv.innerHTML === 'Searching......';

    if (cnt > 0) {
        if (isSearching) {
            el.responseDiv.style.color = "#536a60";
            el.responseDiv.innerHTML = `搜尋到 ${cnt} 筆資料。${cnt} record${cnt > 1 ? 's' : ''} match your search.`;
        }
        chooserc(1);
    } else {
        if (isSearching) {
            el.responseDiv.style.color = "red";
            el.responseDiv.innerHTML = "無此資料！Not found!";
        } else {
            el.responseDiv.innerHTML = "採購訂單均已結清....";
            if (el.seekrcd) {
                el.seekrcd.style.visibility = "hidden";
                detachEventListener(el.seekrcd, "click", seekrec, false);
            }
        }
        // 隱藏進貨相關按鈕
        if (el.rdyship) {
            el.rdyship.style.visibility = "hidden";
            detachEventListener(el.rdyship, "click", page1OtherButton1, false);
        }
    }
}

/**
 * 按鈕可用性檢查 (整合版)
 */
function checkButtonAvailability(target, isRow) {
    const rdyship = document.getElementById("REDYSHIP_BOTT");
    const cells = isRow ? target.childNodes : target;
    
    // 檢查關鍵數值欄位 (假設在第 7 欄，Index 6)
    const val = Number(cells[6]?.innerHTML) || 0;

    if (val === 0) {
        rdyship.style.visibility = "hidden";
        detachEventListener(rdyship, "click", page1OtherButton1, false);
    } else {
        rdyship.style.cssText = "visibility:visible; font-size:17px;";
        attachEventListener(rdyship, "click", page1OtherButton1, false);
    }
}

// 供外部調用
function choseExtraDeal(targetTrChildren) { checkButtonAvailability(targetTrChildren, false); return true; }
function rowchoseExtraDeal(targetRow) { checkButtonAvailability(targetRow, true); return true; }