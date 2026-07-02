function getProfile(arr, reccount) {
    var cnt = 0;
    var rnddgt = getCookie('INT_069'); // 四捨五入位數
    var queryttl = 0, querytt2 = 0, querytt3 = 0;

    // 取得總值顯示物件
    var scndttl = document.getElementById('ttlmny1');
    var scndtt2 = document.getElementById('ttlmny2');
    var scndtt3 = document.getElementById('ttlmny3');

    // 1. 分頁邏輯優化
    var intRcd = parseInt(getCookie('INT_RCD')) || 10;
    var pagecount = Math.ceil(reccount / intRcd);
    var optdigts = (pagecount.toString()).length;
    var slt2 = document.getElementById('recmth');

    if (slt2.options.length < pagecount) {
        var fragmentOpt = document.createDocumentFragment();
        for (var i = slt2.options.length + 1; i <= pagecount; i++) {
            var item_no = paddingLeft(i, optdigts);
            fragmentOpt.appendChild(new Option(item_no, item_no));
        }
        slt2.appendChild(fragmentOpt);
        
        // 修正首項格式與紀錄筆數
        slt2.options[0].value = slt2.options[0].text = paddingLeft(1, optdigts);
        cko[0](cko[0](0) * -1); // 歸零
        cko[0](reccount);       // 紀錄
    }

    // 2. 表格渲染優化 (使用 Fragment)
    var oTable = document.getElementById("maintbody1");
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < arr.length; i++) {
        var oTr = document.createElement("tr");
        oTr.setAttribute("name", "mainrow");
        cnt++;

        var rowData = arr[i];
        for (var jk in rowData) {
            var cellValue = rowData[jk];
            var oTd = document.createElement("td");
            oTd.innerHTML = cellValue;

            // 解析欄位規則 (例如: taxamt_ISL_010)
            // match[1]: 欄位名, match[2]: D/I, match[3]: S/H, match[4]: L/C/R, match[5]: 寬度
            var match = jk.match(/^(.*)_([DI])([SH])([LCR])_(\d{3})$/);
            
            if (match) {
                var fieldName = match[1];
                var ks = [match[2], match[3], match[4]];
                var wdthln = match[5];

                // 設定樣式類別 (移除原有的分號錯誤)
                oTd.className = (ks[0] === "D") ? "directdata" : "indirectdata";

                if (ks[1] === 'H') {
                    oTd.style.display = "none";
                } else {
                    var alignMap = { "L": "left", "C": "center", "R": "right" };
                    oTd.style.textAlign = alignMap[ks[2]] || "left";
                    oTd.style.width = wdthln + "%";
                    if (typeof attachEventListener === "function") {
                        attachEventListener(oTd, 'click', rowchoose, false);
                    }
                }

                // 額外處理：稅別名稱轉換
                if (fieldName === '稅別代號') {
                    var oTdTax = document.createElement("td");
                    oTdTax.className = "indirectdata";
                    oTdTax.style.width = "4%";
                    oTdTax.style.textAlign = "center";
                    oTdTax.innerHTML = whichtax(cellValue);
                    if (typeof attachEventListener === "function") {
                        attachEventListener(oTdTax, 'click', rowchoose, false);
                    }
                    oTr.appendChild(oTdTax);
                }

                // 累計金額 (轉為數字避免字串相加)
                var numVal = Number(cellValue) || 0;
                if (fieldName === '銷售金額') queryttl += numVal;
                if (fieldName === '稅額')    querytt2 += numVal;
                if (fieldName === '發票總額')    querytt3 += numVal;
            }
            oTr.appendChild(oTd);
        }

        // 3. 新增隱藏 Checkbox
        var oTdCheck = document.createElement("td");
        oTdCheck.style.width = "40px";
        oTdCheck.style.display = "none";
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

    // 4. 顯示搜尋結果
    var responseDiv = document.getElementById("serverResponse1");
    if (responseDiv && responseDiv.innerHTML === 'Searching......') {
        if (cnt === 0) {
            responseDiv.style.color = "red";
            responseDiv.innerHTML = "無此資料！Not found!検索できません。";
        } else {
            responseDiv.style.color = "#536a60";
            responseDiv.innerHTML = "搜尋到 " + cnt + " 筆資料。";
        }
    }

    // 5. 更新總計金額
    if (cnt > 0) {
        chooserc(1);
        scndttl.innerHTML = typeof thousands === "function" ? thousands(queryttl.toFixed(rnddgt)) : queryttl;
        scndtt2.innerHTML = typeof thousands === "function" ? thousands(querytt2.toFixed(rnddgt)) : querytt2;
        scndtt3.innerHTML = typeof thousands === "function" ? thousands(querytt3.toFixed(rnddgt)) : querytt3;
    } else {
        scndttl.innerHTML = scndtt2.innerHTML = scndtt3.innerHTML = '0';
    }
}

// 稅別轉換優化
function whichtax(tpe) {
    var taxMap = { '1': '應稅', '2': '零稅', '3': '免稅' };
    return taxMap[tpe] || "";
}


function choseExtraDeal(targetTrChildren){   //紀錄移動
    var rdyship=document.getElementById("HISTORY_BOTT");
    var jdgnm=0;
	for (var i=3;i<13;i++){
	    jdgnm+=targetTrChildren[i].innerHTML*1
	}
    if(jdgnm==0){
        rdyship.setAttribute("style","visibility:hidden;");				   
		detachEventListener(rdyship,"click",page1OtherButton1,false);
	   	   	   
    }else{
	   rdyship.setAttribute("style","visibility:visible;font-size:17px;");				   				   
		 attachEventListener(rdyship,"click",page1OtherButton1,false);
	} 
	
	 
    return true;			   
}
function rowchoseExtraDeal(targetRow){    //紀錄移動
    var rdyship=document.getElementById("HISTORY_BOTT");
	 var jdgnm=0;
	 for (var i=3;i<13;i++){
	    jdgnm+=targetRow.childNodes[i].innerHTML*1
	}
    if(jdgnm==0){
       rdyship.setAttribute("style","visibility:hidden;");				   
		detachEventListener(rdyship,"click",page1OtherButton1,false);
    }else{
		rdyship.setAttribute("style","visibility:visible;font-size:17px;");				   				   
		 attachEventListener(rdyship,"click",page1OtherButton1,false);
	}		
	 
    return true;			   
}	 