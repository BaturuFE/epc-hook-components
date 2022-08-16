// 配件信息对象
import { CSSProperties } from 'react';

export interface PartGenericFieldDTO {
  // 前端展示的表头信息
  type: string;
  typeCode: string;
  // 前端展示的value信息
  value: string;
  valueDesc: string;
  // 值是否需要复制
  needCopyValue: boolean;
  // 	值是否需要纠错功能
  needErrorCorrection: boolean;
  // 当 hidden 为 true 才隐藏
  hidden?: boolean | null;
}

export interface PartsTableData {
  // 下标 过滤前设置
  dataIndex: string;
  // 坐标
  position: string;
  //	配件编码
  partsCode: string;
  // 是否适合该Vin
  vinAvailable: number;
  operationAvailable: boolean | null;
  // 配件信息集合
  details: PartGenericFieldDTO[];
}

export interface PartsListConfig {
  field: string;
  title: string;
  headerStyle?: CSSProperties;
  columnStyle?: CSSProperties;
}
