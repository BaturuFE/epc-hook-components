// 配件信息对象
import { CSSProperties } from 'react';

export type PartsItem = {
  type: number; // 行类型标记，区分表头行、配件行、注释行、空白行，暂时没用到
  actualPosition: string; // 对应旧接口的details[*].typeCode=position，表示实际位置，程序匹配用，不呈现给用户看
  displayPosition: string; // 对应旧接口的details[*].typeCode=showPosition，表示展示位置，呈现给用户看
  partsCode: string; // 与旧接口一致，表示配件编码
  standardPartsNames: string[]; // 对应旧接口的details[*].typeCode=btrPartsNames，表示标准名称
  epcPartsName: string; // 对应旧接口的details[*].typeCode=partsName，表示原厂名称
  quantity: string; // 对应旧接口的details[*].typeCode=quantity，表示数量
  remark: string; // 对应旧接口的details[*].typeCode=remark，表示备注
  priceOf4S: string; // 对应旧接口的details[*].typeCode=price，表示4S价格
  extendFields: Record<string, string>; // 新增字段，表示扩展字段，取代原有的details字段，用法：key对应原details[*].typeCode，value对应原details[*].value
  vinAvailable: number; // 与旧接口定义保持一致，表示是否适用于该VIN码；
}

export interface PartsTableData extends PartsItem {
  // 下标 过滤前设置
  dataIndex: string;
  // 是否有详情按钮
  operationAvailable: boolean;
}

export interface PartsListConfig {
  field: string;
  title: string;
  columnStyle?: CSSProperties;
  needPopover?: boolean;
  needCopy?: boolean;
}
