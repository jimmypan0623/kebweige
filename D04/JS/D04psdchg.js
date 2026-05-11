/**
 * 採購訂單初始畫面優化版
 */
function selfTag(jsvsn, jsPth) {
    const maindiv = document.querySelector('.tab_css');
    const beinsertedid = document.getElementById('tab1');
    const cntdiv = document.querySelectorAll('.tab_content');
    const rspn2 = document.getElementById('serverResponse2');
    const orpButton5 = document.getElementById("lgt"); // 離開按鈕

    // 1. 建立審核標籤
    const spn = document.createElement('span');
    spn.id = "APPRVE";
    maindiv.insertBefore(spn, beinsertedid);

    // 2. 建立頁次二的功能按鈕 (出貨紀錄與金額統計)
    const frag1 = document.createDocumentFragment();
    const orpButton10 = createButton({
        id: "OUTRCD_BOTT",
        value: "\u{1F4DC}",
        title: "查看出貨紀錄，快速鍵 Alt+B",
        accessKey: "B",
        style: "font-size:17px;",
        onClick: page2OtherButton1
    });

    // 組合頁次二工具列
    frag1.append(
        document.createTextNode('\u{A0}\u{A0}'),
        orpButton10,
        document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}'),
        createSpan("ttltitle", "總金額:"),
        createSpan("crncy", ""),
        createSpan("ttlmny", "0", "ttl")
    );
    cntdiv[1].insertBefore(frag1, rspn2);

    // 3. 建立通用功能按鈕 (確認、反確認、轉單、列印)
    const frag2 = document.createDocumentFragment();
    const btnStyle = "visibility:visible; font-size:130%; margin:0; color:black;";

    const buttons = [
        { id: "ANS_BOTT", val: "\u{2714}", title: "確認本訂單所有紀錄，快速鍵Alt+A", key: "A", fn: ansproc },
        { id: "VRS_BOTT", val: "\u{1F504}", title: "反確認本訂單所有紀錄，快速鍵Alt+Z", key: "Z", fn: vrsproc },
        { id: "TRN_BOTT", val: "\u{1F516}", title: "直接轉出貨單，快速鍵Alt+G", key: "G", fn: null }
    ];

    buttons.forEach(b => {
        const btn = createButton({ id: b.id, value: b.val, title: b.title, accessKey: b.key, style: btnStyle, onClick: b.fn });
        frag2.append(btn, document.createTextNode('\u{A0}'));
    });

    // 權限檢查：列印按鈕
    if (getAuth[0]()[4] === 'Y') {
        const prnBtn = createButton({
            id: "PRNT_BOTT",
            value: "\u{1F5A8}",
            title: "列印所選紀錄，快速鍵Alt+P",
            accessKey: "P",
            style: btnStyle,
            onClick: prntproc
        });
        frag2.append(prnBtn, document.createTextNode('\u{A0}\u{A0}'));
    }
    maindiv.insertBefore(frag2, orpButton5);

    // 4. 清理與加載腳本
    document.querySelectorAll("script[id]").forEach(s => s.remove());
    const prefix = jsPth.substr(0, 3);
    const scripts = [
        `${jsPth}${prefix}.js?v=${jsvsn}`,
        `${jsPth}${prefix}rgst.js?v=${jsvsn}`,
        `include/JS/commonsrch.js?v=${jsvsn}`,
        `C01/JS/A09getno.js?v=${jsvsn}`,
        `include/JS/confirmfun.js?v=${jsvsn}`,
        `C01/JS/A01Name.js?v=${jsvsn}`
    ];
    
    // 只有主程式需要回調 DrawTable
    loadScript(scripts[0], () => DrawTable());
    scripts.slice(1).forEach(src => loadScript(src));

    // 5. 綁定 Tab 事件
    document.getElementById("tab1")?.addEventListener("click", tab1View);
    document.getElementById("tab2")?.addEventListener("click", tab2View);
}

/** 輔助函式：快速建立按鈕 **/
function createButton({ id, value, title, accessKey, style, onClick }) {
    const btn = document.createElement("input");
    btn.type = "button";
    btn.className = "btn";
    btn.id = id;
    btn.value = value;
    btn.title = title;
    if (accessKey) btn.accessKey = accessKey;
    if (style) btn.style.cssText = style;
    if (onClick) btn.addEventListener("click", onClick);
    return btn;
}

/** 輔助函式：快速建立 Span **/
function createSpan(id, text, className = "") {
    const s = document.createElement('span');
    s.id = id;
    if (className) s.className = className;
    s.innerHTML = text;
    return s;
}

function tab1View() {
    const auth = getAuth[0]();
    const newBtn = document.getElementById('NEW_BOTT');
    const isAuth = auth[1] === 'Y';

    newBtn.style.visibility = isAuth ? "visible" : "hidden";
    if (isAuth) {
        newBtn.onclick = addrec; // 使用簡化的事件綁定
    } else {
        newBtn.onclick = null;
    }

    // 更新背景樣式
    const bg = document.getElementById('lclbtnbk');
    Object.assign(bg.style, {
        backgroundColor: "#FCFCFC",
        border: "2px solid #FCFCFC",
        boxShadow: "sandybrown 5px 10px 10px 7px"
    });

    // 重置閉包變數 (歸零)
    cko[3](cko[3](0) * -1);
    cko[6](cko[6](0) * -1);

    // 切換快速鍵邏輯
    updateAccessKeys(['I', 'M', 'B'], ['T', 'J', 'K', 'V']);
}

function tab2View(event) {
    if (cko[2](0) === 0) {
        blkshow("未勾選任何紀錄，請勾選一筆再編輯表身內容");
        document.getElementById("tab1").checked = true;
        return false;
    }

    const bg = document.getElementById('lclbtnbk');
    Object.assign(bg.style, {
        backgroundColor: "#F9FAD9",
        border: "2px solid #F9FAD9",
        boxShadow: "olivedrab 5px 10px 10px 7px"
    });

    // 取得選中行的資料
    const selectedRow = document.querySelector("#maintbody1 input[type='checkbox']:checked")?.closest('tr');
    if (!selectedRow) return;

    const cells = Array.from(selectedRow.cells).map(c => c.innerHTML);
    const shrno = cells[cells.length - 3];

    document.getElementById('crncy').innerHTML = cells[cells.length - 8] + '&nbsp;';
    document.getElementById('keydscrpt1').innerHTML = `${cells[2]}&nbsp;${cells[3]}`;
    document.getElementById("fatherkey1").innerHTML = cells[1];
    document.getElementById("serverResponse2").innerHTML = '&nbsp;';

    // 重置閉包
    cko[3](cko[3](0) * -1);
    cko[6](cko[6](0) * -1);

    // 新增按鈕權限控管
    const newBtn = document.getElementById('NEW_BOTT');
    const canAdd = shrno !== 'Y' && getAuth[0]()[1] === 'Y';
    newBtn.style.visibility = canAdd ? "visible" : "hidden";
    newBtn.onclick = canAdd ? addrec : null;

    if (event !== 'GY') {
        updateAccessKeys(['T', 'J', 'K', 'V'], ['I', 'M', 'B']);
    }

    commontemp(cells[1], "d04.F01");
}

/** 輔助函式：統一處理 AccessKey 切換 **/
function updateAccessKeys(toRemove, toAdd) {
    document.querySelectorAll('.btn').forEach(btn => {
        if (toRemove.includes(btn.accessKey)) {
            btn.removeAttribute("accesskey");
        }
        const lastChar = btn.title.slice(-1);
        if (toAdd.includes(lastChar)) {
            btn.accessKey = lastChar;
        }
    });
}

function prntproc(event){
	

    const e = event || window.event;

    // 1. 取得表格並精確定位選中的行 (Checkbox 勾選的那一行)
    const maintable = document.getElementById("maintbody1");
    if (!maintable) return;

    const checkedInput = maintable.querySelector('input[type="checkbox"]:checked');
    if (!checkedInput) {
        alert("請先選擇一筆採購單據");
        return;
    }

    // 將該行單元格轉為陣列，並清理前後空白
    const row = checkedInput.closest('tr');
    const cells = Array.from(row.cells).map(cell => cell.innerText.trim());

    // 2. 取得環境與權限參數
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username') || "";
    
    let ourcmp = "";
    try {
        // 確保 getAuth 存在，避免腳本中斷
        ourcmp = (typeof getAuth !== 'undefined') ? getAuth[2]()[0].INT_000 : "";
    } catch (err) {
        console.warn("無法取得公司名稱 (ourCompany)");
    }

    // 3. 封裝採購單專用參數 (依照 headdata 索引對應)
    // 原 headdata[0] = cells[1], headdata[1] = cells[2] ... 依此類推
    const params = {
        ourCompany:  ourcmp,
        queryNo:     cells[1], // 採購單號
        // 供應商編號 + 空格 + 供應商簡稱
        customNo:    `${cells[2]}\u00A0${cells[4]}`, 
        // 採購人員 + 空格 + 姓名 + 填充空格
        salesMan:    `${cells[6]}\u00A0${cells[7]}\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0`,
        curNcy:      cells[8],  // 幣別
		curName:      cells[9],  // 幣別名稱
        shipAddress: cells[11], // 交貨地點 (地址常有 # 號，此處已安全化)
        shipDirect:  cells[12], // 運輸方式
        customerPo:  cells[10],  // 對方單號
        isConfirm:   cells[14], // 確認狀態 (Y/N)
        username:    username   // 登入者
    };

    // 4. 使用物件導向方式建立查詢字串
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined) {
            searchParams.append(key, params[key]);
        }
    });

    // 5. 組合最終 URL 並開啟
    const urlphp = `D04/BKND/D04report.php?${searchParams.toString()}`;
    window.open(urlphp, "_blank");	
}