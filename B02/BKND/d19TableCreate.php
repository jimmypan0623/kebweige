<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                              //引用檔
 CREATE TABLE `d19` (
  `F00` int NOT NULL COMMENT '序號',
  `F01` date NOT NULL COMMENT '交易日期',
  `F02` varchar(10) NOT NULL COMMENT '進貨單號',
  `F03` varchar(6) NOT NULL COMMENT '廠商編號',
  `F04` varchar(10) NOT NULL COMMENT '採購單號',
  `F05` varchar(43) NOT NULL COMMENT '料品編號',
  `F06` int NOT NULL COMMENT '進貨數量',
  `F07` decimal(11,3) NOT NULL COMMENT '單價',
  `F09` varchar(1) NOT NULL COMMENT '''0'' 現結 ''1''月結',
  `F10` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT '傳票號碼',
  `F12` varchar(20) NOT NULL COMMENT '最後異動',
  `F13` varchar(4) NOT NULL COMMENT '幣別',
  `F14` decimal(11,5) NOT NULL COMMENT '匯率',
  `F15` varchar(100) NOT NULL COMMENT '備註',
  `F16` varchar(2) NOT NULL COMMENT '''02''表示稅內含(二聯式應稅)',
  `F17` varchar(10) DEFAULT NULL COMMENT '發票號碼',
  `F18` varchar(2) DEFAULT NULL COMMENT ''' ''表示退貨 ''03''表示折讓',
  `F19` varchar(10) NOT NULL COMMENT '採購人員編號',
  `F90` varchar(7) NOT NULL COMMENT '所屬年月'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

?>  

 