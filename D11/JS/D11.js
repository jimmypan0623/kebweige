function getProfile(arr, reccount) {
    // 1. 變數快取與初始化
    var cnt = 0;
    var queryttl = 0;
    var rnddgt = parseInt(getCookie('INT_069')) || 0;
    
    var scndttl = document.getElementById('ttlmny');
    var slt2 = document.getElementById('recmth');
    var oTable = document.getElementById("maintbody1");
    var responseDiv = document.getElementById("serverResponse1");
    var seekrcd = document.getElementById("SEEK_BOTT");

    // 2. 分頁下拉選單優化
    var authConfig = getAuth[2]()[0];
    var intRcd = parseInt(authConfig.INT_RCD) || 10;
    var pagecount = Math.ceil(reccount / intRcd);
    var optdigts = pagecount.toString().length;

    if (slt2.options.length < pagecount) {
        var optFragment = document.createDocumentFragment();
        for (var i = slt2.options.length + 1; i <= pagecount; i++) {
            var item_no = paddingLeft(i, optdigts);
            optFragment.appendChild(new Option(item_no, item_no));
        }
        slt2.appendChild(optFragment);
        
        // 修正首項格式與紀錄筆數 (使用閉包變數 cko)
        var firstVal = paddingLeft(1, optdigts);
        slt2.options[0].value = slt2.options[0].text = firstVal;
        
        cko[0](cko[0](0) * -1); // 歸零
        cko[0](reccount);       // 存入總筆數
    }

    // 3. 表格渲染優化 (DocumentFragment)
    var fragment = document.createDocumentFragment();
    var alignMap = { "L": "left", "C": "center", "R": "right" };

    for (var i = 0; i < arr.length; i++) {
        var rowData = arr[i];
        var oTr = document.createElement("tr");
        oTr.setAttribute("name", "mainrow");
        cnt++;

        for (var jk in rowData) {
            var cellValue = rowData[jk];
            var oTd = document.createElement("td");
            oTd.innerHTML = cellValue;

            // 使用 Regex 一次解析規則 (欄位名_DICL_寬度)
            var match = jk.match(/^(.*)_([DI])([SH])([LCR])_(\d{3})$/);
            
            if (match) {
                var fieldName = match[1];
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

                // 累計金額判斷
                if (fieldName === 'rcd_total') {
                    queryttl += (Number(cellValue) || 0);
                }
            }
            oTr.appendChild(oTd);
        }

        // 4. 新增隱藏勾選欄位
        var oTdCheck = document.createElement("td");
        oTdCheck.style.cssText = "width:40px; display:none;";
        var myCheck = document.createElement('input');
        myCheck.type = "checkbox";
        myCheck.setAttribute("name", "chkbxmember1");
        
        if (typeof attachEventListener === "function") {
            attachEventListener(myCheck, 'click', chooserc, false);
        }
        oTdCheck.appendChild(myCheck);
        oTr.appendChild(oTdCheck);

        fragment.appendChild(oTr);
    }

    // 清空舊資料並掛載新資料
    oTable.innerHTML = ""; 
    oTable.appendChild(fragment);

    // 5. UI 狀態回饋與金額格式化
    updateStatusUI(cnt, responseDiv, seekrcd, queryttl, rnddgt, scndttl);
}

/**
 * 輔助函數：更新介面狀態與金額
 */
function updateStatusUI(cnt, responseDiv, seekrcd, queryttl, rnddgt, scndttl) {
    var isSearching = (responseDiv.innerHTML === 'Searching......');

    if (cnt > 0) {
        if (isSearching) {
            responseDiv.style.color = "#536a60";
            responseDiv.innerHTML = "搜尋到 " + cnt + " 筆資料。" + cnt + " record" + (cnt > 1 ? "s" : "") + " match your search.";
        } else if (seekrcd) {
            seekrcd.style.visibility = "visible";
            attachEventListener(seekrcd, "click", seekrec, false);
        }
        
        chooserc(1);
        
        // 精確處理四捨五入與千分位
        var factor = Math.pow(10, rnddgt);
        var finalValue = Math.round((queryttl + Number.EPSILON) * factor) / factor;
        scndttl.innerHTML = typeof thousands === "function" ? thousands(finalValue) : finalValue;
    } else {
        if (isSearching) {
            responseDiv.style.color = "red";
            responseDiv.innerHTML = "無此資料！Not found!";
        } else {
            responseDiv.innerHTML = "本月無進貨紀錄。";
            if (seekrcd) {
                seekrcd.style.visibility = "hidden";
                detachEventListener(seekrcd, "click", seekrec, false);
            }
        }
        scndttl.innerHTML = "0";
    }
}
function choseExtraDeal(targetTrChildren){   //紀錄移動
    
    return true;			   
}
function rowchoseExtraDeal(targetRow){    //紀錄移動
    
    return true;			   
}	 
