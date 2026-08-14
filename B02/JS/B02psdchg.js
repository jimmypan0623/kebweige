/**
 * 進貨單初始畫面優化版
 */
function selfTag(jsvsn, jsPth) {
    const maindiv = document.getElementsByClassName('tab_css')[0];
    const beinsertedid = document.getElementById('tab1');
    const orpButton5 = document.getElementById("lgt"); // 離開按鈕
    const cntdiv1 = document.querySelectorAll('.tab_content')[1];
    const rspn2 = document.getElementById('serverResponse2');

    if (!maindiv || !beinsertedid) return;

    // --- 1. 頂部狀態標籤 ---
    const spn = document.createElement('span');
    spn.id = "APPRVE";
    maindiv.insertBefore(spn, beinsertedid);

    // --- 2. 總金額資訊區塊 ---
    if (cntdiv1) {
        const frag1 = document.createDocumentFragment();
        
        // 輔助函式：建立文字節點
        const space = (n) => document.createTextNode('\u00A0'.repeat(n));
        const createSpan = (id, text, className) => {
            const s = document.createElement('span');
            s.id = id;
            if (text) s.textContent = text;
            if (className) s.className = className;
            return s;
        };

        frag1.appendChild(space(9));
        frag1.appendChild(createSpan("ttltitle", "總金額:"));
        frag1.appendChild(createSpan("crncy"));
        frag1.appendChild(createSpan("ttlmny", "0", "ttl"));
        
        cntdiv1.insertBefore(frag1, rspn2);
    }

    // --- 3. 按鈕區塊 (確認/反確認/列印) ---
    const fragButtons = document.createDocumentFragment();
    
    const createBtn = (id, val, title, key, clickFn) => {
        const btn = document.createElement("input");
        btn.type = "button";
        btn.className = "btn";
        btn.id = id;
        btn.value = val;
        btn.title = title;
        btn.accessKey = key;
        if (clickFn) attachEventListener(btn, "click", clickFn, false);
        return btn;
    };
	
	const btnAns = createBtn("ANS_BOTT", "\u{2714}", "確認本張進貨單所有紀錄，快速鍵Alt+A", "A", ansproc);
    const btnVrs = createBtn("VRS_BOTT", "\u{21A9}", "反確認本張進貨單所有紀錄，快速鍵Alt+Z", "Z", vrsproc);
    const btnPrnt = createBtn("PRNT_BOTT", "\u{1F5A8}", "列印所選紀錄，快速鍵Alt+P", "P", prntproc);

    // 修正拼字並設定樣式
    btnVrs.style.cssText = "visibility:visible; font-size:130%; margin:0; color:black;";

    fragButtons.appendChild(btnAns);
    fragButtons.appendChild(document.createTextNode('\u00A0'));
    fragButtons.appendChild(btnVrs);
    fragButtons.appendChild(document.createTextNode('\u00A0\u00A0'));
    fragButtons.appendChild(btnPrnt);
    fragButtons.appendChild(document.createTextNode('\u00A0\u00A0'));

    maindiv.insertBefore(fragButtons, orpButton5);

    // --- 4. 腳本載入清理 ---
    document.querySelectorAll("script[id]").forEach(s => s.remove());

    const prefix = jsPth + jsPth.substr(0, 3);
    const loadList = [
        [`${prefix}.js?v=${jsvsn}`, () => { if(typeof DrawTable !== 'undefined') DrawTable(); }],
        [`${prefix}rgst.js?v=${jsvsn}`],
        [`include/JS/commonsrch.js?v=${jsvsn}`],
        [`C01/JS/A09getno.js?v=${jsvsn}`],
        [`include/JS/confirmfun.js?v=${jsvsn}`],
        [`C01/JS/A01Name.js?v=${jsvsn}`],
        [`B02/JS/A14Name.js?v=${jsvsn}`]
    ];

    loadList.forEach(cfg => loadScript(cfg[0], cfg[1] || null));

    // --- 5. 分頁切換事件 ---
    ['tab1', 'tab2'].forEach(id => {
        const tab = document.getElementById(id);
        if (tab) attachEventListener(tab, "click", (id === 'tab1' ? tab1View : tab2View), false);
    });
}

/**
 * 閉包變數歸零輔助
 */
function resetCko() {
    [3, 6].forEach(idx => {
        if (cko[idx]) {
            const current = cko[idx](0);
            cko[idx](current * -1);
        }
    });
}

function tab1View() {
    const newrcath = document.getElementById('NEW_BOTT');
    const canAdd = (getAuth[0]()[1] === 'Y' && cko[0](0) === 0);

    if (newrcath) {
        newrcath.style.visibility = canAdd ? "visible" : "hidden";
        if (canAdd) attachEventListener(newrcath, "click", addrec, false);
        else detachEventListener(newrcath, "click", addrec, false);
    }

    const localBtnBk = document.getElementById('lclbtnbk');
    if (localBtnBk) {
        Object.assign(localBtnBk.style, {
            backgroundColor: "#FCFCFC",
            border: "2px solid #FCFCFC",
            boxShadow: "sandybrown 5px 10px 10px 7px"
        });
    }

    resetCko();

    // 清除不適用的快速鍵
    document.querySelectorAll('.btn').forEach(btn => {
        if (['I', 'M'].includes(btn.accessKey)) btn.removeAttribute("accesskey");
    });
}

function tab2View(event) {
    const localBtnBk = document.getElementById('lclbtnbk');
    if (localBtnBk) {
        Object.assign(localBtnBk.style, {
            backgroundColor: "#F9FAD9",
            border: "2px solid #F9FAD9",
            boxShadow: "olivedrab 5px 10px 10px 7px"
        });
    }

    if (cko[2](0) === 0) {
        if (typeof blkshow === 'function') blkshow("未勾選任何紀錄，請勾選一筆再編輯表身內容");
        const t1 = document.getElementById("tab1");
        if (t1) t1.checked = true;
        return false;
    }

    const maintable = document.getElementById("maintbody1");
    if (!maintable) return;

    // 尋找被勾選的列並取得資料
    const checkedRow = Array.from(maintable.rows).find(row => {
        const lastCell = row.cells[row.cells.length - 1];
        return lastCell && lastCell.querySelector('input:checked');
    });

    if (checkedRow) {
        const rowData = Array.from(checkedRow.cells).map(c => c.textContent.trim());
        const shrno = rowData[rowData.length - 3]; // 依照原邏輯取倒數第二格

        document.getElementById('keydscrpt1').textContent = `${rowData[2]}\u00A0${rowData[3]}`;
        document.getElementById("fatherkey1").textContent = rowData[1];
        document.getElementById("serverResponse2").textContent = '\u00A0';

        resetCko();

        // 權限控制
        const newrcath = document.getElementById('NEW_BOTT');
        if (newrcath) {
            const isAuthorized = (getAuth[0]()[1] === 'Y' && cko[0](0) === 0);
            const shouldShow = (shrno !== 'Y' && isAuthorized);
            newrcath.style.visibility = shouldShow ? "visible" : "hidden";
            
            if (shouldShow) attachEventListener(newrcath, "click", addrec, false);
            else detachEventListener(newrcath, "click", addrec, false);
        }

        // 重新分配快速鍵 (排除 GY 模式)
        if (event !== 'GY') {
            document.querySelectorAll('.btn').forEach(btn => {
                const lastChar = btn.title.slice(-1);
                if (['I', 'M'].includes(lastChar)) btn.setAttribute("accesskey", lastChar);
            });
        }

        if (typeof commontemp === 'function') commontemp(rowData[1], "b0b.F01");
    }
}

function prntproc(event) {
    const e = event || window.event;
    const maintable = document.getElementById("maintbody1");
    if (!maintable) return;

    const checkedInput = maintable.querySelector('input[type="checkbox"]:checked');
    if (!checkedInput) {
        alert("請先選擇一筆單據");
        return;
    }

    const row = checkedInput.closest('tr');
    if (!row) return;

    const cells = Array.from(row.cells).map(cell => cell.textContent.trim());

    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username') || "";
    const ourcmp = (typeof getAuth !== 'undefined') ? getAuth[2]()[0].INT_000 : "";

    // 建立參數物件
    const params = {
        ourCompany: ourcmp,
        queryNo: cells[1],
        customNo: `${cells[2]}\u00A0${cells[4]}`,
        shipAddress: cells[20],
        unitno: cells[5],
        contact: `${cells[6]}\u00A0\u00A0\u00A0\u00A0`,
        telNo: cells[7],
        salesMan: `${cells[9]}\u00A0${cells[10]}\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0`,
        curNcy: `${cells[11]}\u00A0\u00A0`,
        curNname: `${cells[12]}\u00A0\u00A0\u00A0\u00A0`,
        rate: cells[13],
        shipDate: `${cells[22]}-${cells[8]}`,
        shipDirect: cells[21],
        invoiceNo: cells[14],
        invoiceType: cells[15],
        taxType: cells[17],
        payment: cells[19],
        isConfirm: cells[23],
        username: username
    };

    const searchParams = new URLSearchParams(params);
    window.open(`B02/BKND/B02report.php?${searchParams.toString()}`, "_blank");
}