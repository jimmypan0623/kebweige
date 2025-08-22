<?php
// Include the main TCPDF library (search for installation path).

require_once('../../tcpdf/tcpdf.php');

$msgsend=$_GET['queryNo'];
// Extend the TCPDF class to create custom Header and Footer
// 自訂頁首與頁尾
class MYPDF extends TCPDF {
	//Page header
	
	public function Header() {
		// Set font
        $this->SetFont('msungstdlight', '', 10);
         // 公司與報表名稱
		
        $title = '

<h4 style="font-size: 20pt; font-weight: normal; text-align: center;">'.$_GET['ourCompany'].'</h4>		
<h6 style="font-size: 12pt; font-weight: normal; text-align: center;">TEL:'.$_COOKIE['INT_078'].'</h6>		

<table>
    <tr>
        <td style="width: 30%;"></td>
        <td style="font-size: 16pt; font-weight: normal; text-align: center; width: 40%;">報價單 QUOTATION</td>
        <td style="width: 30%;"></td>
    </tr>
	   
    
</table>';


        /**
         * 標題欄位
         *
         * 所有欄位的 width 設定值均與「資料欄位」互相對應，除第一個 <td> width 須向左偏移 5px，才能讓後續所有「標題欄位」與「資料欄位」切齊
         * 最後一個 <td> 必須設定 width: auto;，才能將剩餘寬度拉至最寬
         * style 屬性可使用 text-align: left|center|right; 來設定文字水平對齊方式
         */

        $fields ='
<table cellpadding="1" border="1px">
    <tr>
        <td style="width: 114px;text-align:center;">料品編號</td>
        <td style="width: 105px;text-align:center;">品名規格</td>
		<td style="width: 30px;text-align:center;">單位</td>
        <td style="width: 55px;text-align:right;">報價數量</td>
        <td style="width: 55px;text-align:right;">單價</td>
        <td style="width: 55px;text-align:right;">小計</td>
        <td style="width: 100px;text-align:center;">客戶品號</td>
        <td style="width: 55px;text-align:right;">包裝基量</td> 		
		<td style="width: 55px;text-align:right;">最少下單</td> 
        <td style="width: 55px;text-align:center;">前置天數</td> 	
		<td style="width: 65px;text-align:center;">價格有效期</td> 	
    </tr>
    </table>';
$html='';
$prntmsg='';
// 設定不同頁要顯示的內容 (數值為對應的頁數)
        switch ($this->getPage()) {
            case '1':
                // 設定資料與頁面上方的間距 (依需求調整第二個參數即可)
                $this->SetMargins(1, 50, 1);

                // 增加列印日期的資訊
                $html = $title . '
                <table cellpadding="1" style="table-layout:fixed;">    
                <tr>
	            <td style="width:20%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;" colspan=2>To:'.$_GET['windowMan'].'</td>
		        <td style="width:30%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">'.$_GET['customNo'].'</td>	    
		        <td style="width:15%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">業務擔當:'.$_GET['salesMan'].'</td>		
                <td style="width:35%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">報價單號:'.$_GET['queryNo'].'</td>                       
                </tr>
                <tr>
				<td style="width:20%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">付款方式:'.$_GET['payMent'].'</td>	                	
		        <td style="width:30%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">交貨方式:'.$_GET['shipWay'].'</td>	
		        <td style="width:15%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">幣別:'.$_GET['curNcy'].'</td>
		        <td style="width:35%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">備註:'.$_GET['reMark'].'</td>         
                </tr>
                </table>'.$fields. $prntmsg;
                break;
               // 其它頁
               default:
                $this->SetMargins(1, 40, 1);
                $html = $title . $fields;
        }
        
		// Title
        $this->writeHTMLCell(0, 0, '', '', $html, 0, 1, 0, true, '', true);
	}

	// Page footer
	public function Footer() {
		// Position at 15 mm from bottom
		$this->SetY(-15);
		// Set font
		$this->SetFont('helvetica', 'I', 8);
		// Page number
		$this->Cell(0, 10, 'Page '.$this->getAliasNumPage().'/'.$this->getAliasNbPages(), 0, false, 'R', 0, '', 0, false, 'T', 'M');
	}
}

// create new PDF document
$pdf = new MYPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
// set document information
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Nicola Asuni');
$pdf->SetTitle('知訊數位營運系統 - 報價單');
$pdf->SetSubject('TCPDF Tutorial');
$pdf->SetKeywords('TCPDF, PDF, example, test, guide');

// set default header data
$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' 001', PDF_HEADER_STRING, array(0,64,255), array(0,64,128));
$pdf->setFooterData(array(0,64,0), array(0,64,128));

// set header and footer fonts
$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
// 版面配置 > 邊界
// $pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetMargins(1, 1, 1);

// 頁首上方與頁面頂端的距離
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
// 頁尾上方與頁面底端的距離
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

// set auto page breaks
// 自動分頁
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

// set some language-dependent strings (optional)
if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
	require_once(dirname(__FILE__).'/lang/eng.php');
	$pdf->setLanguageArray($l);
}

// ---------------------------------------------------------

// set default font subsetting mode
$pdf->setFontSubsetting(true);

// Set font
// dejavusans is a UTF-8 Unicode font, if you only need to
// print standard ASCII chars, you can use core fonts like
// helvetica or times to reduce file size.
// $pdf->SetFont('dejavusans', '', 14, '', true);
// 中文字體名稱, 樣式 (B 粗, I 斜, U 底線, D 刪除線, O 上方線), 字型大小 (預設 12pt), 字型檔, 使用文字子集 
$pdf->SetFont('msungstdlight', '', 10);
// Add a page
// This method has several options, check the source code documentation for more information.
// 版面配置：P 直向 | L 橫向, 紙張大小 (必須大寫字母)
$pdf->AddPage('P', 'LETTER');

// set text shadow effect
// 文字陰影
// $pdf->setTextShadow(array('enabled'=>true, 'depth_w'=>0.2, 'depth_h'=>0.2, 'color'=>array(196,196,196), 'opacity'=>1, 'blend_mode'=>'Normal'));

// Set some content to print
// $html = <<<EOD
// <h1>Welcome to <a href="http://www.tcpdf.org" style="text-decoration:none;background-color:#CC0000;color:black;"> <span style="color:black;">TC</span><span style="color:white;">PDF</span> </a>!</h1>
// <i>This is the first example of TCPDF library.</i>
// <p>This text is printed using the <i>writeHTMLCell()</i> method but you can also use: <i>Multicell(), writeHTML(), Write(), Cell() and Text()</i>.</p>
// <p>Please check the source code documentation and other examples for further information.</p>
// <p style="color:#CC0000;">TO IMPROVE AND EXPAND TCPDF I NEED YOUR SUPPORT, PLEASE <a href="http://sourceforge.net/donate/index.php?group_id=128076">MAKE A DONATION!</a></p>
// EOD;
   $hostname='localhost';    //$_COOKIE["INT_PTH"]
 $dbc = @mysqli_connect($hostname,$_COOKIE["INT_ADM"],$_COOKIE["INT_PSS"],$_COOKIE["INT_DAT"]);
 mysqli_query($dbc,'set names utf8'); 

 $sql3="select c27.*,b01.F02 as F0B,b01.F04 as F0D,b01.F28+b01.F31 as F2A from c27 left outer join b01 on c27.F02=b01.F01 where c27.F01='".$_GET['queryNo']."' order by c27.F02"; 
  
   $sql4=@mysqli_query($dbc,$sql3); 
    $html ='';
	while ($list3=mysqli_fetch_array($sql4)){
		 

       
    /**
     * 資料欄位
     *
     * 所有欄位的 width 設定值均與「標題欄位」互相對應，除第一個 <td> width 須 -5px
     * 最後一個 <td> 必須設定 width: auto;，才能將剩餘寬度拉至最寬
     * style 屬性可使用 text-align: left|center|right; 來設定文字水平對齊方式
     */
   
    $html .= '
        <tr>
            <td style="line-height: 1.5; width: 110px;">' .$list3['F02'] . '</td>
            <td style="line-height: 1.5; width: 105px;">' .$list3['F0B']. '</td>
			<td style="line-height: 1.5; width: 30px;">' .$list3['F0D']. '</td>
            <td style="line-height: 1.5; width: 55px;text-align:right;">'.$list3['F03'].'</td>
            <td style="line-height: 1.5; width: 55px;text-align:right;">'.$list3['F04'].'</td>
            <td style="line-height: 1.5; width: 55px;text-align:right;">'.($list3['F03']*$list3['F04']).'</td>
            <td style="line-height: 1.5; width: 100px;text-align:center;">'.$list3['F05'].'</td>
            <td style="line-height: 1.5; width: 55px;text-align:right;">'.$list3['F06'].'</td>	
			<td style="line-height: 1.5; width: 55px;text-align:right;">'.$list3['F07'].'</td>
			<td style="line-height: 1.5; width: 55px;text-align:right;">'.$list3['F2A'].'</td>
			<td style="line-height: 1.5; width: 65px;text-align:right;">'.$list3['F15'].$list3['F17'].'</td>
        </tr>';
}
 mysqli_close($dbc);	
$html ='
<table cellpadding="1" border="1px">' . $html .'</table>';

$pdf->writeHTMLCell(0, 0, '', '', $html,0, 1, 0, true, '', true);

// ---------------------------------------------------------

// Close and output PDF document
// This method has several options, check the source code documentation for more information.
// 下載 PDF 的檔案名稱 (不可取中文名，即使有也會自動省略中文名)
$pdf->Output($msgsend.'.pdf', 'I');

