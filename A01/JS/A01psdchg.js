/**
 * A01psdchg.js 重構優化版本
 * 1. 簡化 span 提示元素與按鈕的 DocumentFragment 建立。
 * 2. 統一使用 btnManager 工廠與標準 DOM API，替換傳統 getElementsByAttribute。
 * 3. 抽取閉包歸零（resetCko）與 AccessKey 切換邏輯，減少重複程式碼。
 * 4. 採用現代化 JS 語法（Array.from、querySelectorAll、Object.assign）。
 */

function selfTag(jsvsn, jsPth) {
    const contentdiv = document.querySelectorAll('.tab_content');
    const tabnames = document.getElementsByName('tablbl');
    const svrSpns1 = document.getElementById('serverResponse1');
    const svrSpns2 = document.getElementById('serverResponse2');
    const svrSpns3 = document.getElementById('serverResponse3');

    // --- 1. 建立 9 個隱藏的權限提示 span 元素 ---
    if (contentdiv[1] && svrSpns2) {
        const fragSpans = document.createDocumentFragment();
        for (let i = 0; i < 9; i++) {
            const hintSpan = document.createElement('span');
            hintSpan.style.display = 'none';
            hintSpan.setAttribute('name', i < 4 ? 'authBase' : 'authExtra');
            fragSpans.appendChild(hintSpan);
        }
        contentdiv[1].insertBefore(fragSpans, svrSpns2);
    }

    // --- 2. 複製權限按鈕判斷 ---
    if (getAuth[0]()[7] === 'Y') {
        if (getAuth[0]()[8] === 'Y' && contentdiv[2] && svrSpns3) {
            const btnCopy = btnManager.createBtn("COPY_BOTT", "\u{1F4BE}", "複製此功能畫面欄位屬性予以其他功能", null, authCopy);
            btnCopy.style.fontSize = "17px";

            const frag1 = document.createDocumentFragment();
            frag1.append(
                document.createTextNode('\u00A0'.repeat(5)),
                btnCopy,
                document.createTextNode('\u00A0')
            );
            contentdiv[2].insertBefore(frag1, svrSpns3);
        }
    } else {
        if (contentdiv[2]) contentdiv[2].style.display = 'none';
        if (tabnames[2]) tabnames[2].style.display = 'none';
    }

    // --- 3. 移除權限按鈕判斷 ---
    if (getAuth[0]()[6] === 'Y' && contentdiv[0] && svrSpns1) {
        const btnRemove = btnManager.createBtn("REMOVE_BOTT", "\u{1F512}", "移除此功能所有帳號權限", null, authRemove);
        btnRemove.style.fontSize = "17px";

        const frag2 = document.createDocumentFragment();
        frag2.append(
            document.createTextNode('\u00A0'.repeat(5)),
            btnRemove
        );
        contentdiv[0].insertBefore(frag2, svrSpns1);
    }

    // --- 4. 腳本清理與動態載入 ---
    document.querySelectorAll("script[id]").forEach(s => s.remove());

    const prefix = jsPth + jsPth.substr(0, 3);
    const scriptList = [
        [`${prefix}.js?v=${jsvsn}`, () => { if (window.DrawTable) DrawTable(); }],
        [`${prefix}rgst.js?v=${jsvsn}`],
        [`include/JS/commonsrch.js?v=${jsvsn}`],
        [`C01/JS/A01Name.js?v=${jsvsn}`]
    ];

    scriptList.forEach(cfg => loadScript(cfg[0], cfg[1] || null));

    // --- 5. 事件監聽綁定 ---
    const tabMap = { tab1: tab1View, tab2: tab2View, tab3: tab3View };
    Object.keys(tabMap).forEach(id => {
        const tab = document.getElementById(id);
        if (tab) attachEventListener(tab, "click", tabMap[id], false);
    });
}

// 輔助函式：閉包數值重置
function resetCko(indices) {
    indices.forEach(idx => {
        if (cko[idx]) {
            const current = cko[idx](0);
            cko[idx](current * -1);
        }
    });
}

// 輔助函式：切換 AccessKey
function updateAccessKeys(activeKeys, removeKeys) {
    document.querySelectorAll('.btn').forEach(btn => {
        const lastChar = btn.title.slice(-1);
        if (removeKeys.includes(btn.accessKey)) btn.removeAttribute("accesskey");
        if (activeKeys.includes(lastChar)) btn.accessKey = lastChar;
    });
}

// 輔助函式：取得表格中已勾選的 row 資料列
function getSelectedRowData() {
    const maintable = document.getElementById("maintbody1");
    if (!maintable) return null;

    const selectedRow = Array.from(maintable.rows).find(row => {
        const cb = row.cells[row.cells.length - 1].querySelector('input');
        return cb && cb.checked;
    });

    if (!selectedRow) return null;

    return Array.from(selectedRow.cells)
        .filter(c => c.className === 'directdata')
        .map(c => c.innerHTML);
}

function tab1View() {
    const lclbk = document.getElementById('lclbtnbk');
    if (lclbk) {
        Object.assign(lclbk.style, {
            backgroundColor: "#FCFCFC",
            border: "2px solid #FCFCFC",
            boxShadow: "sandybrown 5px 10px 10px 7px"
        });
    }

    resetCko([3, 6]);
    updateAccessKeys(['T', 'J', 'K', 'V'], ['I', 'M']);
}

function tab2View() {
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

    const aWaitUpdate = getSelectedRowData();
    if (aWaitUpdate) {
        const keydescription = document.getElementById('keydscrpt1');
        const fthkey = document.getElementById("fatherkey1");
        const responseDiv = document.getElementById("serverResponse2");

        if (keydescription) keydescription.innerHTML = aWaitUpdate[2];
        if (fthkey) fthkey.innerHTML = aWaitUpdate[1];
        if (responseDiv) responseDiv.innerHTML = '&nbsp;';

        resetCko([3, 6]);
        updateAccessKeys(['I', 'M'], ['T', 'J', 'K', 'V']);

        if (window.commontemp && fthkey) commontemp(fthkey.innerHTML, "a02.F03");
    }
}

function tab3View() {
    const lclbk = document.getElementById('lclbtnbk');
    if (lclbk) {
        Object.assign(lclbk.style, {
            backgroundColor: "#F3F3FA",
            border: "2px solid #F3F3FA",
            boxShadow: "skyblue 5px 10px 10px 7px"
        });
    }

    if (cko[2](0) === 0) {
        if (window.blkshow) blkshow("未勾選任何紀錄，請勾選一筆再編輯表身內容");
        const t1 = document.getElementById("tab1");
        if (t1) t1.checked = true;
        return false;
    }

    const aWaitUpdate = getSelectedRowData();
    if (aWaitUpdate) {
        const keydescription = document.getElementById('keydscrpt2');
        const fthkey = document.getElementById("fatherkey2");
        const responseDiv = document.getElementById("serverResponse3");

        if (keydescription) keydescription.textContent = aWaitUpdate[2];
        if (fthkey) fthkey.innerHTML = aWaitUpdate[1];
        if (responseDiv) responseDiv.innerHTML = '&nbsp;';

        resetCko([4, 6]);
        updateAccessKeys(['I', 'M'], ['T', 'J', 'K', 'V']);

        if (window.commontemp && fthkey) commontemp(fthkey.innerHTML, "a04.F01");
    }
}