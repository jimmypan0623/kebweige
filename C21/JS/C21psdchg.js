/**
 * 優化建議：
 * 1. 統一按鈕建立邏輯 (createBtn)，消除重複的屬性設定。
 * 2. 修正拼字 visiblity -> visibility。
 * 3. 採用 DocumentFragment 提升渲染效能。
 * 4. 使用 URLSearchParams 確保報價單備註中的特殊符號（如 &, #）能正確傳遞。
 */
function selfTag(jsvsn, jsPth) {
    const maindiv = document.getElementsByClassName('tab_css')[0];
    const beinsertedid = document.getElementById('tab1');
    const cntdiv1 = document.querySelectorAll('.tab_content')[1];
    const rspn2 = document.getElementById('serverResponse2');
    const orpButton5 = document.getElementById("lgt");

    if (!maindiv || !beinsertedid) return;

    // --- 區塊 1: 插入狀態標籤與金額資訊 ---
    const spnApprove = document.createElement('span');
    spnApprove.id = "APPRVE";
    maindiv.insertBefore(spnApprove, beinsertedid);

    const fragInfo = document.createDocumentFragment();
    const createSpan = (id, text, className) => {
        const s = document.createElement('span');
        s.id = id;
        if (text) s.innerHTML = text;
        if (className) s.className = className;
        return s;
    };

    fragInfo.append(
        document.createTextNode('\u00A0'.repeat(7)),
        createSpan("ttltitle", "總金額:"),
        createSpan("crncy", ""),
        createSpan("ttlmny", "0", "ttl")
    );
    if (cntdiv1) cntdiv1.insertBefore(fragInfo, rspn2);

    // --- 區塊 2: 功能按鈕 (確認/反確/轉訂單/列印) ---
    const fragButtons = document.createDocumentFragment();
    const btnStyle = "visibility:visible; font-size:130%; margin:0; color:black;";

    const btnAns = createBtn("ANS_BOTT", "\u{2714}", "確認本報價單所有紀錄，快速鍵Alt+A", "A", ansproc);
    const btnVrs = createBtn("VRS_BOTT", "\u{1F504}", "反確認本報價單所有紀錄，快速鍵Alt+Z", "Z", vrsproc);
    const btnTrn = createBtn("TRN_BOTT", "\u{1F516}", "直接轉客戶訂單，快速鍵Alt+G", "G", null);

    [btnAns, btnVrs, btnTrn].forEach(btn => btn.style.cssText = btnStyle);
    
    fragButtons.append(document.createTextNode('\u00A0'), btnAns, btnVrs, btnTrn);

    // 權限判斷：列印按鈕
    if (getAuth[0]()[4] === 'Y') {
        const btnPrnt = createBtn("PRNT_BOTT", "\u{1F5A8}", "列印所選紀錄，快速鍵Alt+P", "P", prntproc);
        btnPrnt.style.cssText = btnStyle;
        fragButtons.append(btnPrnt, document.createTextNode('\u00A0\u00A0'));
    }

    maindiv.insertBefore(fragButtons, orpButton5);

    // --- 區塊 3: 腳本清理與載入 ---
    document.querySelectorAll("script[id]").forEach(s => s.remove());

    const prefix = jsPth + jsPth.substr(0, 3);
    const scriptList = [
        [`${prefix}.js?v=${jsvsn}`, () => { if(window.DrawTable) DrawTable(); }],
        [`${prefix}rgst.js?v=${jsvsn}`],
        [`C01/JS/A09getno.js?v=${jsvsn}`],
        [`include/JS/commonsrch.js?v=${jsvsn}`],
        [`include/JS/confirmfun.js?v=${jsvsn}`]
    ];

    scriptList.forEach(cfg => loadScript(cfg[0], cfg[1] || null));

    // 事件監聽
    ['tab1', 'tab2'].forEach(id => {
        const tab = document.getElementById(id);
        if (tab) attachEventListener(tab, "click", (id === 'tab1' ? tab1View : tab2View), false);
    });
}

// 輔助工具：按鈕工廠
function createBtn(id, val, title, key, clickFn) {
    const btn = document.createElement("input");
    btn.type = "button";
    btn.className = "btn";
    btn.id = id;
    btn.value = val;
    btn.title = title;
    btn.accessKey = key;
    if (clickFn) attachEventListener(btn, "click", clickFn, false);
    return btn;
}

// 輔助工具：重置閉包計數
function resetCko() {
    [3, 6].forEach(idx => {
        if (cko[idx]) {
            const val = cko[idx](0);
            cko[idx](val * -1);
        }
    });
}

function tab1View() {
    const newBtn = document.getElementById('NEW_BOTT');
    const hasAuth = getAuth[0]()[1] === 'Y';
    
    if (newBtn) {
        newBtn.style.visibility = hasAuth ? "visible" : "hidden";
        if (hasAuth) attachEventListener(newBtn, "click", addrec, false);
    }

    const lclbk = document.getElementById('lclbtnbk');
    if (lclbk) {
        Object.assign(lclbk.style, {
            backgroundColor: "#FCFCFC",
            border: "2px solid #FCFCFC",
            boxShadow: "sandybrown 5px 10px 10px 7px"
        });
    }

    resetCko();

    // 更新 AccessKey
    document.querySelectorAll('.btn').forEach(btn => {
        const lastChar = btn.title.slice(-1);
        if (['I', 'M'].includes(btn.accessKey)) btn.removeAttribute("accesskey");
        if (['T', 'J', 'K', 'V'].includes(lastChar)) btn.accessKey = lastChar;
    });
}

function tab2View(event) {
    const lclbk = document.getElementById('lclbtnbk');
    if (lclbk) {
        Object.assign(lclbk.style, {
            backgroundColor: "#F9FAD9",
            border: "2px solid #F9FAD9",
            boxShadow: "olivedrab 5px 10px 10px 7px"
        });
    }

    if (cko[2](0) === 0) {
        if (window.blkshow) blkshow("未勾選任何紀錄，請勾選一筆再編輯表身內容");
        const t1 = document.getElementById("tab1");
        if (t1) t1.checked = true;
        return false;
    }

    const maintable = document.getElementById("maintbody1");
    if (!maintable) return;

    // 取得選中列資料
    const selectedRow = Array.from(maintable.rows).find(row => {
        const cb = row.cells[row.cells.length - 1].querySelector('input');
        return cb && cb.checked;
    });

    if (selectedRow) {
        const cells = Array.from(selectedRow.cells).map(c => c.innerHTML);
        const shrno = cells[cells.length - 3];

        document.getElementById('crncy').innerHTML = cells[cells.length - 9];
        document.getElementById('keydscrpt1').innerHTML = `${cells[2]}&nbsp;${cells[3]}`;
        document.getElementById("fatherkey1").innerHTML = cells[1];
        document.getElementById("serverResponse2").innerHTML = '&nbsp;';

        resetCko();

        // 新增按鈕權限控制
        const newBtn = document.getElementById('NEW_BOTT');
        if (newBtn) {
            const canAdd = (shrno !== 'Y' && getAuth[0]()[1] === 'Y');
            newBtn.style.visibility = canAdd ? "visible" : "hidden";
            if (canAdd) attachEventListener(newBtn, "click", addrec, false);
            else detachEventListener(newBtn, "click", addrec, false);
        }

        // 切換 AccessKey
        if (event !== 'GY') {
            document.querySelectorAll('.btn').forEach(btn => {
                const lastChar = btn.title.slice(-1);
                if (['T', 'J', 'K', 'V'].includes(btn.accessKey)) btn.removeAttribute("accesskey");
                if (['I', 'M'].includes(lastChar)) btn.accessKey = lastChar;
            });
        }
        if (window.commontemp) commontemp(cells[1], "c27.F01");
    }
}

function prntproc() {
    const maintable = document.getElementById("maintbody1");
    const checked = maintable ? maintable.querySelector('input:checked') : null;
    
    if (!checked) {
        alert("請先選擇一筆報價單據");
        return;
    }

    const row = checked.closest('tr');
    const cells = Array.from(row.cells).map(c => c.textContent.trim());
    const urlParams = new URLSearchParams(window.location.search);

    // 封裝報價單報表參數
    const params = {
        ourCompany: (typeof getAuth !== 'undefined') ? getAuth[2]()[0].INT_000 : "",
        queryNo: cells[1],
        customNo: cells[2],
        customName: cells[4],
        quotationDate: cells[5],
        salesMan: `${cells[6]}\u00A0${cells[7]}\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0`,
        curNcy: cells[8],
        curNname: cells[9],
        windowMan: cells[10],
        shipWay: cells[11],
        payMent: cells[12],
        reMark: cells[13],
        isConfirm: cells[15],
        username: urlParams.get('username') || ""
    };

    const qs = new URLSearchParams(params).toString();
    window.open(`C21/BKND/C21report.php?${qs}`, "_blank");
}