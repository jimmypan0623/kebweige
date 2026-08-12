/**
 * A02psdchg.js 重構優化版本
 * 1. 統一採用 btnManager 工廠建立複製權限與移除權限按鈕。
 * 2. 採用 DocumentFragment 減少 DOM 繪製開銷。
 * 3. 提煉 resetCko、updateAccessKeys 及 getSelectedRowData 工具函式，提高程式碼可讀性與複用性。
 * 4. 淘汰傳統 getElementsByAttribute，全面改用現代 Native DOM API（querySelectorAll、Array.from、Object.assign）。
 */

function selfTag(jsvsn, jsPth) {
    const contentdiv = document.querySelectorAll('.tab_content');
    const svrSpns1 = document.getElementById('serverResponse1');

    if (contentdiv[0] && svrSpns1) {
        const fragButtons = document.createDocumentFragment();

        // 權限判斷 1: 複製帳戶權限按鈕
        if (getAuth[0]()[5] === 'Y') {
            const btnCopy = btnManager.createBtn("COPY_BOTT", "\u{1F465}", "複製此帳戶權限予以他人", null, authCopy);
            btnCopy.style.fontSize = "17px";
            fragButtons.append(
                document.createTextNode('\u00A0'.repeat(5)),
                btnCopy,
                document.createTextNode('\u00A0')
            );
        }

        // 權限判斷 2: 移除帳戶權限按鈕
        if (getAuth[0]()[6] === 'Y') {
            const btnRemove = btnManager.createBtn("REMOVE_BOTT", "\u{1F512}", "移除此帳戶所有功能權限", null, authRemove);
            btnRemove.style.fontSize = "17px";
            if (!getAuth[0]()[5] || getAuth[0]()[5] !== 'Y') {
                fragButtons.append(document.createTextNode('\u00A0'.repeat(5)));
            }
            fragButtons.append(btnRemove);
        }

        if (fragButtons.childNodes.length > 0) {
            contentdiv[0].insertBefore(fragButtons, svrSpns1);
        }
    }

    // 腳本清理與載入
    document.querySelectorAll("script[id]").forEach(s => s.remove());

    const prefix = jsPth + jsPth.substr(0, 3);
    const scriptList = [
        [`${prefix}.js?v=${jsvsn}`, () => { if (window.DrawTable) DrawTable(); }],
        [`${prefix}rgst.js?v=${jsvsn}`],
        [`include/JS/commonsrch.js?v=${jsvsn}`]
    ];

    scriptList.forEach(cfg => loadScript(cfg[0], cfg[1] || null));

    // 事件監聽綁定
    ['tab1', 'tab2'].forEach(id => {
        const tab = document.getElementById(id);
        if (tab) attachEventListener(tab, "click", id === 'tab1' ? tab1View : tab2View, false);
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

// 輔助函式：取得表格中已勾選的列資料
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

    resetCko([3]);
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

        resetCko([3]);
        updateAccessKeys(['I', 'M'], ['T', 'J', 'K', 'V']);

        if (window.commontemp && fthkey) commontemp(fthkey.innerHTML, "a02.F01");
    }
}