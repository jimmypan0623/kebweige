<?php 
require_once("../../include/BKND/auth_checkforreport.php"); //驗證 
require_once('../../tcpdf/tcpdf.php');
// --- 1. 安全性檢查與變數初始化 ---
$queryNo = isset($_GET['queryNo']) ? $_GET['queryNo'] : '';

// --- 2. 擴充 TCPDF 類別 ---
class MYPDF extends TCPDF {
    public $customData = [];
    public $grandTotal = 0;
    public function Header() {
        $this->SetFont('msungstdlight', '', 10);      
        $headerHtml = '
        <h4 style="font-size: 16pt; text-align: center; margin: 0; padding: 0;">
         ' . ($this->customData['ourCompany'] ?? '') . '
        </h4>        
        <table border="0" width="100%">
            <tr>
                <td style="width:50%;text-align: right; font-size: 14pt; font-weight: bold;">出貨單</td>
                <td style="width:50%;text-align: right; font-size: 8pt;">頁次:'.$this->getAliasNumPage().'/'.$this->getAliasNbPages().'</td>
            </tr>
        </table>';
        
        $infoTable = '
        <table cellpadding="1" border="0" width="100%">
            <tr>
                <td style="width:75%;">客戶編號: '.($this->customData['customNo'] ?? '').'</td>
                <td style="width:25%; text-align:right;">出貨單號: '.($this->customData['queryNo'] ?? '').'</td>
            </tr>
            <tr>
                <td style="width:75%;">聯絡人: '.($this->customData['contact'] ?? '').' 連絡電話:'.($this->customData['telNo'] ?? '').'</td>
                <td style="width:25%; text-align:right;">發票號碼: '.($this->customData['invoiceNo'] ?? '').'</td>
            </tr>
            <tr>
                <td style="width:80%;">交易幣別: '.($this->customData['curNcy'] ?? '').($this->customData['curNname'] ?? '').'  匯率: '.($this->customData['rate'] ?? '').'&nbsp;&nbsp;&nbsp;付款條件: '.($this->customData['payment'] ?? '').'</td>
                <td style="width:20%; text-align:right;">統一編號: '.($this->customData['unitno'] ?? '').'&nbsp;</td>
            </tr>
            <tr>
                <td style="width:40%;">業務擔當: '.($this->customData['salesMan'] ?? '').'</td>
                <td style="width:60%; text-align:right;">出貨指示: '.($this->customData['shipDirect'] ?? '').'</td>
            </tr>
            <tr>
                <td style="width:75%;">交貨地點: '.($this->customData['shipAddress'] ?? '').'</td>
                <td style="width:25%; text-align:right;">出貨日期: '.($this->customData['shipDate'] ?? '').'&nbsp;</td> 
            </tr>
        </table>';

        $this->writeHTML($headerHtml . $infoTable, true, false, false, false, '');
    }

    public function Footer() {
		$this->SetY(-20);
		$this->SetFont('msungstdlight', '', 10); 
		
		// 記錄目前「簽收」的起點 X 座標
		$startX = $this->GetX();

		$this->Cell(40, 10, '簽收:', 0, 0, 'L'); 
		
		// 記錄目前「審核」的起點 X 座標
		$auditX = $this->GetX(); 
		$this->Cell(40, 10, '審核:', 0, 0, 'L'); 

		// --- 修正後的簽核圖檔判斷 ---
		// 統一使用正確拼法 isConfirm
		$confirmStatus = strtoupper(trim($this->customData['isConfirm'] ?? ''));

		if ($confirmStatus == 'Y') {
			// 根據「審核」文字的起點座標來位移，這樣位置最精準
			// 參數說明：$auditX 為「審核」二字的起點，往右移 10mm 處畫章
			$this->Image('../../digits/approve.gif', $auditX + 10, $this->GetY() - 2, 12, 12, 'GIF');			 
		}

		$this->SetX($auditX + 40); // 移動到「審核」之後的位置
		$this->Cell(80, 10, '開單：' . ($this->customData['username'] ?? ''), 0, 0, 'L');
	}
}

// --- 3. 資料庫處理與初始化 ---
require_once("../../include/BKND/mysqli_server.php"); // 引入設定檔
$cleanQueryNo = mysqli_real_escape_string($link, $queryNo);

$sql = "SELECT b0d.*, b01.F02 as F0B, b01.F04 as F0D ,a14.F02 AS F02b
        FROM b0d LEFT JOIN b01 ON b0d.F03 = b01.F01 LEFT JOIN a14 ON a14.F01=b0d.F05
        WHERE b0d.F01 = '$cleanQueryNo' 
        ORDER BY b0d.F03";

$result = mysqli_query($link, $sql);
$rows = [];
$total = 0;
while ($row = mysqli_fetch_assoc($result)) {
    $total += ($row['F15'] * $row['F04']);
    $rows[] = $row;
}

// 初始化 PDF

$pageLayout = array(215.9, 139.7); 
$pdf = new MYPDF('L', 'mm', $pageLayout, true, 'UTF-8', false); 
$pdf->customData = $_GET; 
$pdf->grandTotal = $total;

$pdf->SetMargins(5, 48, 5); // 增加上邊界，給 Header 空間
$pdf->SetHeaderMargin(5);
$pdf->SetFooterMargin(10); 
$pdf->SetAutoPageBreak(TRUE, 25); 
$pdf->AddPage();

// --- 4. 構建主表格 (加入分頁邏輯) ---
$pdf->SetFont('msungstdlight', '', 9); 

$maxRowsPerPage = 5; // 設定每頁最大筆數
$rowCount = count($rows);
$pages = ceil($rowCount / $maxRowsPerPage); // 計算總共需要幾頁
$tax_isinside=(($_GET['invoiceType']=='32' && $_GET['taxType']=='1')?"02":"00");  //稅是否內含
for ($p = 0; $p < $pages; $p++) {
    // 每一頁都重新開始一個 HTML 字串
	
    $html = '<table cellpadding="3" border="0.5" width="100%">
        <thead>
            <tr style="background-color: #f2f2f2; font-weight: bold; text-align: center;">
                <th style="width: 90px;">料品編號</th>
                <th style="width: 110px;">品名規格</th>				
                <th style="width: 30px;">單位</th>
                <th style="width: 50px;">數量</th>
                <th style="width: 60px;">單價'.($tax_isinside=="02"?"(含稅)":"").'</th>
                <th style="width: 70px;">小計</th>
                <th style="width: 50px;">出貨部門</th>
                <th style="width: 75px;">客戶品號/PO</th>
                <th style="width: 55px;">訂單號碼</th>
            </tr>
        </thead>
        <tbody>';

    // 取得當前頁面要顯示的 5 筆資料
    $startIdx = $p * $maxRowsPerPage;
    $pageData = array_slice($rows, $startIdx, $maxRowsPerPage);

    foreach ($pageData as $row) {
        $subtotal = $row['F15'] * $row['F04'];
        $html .= '
        <tr>
            <td style="width: 90px;">'.$row['F03'].'</td>
            <td style="width: 110px;">'.$row['F0B'].'</td>			
            <td style="width: 30px; text-align:center;">'.$row['F0D'].'</td>
            <td style="width: 50px; text-align:right;">'.number_format($row['F04']).'</td>
            <td style="width: 60px; text-align:right;">'.number_format($row['F15'], 2).'</td>
            <td style="width: 70px; text-align:right;">'.number_format($subtotal, 2).'</td>
            <td style="width: 50px;">'.$row['F05'].'<br/>'.$row['F02b'].'</td>
            <td style="width: 75px;">'.$row['F08'].'<br/>'.$row['F09'].'</td>
            <td style="width: 55px;">'.$row['F07'].'</td>        
        </tr>';
    }

    // 如果是最後一頁，才加入總計列
    if ($p == ($pages - 1)) {
		$sq20="select * from a26 where F01='INT_002' "; 
         $sql7=@mysqli_query($link,$sq20);                        
        $list8=mysqli_fetch_assoc($sql7);  //紀錄參數  	
         $taxrate=intval($list8["F06"]);				
		$rateChgtotal=$total*$_GET['rate'];   //匯率換算
		$taxmoney=round($tax_isinside=='02'?($rateChgtotal-$rateChgtotal/(1+$taxrate/100)):(($_GET['taxType']=='1' && $_GET['invoiceType']=='31')?$rateChgtotal*$taxrate/100:0),0);		 
		$beforetax=($tax_isinside=='02'?($rateChgtotal-$taxmoney):$rateChgtotal);
		$aftertax=$beforetax+$taxmoney;	
		
        $html .= '
        <tr style="background-color: #fafafa; font-weight: bold;">
		    <td style="text-align:right;">新台幣銷售額：</td>
            <td style="text-align:right;">'.number_format($beforetax, 2).'</td>
			<td colspan="2"style="text-align:right;">稅額：</td>
            <td style="text-align:right;">'.number_format($_GET['taxType']=='1'?$taxmoney:0, 0).'</td>
            <td colspan="2" style="text-align:right;">總計金額：</td>
            <td colspan="2" style="text-align:right;">'.number_format($aftertax, 0).'</td> 
        </tr>';
    }

    $html .= '</tbody></table>';

    // 輸出當前頁面的 HTML
    $pdf->writeHTML($html, true, false, false, false, '');

    // 如果還有下一頁，則手動換頁
    if ($p < ($pages - 1)) {
        $pdf->AddPage();
    }
}

mysqli_close($link);
$pdf->Output($queryNo.'.pdf', 'I');