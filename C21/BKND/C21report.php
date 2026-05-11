<?php
// 啟動緩衝，防止非預期輸出導致 PDF 損壞
ob_start(); 
require_once('../../tcpdf/tcpdf.php');

// --- 1. 安全性檢查與變數初始化 ---
$queryNo = filter_input(INPUT_GET, 'queryNo', FILTER_SANITIZE_STRING);

// --- 2. 擴充 TCPDF 類別 ---
class MYPDF extends TCPDF {
    // 關鍵：定義屬性來存放從外部傳入的資料
    public $customData = [];
    
    public function Header() {
        $this->SetFont('msungstdlight', '', 10);                
        
        // 1. 公司抬頭與報表名稱
        $headerHtml = '
        <div style="text-align: center;">
            <span style="font-size: 18pt;">' . ($this->customData['ourCompany'] ?? '') . '</span><br />
            <span style="font-size: 12pt;">TEL: ' . ($_COOKIE['INT_078'] ?? '') . '</span>
        </div>
        <table border="0" width="100%">
            <tr>
                <td style="width:70%; text-align: right; font-size: 16pt; font-weight: bold;">報價單 QUOTATION</td>
                <td style="width:30%; text-align: right; font-size: 8pt;">頁次: '.$this->getAliasNumPage().'/'.$this->getAliasNbPages().'</td>
            </tr>
        </table>';
        
        // 2. 報價單基本資訊 (僅第一頁顯示)
        $infoTable = '';
        if ($this->getPage() == 1) {
            $infoTable = '
            <table cellpadding="1" style="font-size: 10pt;">
                <tr>
                    <td style="width:75%;">To: '.($this->customData['windowMan'] ?? '').' ('.($this->customData['customNo'] ?? '').' '.($this->customData['customName'] ?? '').')</td>
                    <td style="width:25%; text-align:right;">報價單號: '.($this->customData['queryNo'] ?? '').'</td>
                </tr>
                <tr>
                    <td style="width:75%;">業務擔當: '.($this->customData['salesMan'] ?? '').'&nbsp; 幣別: '.($this->customData['curNcy'] ?? '').'&nbsp; '.($this->customData['curNname'] ?? '').'&nbsp;&nbsp;&nbsp;&nbsp;付款方式: '.($this->customData['payMent'] ?? '').'</td>
                    <td style="width:25%; text-align:right;">報價日期: '.($this->customData['quotationDate'] ?? '').'</td>
                </tr>
                <tr>
                    <td style="width:50%;">交貨方式: '.($this->customData['shipWay'] ?? '').'</td>
                    <td style="width:50%; text-align:right;">備註: '.($this->customData['reMark'] ?? '').'</td> 
                </tr>
            </table>';
        }

        // 3. 表頭欄位列 (每一頁都要有)
        $fields = '
        <table cellpadding="3" border="1" style="background-color: #f2f2f2; font-size: 9pt; text-align: center; font-weight: bold;">
            <tr>
                <td style="width: 80px;">料品編號</td>
                <td style="width: 90px;">品名規格</td>
                <td style="width: 28px;">單位</td>
                <td style="width: 45px;">數量</td>
                <td style="width: 45px;">單價</td>
                <td style="width: 50px;">小計</td>
                <td style="width: 70px;">客戶品號</td>
                <td style="width: 40px;">包裝</td>          
                <td style="width: 40px;">MOQ</td> 
                <td style="width: 35px;">LT</td>   
                <td style="width: 50px;">有效期</td>   
            </tr>
        </table>';

        $this->writeHTML($headerHtml . $infoTable . $fields, true, false, false, false, '');
    }

    public function Footer() {
		$this->SetY(-20);
		$this->SetFont('msungstdlight', '', 10); 
		
		// 1. 畫出「客戶確認」
		$this->Cell(40, 10, '客戶確認:', 0, 0, 'L'); 
		
		// 2. 記錄目前「審核」文字的起始 X 座標
		$auditX = $this->GetX(); 
		$this->SetX($auditX + 20); 
		$this->Cell(60, 10, '審核:', 0, 0, 'L'); 

		// 3. 簽核章判斷
		$confirmStatus = strtoupper(trim($this->customData['isConfirm'] ?? ''));
		if ($confirmStatus == 'Y') {
			/**
			 * 座標解析：
			 * X: $auditX 是「審核」二字的左側起點。
			 * '審核:' 這四個字元大約佔寬度 12-15mm。
			 * 所以 $auditX + 12 會剛好蓋在「審核:」之後。
			 * Y: $this->GetY() - 2 稍微往上提，讓印章中心對齊文字。
			 */
			$this->Image('../../digits/approve.gif', $auditX + 32, $this->GetY() - 1, 12, 12, 'GIF');             
		}

		// 4. 移動到「開單」位置
		// 因為前面「審核」Cell 寬度是 40，所以 $auditX + 40 就是下一個欄位的起點
		$this->SetX($auditX + 80); 
		$this->Cell(80, 10, '開單：' .($this->customData['username']  ?? ''), 0, 0, 'L');  //
	}
}

// --- 3. 初始化 PDF 與注入資料 ---
$pdf = new MYPDF('P', 'mm', 'A4', true, 'UTF-8', false);

// 關鍵優化：將所有 GET 參數存入物件，Header 與 Footer 才能存取
$pdf->customData = $_GET; 

$pdf->SetMargins(5, 46, 5); 
$pdf->SetHeaderMargin(5);
$pdf->SetFooterMargin(10);
$pdf->SetAutoPageBreak(TRUE, 25);
$pdf->AddPage();

// --- 4. 資料庫處理 ---
require_once("../../include/BKND/db_forreport.php");

$sql0="select * from a01 where F01="."'".$_COOKIE['useraccount']."'"; 
     $sql1=@mysqli_query($link,$sql0);
     $rows1=@mysqli_num_rows($sql1);                       
     $list4=mysqli_fetch_assoc($sql1);  //紀錄當前操作者姓名   
	 
$sql = "SELECT c27.*, b01.F02 as F0B, b01.F04 as F0D, (b01.F28 + b01.F31) as F2A 
        FROM c27 
        LEFT OUTER JOIN b01 ON c27.F02 = b01.F01 
        WHERE c27.F01 = ? 
        ORDER BY c27.F02";

$stmt = mysqli_prepare($link, $sql);
mysqli_stmt_bind_param($stmt, "s", $_GET['queryNo']);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$tbody = '';
$grandTotal = 0;

while ($row = mysqli_fetch_assoc($result)) {
    $subtotal = $row['F03'] * $row['F04'];
    $grandTotal += $subtotal;
    
    // 修正：HTML 模式下換行需使用 <br />
    $validDate = $row['F15'] . '<br />' . $row['F17'];
    
    $tbody .= '
    <tr>
        <td style="width: 80px;">'.$row['F02'].'</td>
        <td style="width: 90px;">'.$row['F0B'].'</td>
        <td style="width: 28px; text-align:center;">'.$row['F0D'].'</td>
        <td style="width: 45px; text-align:right;">'.number_format($row['F03']).'</td>
        <td style="width: 45px; text-align:right;">'.number_format($row['F04'], 2).'</td>
        <td style="width: 50px; text-align:right;">'.number_format($subtotal, 2).'</td>
        <td style="width: 70px;">'.$row['F05'].'</td>
        <td style="width: 40px; text-align:right;">'.$row['F06'].'</td>   
        <td style="width: 40px; text-align:right;">'.$row['F07'].'</td>
        <td style="width: 35px; text-align:center;">'.$row['F2A'].'天</td>
        <td style="width: 50px; text-align:center; ">'.$validDate.'</td>       
    </tr>';
}

// --- 5. 輸出內容 ---    
$pdf->SetFont('msungstdlight', '', 9); 

$tableHtml = '
<table cellpadding="3" border="0.5" style="border-top:none;">
    <tbody>' . $tbody . '</tbody>
    <tr style="background-color: #fafafa; font-weight: bold;">
        <td colspan="5" style="text-align:right;">總計 TOTAL:</td>
        <td style="text-align:right;">'.number_format($grandTotal, 2).'</td>
        <td colspan="5"></td>
    </tr>
</table>'; 

$pdf->writeHTML($tableHtml, true, false, false, false, '');

mysqli_close($link);

// 清除緩衝並輸出 PDF
ob_end_clean();
$pdf->Output($queryNo.'.pdf', 'I');