<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                              //引用檔
 CREATE TABLE `k25` (
  `F00` int NOT NULL COMMENT '序號',
  `F01` varchar(2) NOT NULL COMMENT '發票類別',
  `F02` varchar(2) NOT NULL COMMENT '發票日',
  `F03` varchar(6) NOT NULL COMMENT '對象編號',
  `F04` varchar(8) NOT NULL COMMENT '統一編號',
  `F05` varchar(1) DEFAULT NULL COMMENT '是否經海關',
  `F06` varchar(20) DEFAULT NULL COMMENT '提報單號碼',
  `F07` varchar(10) NOT NULL COMMENT '發票號碼',
   `F08` decimal(14,2) NOT NULL COMMENT '銷售金額',
  `F09` varchar(1) NOT NULL COMMENT '課稅別',
  `F10` decimal(14,2) NOT NULL COMMENT '營業稅額',
  `F11` varchar(1) DEFAULT NULL COMMENT '可扣抵代號',
  `F12` decimal(14,2) NOT NULL COMMENT '發票總額',
  `F13` varchar(2) DEFAULT NULL COMMENT '過帳傳票類別',
  `F14` varchar(6) DEFAULT NULL COMMENT '部門代號',
  `F15` varchar(15) NOT NULL COMMENT '憑證單號',
  `F16` varchar(1) DEFAULT NULL COMMENT '狀態',
  `F17` varchar(10) DEFAULT NULL COMMENT '傳票號碼',
  `F18` varchar(2) DEFAULT NULL COMMENT '發票收發單位',
  `F19` varchar(10) NOT NULL COMMENT '業務人員編號',
  `F20` varchar(40) NOT NULL COMMENT '備註',
  `F21` varchar(4) NOT NULL COMMENT '幣別',
  `F22` decimal(11,5) NOT NULL COMMENT '匯率',
  `F23` decimal(15,3) NOT NULL COMMENT '外幣金額',
   `F24` varchar(20) NOT NULL COMMENT '最後異動',
  `F90` varchar(7) NOT NULL COMMENT '所屬年月'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

?>  

 