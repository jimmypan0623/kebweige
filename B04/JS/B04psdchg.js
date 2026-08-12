/**
 * 優化建議：
 * 1. 修復拼字錯誤 (visiblity -> visibility)。
 * 2. 合併 Fragment 減少重繪。
 * 3. 使用更現代的選擇器。
 */
function selfTag(jsvsn, jsPth) {
    const maindiv = document.getElementsByClassName('tab_css')[0];
    const beinsertedid = document.getElementById('tab1');
    const orpButton5 = document.getElementById("lgt");
    const cntdiv1 = document.querySelectorAll('.tab_content')[1];
    const rspn2 = document.getElementById('serverResponse2');

    if (!maindiv || !beinsertedid) return;

    // --- 區塊 1: 插入頂部狀態標籤 ---
    const spn = document.createElement('span');
    spn.id = "APPRVE";
    maindiv.insertBefore(spn, beinsertedid);

    // --- 區塊 2: 插入總金額資訊 ---
    const frag1 = document.createDocumentFragment();
    // 使用簡單的字串重複生成空白
    frag1.appendChild(document.createTextNode('\u00A0'.repeat(9)));
    
    const createSpan = (id, text, className) => {
        const s = document.createElement('span');
        s.id = id;
        if (text) s.textContent = text;
        if (className) s.className = className;
        return s;
    };

    frag1.appendChild(createSpan("ttltitle", "總金額:"));
    frag1.appendChild(createSpan("ttlmny", "0", "ttl"));
    frag1.appendChild(createSpan("isTax"));
    
    if (cntdiv1) cntdiv1.insertBefore(frag1, rspn2);

    // --- 區塊 3: 插入按鈕 ---
    const fragButtons = document.createDocumentFragment();
    
   
    const btnAns = btnManager.createBtn("ANS_BOTT", "\u{2714}", "確認本張出貨單所有紀錄，快速鍵Alt+A", "A", ansproc);
    const btnVrs = btnManager.createBtn("VRS_BOTT", "\u{1F504}", "反確認本張出貨單所有紀錄，快速鍵Alt+Z", "Z", vrsproc);
    const btnPrnt = btnManager.createBtn("PRNT_BOTT", "\u{1F5A8}", "列印所選紀錄，快速鍵Alt+P", "P", prntproc);

    // 針對特殊樣式的按鈕進行調整
    btnVrs.style.cssText = "visibility:visible; font-size:130%; margin:0; color:black;";

    // 組裝按鈕 Fragment
    fragButtons.appendChild(btnAns);
    fragButtons.appendChild(btnVrs); // 依照原邏輯，Vrs 是單獨 insert 或放 Frag? 
    // 原代碼 Vrs 單獨 insert，其餘進 Frag2。這裡調整為統一邏輯：
    maindiv.insertBefore(btnVrs, orpButton5);
    
    const spacer = () => document.createTextNode('\u00A0\u00A0');
    fragButtons.appendChild(spacer());
    fragButtons.appendChild(btnPrnt);
    fragButtons.appendChild(spacer());
    
    maindiv.insertBefore(fragButtons, orpButton5);

    // --- 區塊 4: 腳本清理與載入 ---
    document.querySelectorAll("script[id]").forEach(s => s.remove());

    const prefix = jsPth + jsPth.substr(0, 3);
    const scripts = [
        [`${prefix}.js?v=${jsvsn}`, () => { if(typeof DrawTable !== 'undefined') DrawTable(); }],
        [`${prefix}rgst.js?v=${jsvsn}`],
        [`include/JS/commonsrch.js?v=${jsvsn}`],
        [`C01/JS/A09getno.js?v=${jsvsn}`],
        [`include/JS/confirmfun.js?v=${jsvsn}`],
        [`C01/JS/A01Name.js?v=${jsvsn}`],
        [`B02/JS/A14Name.js?v=${jsvsn}`]
    ];

    scripts.forEach(cfg => loadScript(cfg[0], cfg[1] || null));

    // --- 區塊 5: 分頁事件 ---
    ['tab1', 'tab2'].forEach(id => {
        const el = document.getElementById(id);
        if (el) attachEventListener(el, "click", (id === 'tab1' ? tab1View : tab2View), false);
    });
}

function resetCko() {
    [3, 6].forEach(idx => {
        if (cko[idx]) {
            const val = cko[idx](0);
            cko[idx](val * -1);
        }
    });
}

function tab1View(event) {
    const newrcath = document.getElementById('NEW_BOTT');
    // 邏輯判斷
    const canAdd = (getAuth[0]()[1] === 'Y' && cko[0](0) === 0);
    
    if (newrcath) {
        newrcath.style.visibility = canAdd ? "visible" : "hidden";
        if (canAdd) attachEventListener(newrcath, "click", addrec, false);
        else detachEventListener(newrcath, "click", addrec, false);
    }

    const localbottoncl = document.getElementById('lclbtnbk');
    if (localbottoncl) {
        Object.assign(localbottoncl.style, {
            backgroundColor: "#FCFCFC",
            border: "2px solid #FCFCFC",
            boxShadow: "sandybrown 5px 10px 10px 7px"
        });
    }

    resetCko();

    document.querySelectorAll('.btn').forEach(btn => {
        if (['I', 'M'].includes(btn.accessKey)) {
            btn.removeAttribute("accesskey");
        }
    });
}

function tab2View(event) {
    const localbottoncl = document.getElementById('lclbtnbk');
    if (localbottoncl) {
        Object.assign(localbottoncl.style, {
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

    // 使用 find 尋找被勾選的列
    const checkedRow = Array.from(maintable.rows).find(row => {
        const lastCell = row.cells[row.cells.length - 1];
        return lastCell && lastCell.querySelector('input:checked');
    });

    if (checkedRow) {
        const rowData = Array.from(checkedRow.cells).map(c => c.textContent);
        const shrno = rowData[rowData.length - 3];        
        document.getElementById('keydscrpt1').textContent = `${rowData[2]}\u00A0${rowData[3]}`;
        document.getElementById("fatherkey1").textContent = rowData[1];
        document.getElementById("serverResponse2").textContent = '\u00A0';

        resetCko();

        // 控制新增按鈕
        const newrcath = document.getElementById('NEW_BOTT');
        if (newrcath) {
            const isY = (shrno === 'Y');
            const authOk = (getAuth[0]()[1] === 'Y' && cko[0](0) === 0);
            newrcath.style.visibility = (!isY && authOk) ? "visible" : "hidden";
            if (!isY && authOk) attachEventListener(newrcath, "click", addrec, false);
            else detachEventListener(newrcath, "click", addrec, false);
        }
        
        if (event !== 'GY') {
            document.querySelectorAll('.btn').forEach(btn => {
                const lastChar = btn.title.slice(-1);
                if (['I', 'M'].includes(lastChar)) {
                    btn.setAttribute("accesskey", lastChar);
                }
            });
        }
        
        if (typeof commontemp === 'function') {
            commontemp(rowData[1], "b0d.F01");
        }
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
        username: username,
		taxrate:getAuth[2]().INT_002
    };

    const searchParams = new URLSearchParams(params);
    window.open(`B04/BKND/B04report.php?${searchParams.toString()}`, "_blank");
}