function getProfile(arr, reccount) {
    // 1. 初始化與 DOM 快取
    var cnt = 0;
    var queryttl = 0;
    var rnddgt = parseInt(getCookie('INT_069')) || 0;
    var scndttl = document.getElementById('ttlmny');
    var slt2 = document.getElementById('recmth');
    var oTable = document.getElementById("maintbody1");
    var responseDiv = document.getElementById("serverResponse1");
    var seekrcd = document.getElementById("SEEK_BOTT");

    // 2. 分頁選項處理 (優化：一次性加入)
    var intRcd = parseInt(getAuth[2]()[0].INT_RCD) || 10;
    var pagecount = Math.ceil(reccount / intRcd);
    var optdigts = pagecount.toString().length;

    if (slt2.options.length < pagecount) {
        var optFragment = document.createDocumentFragment();
        for (var i = slt2.options.length + 1; i <= pagecount; i++) {
            var item_no = paddingLeft(i, optdigts);
            optFragment.appendChild(new Option(item_no, item_no));
        }
        slt2.appendChild(optFragment);
        
        // 更新首項與閉包狀態
        var firstText = paddingLeft(1, optdigts);
        slt2.options[0].value = firstText;
        slt2.options[0].text = firstText;
        
        cko[0](cko[0](0) * -1); // 歸零
        cko[0](reccount);       // 記錄總數
    }

    // 3. 表格渲染 (DocumentFragment)
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

            // 使用正則表達式解析格式: (欄位名)_(DICL)_(寬度)
            // 例如: rcd_total_DS R_010
            var match = jk.match(/^(.*)_([DI])([SH])([LCR])_(\d{3})$/);
            
            if (match) {
                var fieldName = match[1];
                var isDirect = match[2] === "D";
                var isHidden = match[3] === "H";
                var alignKey = match[4];
                var widthPct = match[5];

                oTd.className = isDirect ? "directdata" : "indirectdata";

                if (isHidden) {
                    oTd.style.display = "none";
                } else {
                    oTd.style.textAlign = alignMap[alignKey] || "left";
                    oTd.style.width = widthPct + "%";
                    if (typeof attachEventListener === "function") {
                        attachEventListener(oTd, 'click', rowchoose, false);
                    }
                }

                // 累加金額邏輯
                if (fieldName === '小計') {
                    queryttl += (Number(cellValue) || 0);
                }
            }
            oTr.appendChild(oTd);
        }

        // 新增隱藏 Checkbox 欄位
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

    oTable.appendChild(fragment);

    // 4. 狀態回饋與 UI 更新
    updateUIStatus(cnt, responseDiv, seekrcd, queryttl, rnddgt, scndttl);
}

/** * 輔助函數：更新 UI 狀態
 */
function updateUIStatus(cnt, responseDiv, seekrcd, queryttl, rnddgt, scndttl) {
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
        
        // 金額四捨五入與格式化
        //var finalAmount = queryttl.toFixed(rnddgt);
        //scndttl.innerHTML = typeof thousands === "function" ? thousands(finalAmount) : finalAmount;
		scndttl.innerHTML=thousands(Math.round((queryttl + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt));
    } else {
        if (isSearching) {
            responseDiv.style.color = "red";
            responseDiv.innerHTML = "無此資料！Not found!";
        } else {
            responseDiv.innerHTML = "本月無出貨紀錄。";
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