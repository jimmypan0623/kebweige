<?php
 ET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
 CREATE TABLE `d11` (
  `F00` int NOT NULL COMMENT '序號',
  `F01` varchar(2) NOT NULL COMMENT '日期',
  `F02` varchar(6) NOT NULL COMMENT '廠商編號',
  `F03` varchar(43) NOT NULL COMMENT '料品編號',
  `F04` varchar(10) NOT NULL COMMENT '單據編號',
  `F05` varchar(10) NOT NULL COMMENT '採購單號',
  `F06` varchar(4) NOT NULL COMMENT '幣別',
  `F07` decimal(11,3) NOT NULL DEFAULT '0.000' COMMENT '單價',
  `F08` int NOT NULL DEFAULT '0' COMMENT '進貨數量',
  `F09` decimal(11,4) NOT NULL DEFAULT '0.0000' COMMENT '匯率',
  `F10` varchar(10) NOT NULL COMMENT '採購編號',
  `F16` varchar(25) NOT NULL COMMENT '需求用途',
  `F17` varchar(30) NOT NULL COMMENT '廠商品號',
  `F19` varchar(20) NOT NULL COMMENT '最後異動',
  `F90` varchar(7) NOT NULL COMMENT '所屬年月'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

?>  

 