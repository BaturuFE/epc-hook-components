import { FC, MouseEventHandler, ReactNode } from 'react';
import styled from '@emotion/styled';
import { Dropdown, Menu, Popover, Table, Tooltip } from 'antd';
import cns from 'classnames';
import CopyBtn from './CopyBtn';
import Iconfont from './Iconfont';
import { PartsListOperation } from '@baturu/yitian-sdk';
import { first, isEmpty, size } from 'lodash';
import { ColumnsType, ColumnType } from 'antd/lib/table';
import defaultPng from '../assets/default.png';

// 配件信息对象
interface PartGenericFieldDTO {
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

interface PartsTableData {
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

const StyledGroupDataMissing = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 120px auto 0;
  .image {
    width: 236px;
    height: 236px;
    background: url(${defaultPng});
  }
  .msg {
    margin-top: 10px;
    color: #666;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
  }
`;

const GroupDataMissing: FC = () => {
  return (
    <StyledGroupDataMissing>
      <div className="image" />
      <div className="msg">该图组不适用该VIN码</div>
    </StyledGroupDataMissing>
  )
};

const StyledDetailItem = styled.div`
  .popover-field {
    min-width: 200px;
    max-width: 350px;
    max-height: 280px;
    padding: 0 10px;
    overflow-x: hidden;
    overflow-y: hidden;
    color: #666;
    line-height: 28px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .popover-field:hover {
    overflow-y: auto;
  }
  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    .value {
      // 零件号定死宽度
      width: 105px;
    }
  }
  .cell {
    .value {
      display: -webkit-box;
      min-height: 19px;
      max-height: 38px;
      overflow: hidden;
      line-height: 19px;
      white-space: break-spaces;
      text-overflow: ellipsis;
      word-wrap: break-word;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical; /* 控制在第几行进行加省略号 */
    }
    &.selected {
      max-height: none !important;
      white-space: normal !important;
      .value {
        display: block;
        max-height: none !important;
        white-space: normal !important;
      }
    }
  }
  .action {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 36px;
    height: 100%;
    padding-left: 2px;
  }
  .correction {
    margin-left: 2px;
    cursor: pointer;
  }
`;
const DetailItem: FC<PartGenericFieldDTO & {
  isSelected: boolean;
  onCorrectionClick: MouseEventHandler<HTMLSpanElement>;
}> = (props) => {
  const needPopover = props.typeCode === 'btrPartsNames';
  const hasActions = props.value && (props.needCopyValue || props.needErrorCorrection);
  return (
    <StyledDetailItem>
      <Popover
        trigger={needPopover ? 'hover' : 'none'}
        placement="bottom"
        content={
          <div className="popover-field" dangerouslySetInnerHTML={{ __html: props.value }}/>
        }
      >
        <div
          className={cns('cell', {
            'flex-row': hasActions,
            selected: props.isSelected,
          })}
        >
          <div className="value" dangerouslySetInnerHTML={{ __html: props.value }}/>
          {hasActions && (
            <div onClick={(e) => e.stopPropagation()} className="action">
              {props.needCopyValue && <CopyBtn value={props.value} width={16} height={16}/>}
              {props.needErrorCorrection && props.isSelected && (
                <Tooltip title="纠错">
                  <span className="correction" onClick={props.onCorrectionClick}>
                    <Iconfont width={16} height={16} name="icon-a-zu6326" color="#606266"/>
                  </span>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </Popover>
    </StyledDetailItem>
  );
};
const ActionButton = styled.div`
  display: inline-flex;
  height: 19px;
  margin-right: 10px;
  color: #39f;
  font-size: 14px;
  line-height: 19px;
  white-space: nowrap;
  cursor: pointer;

  &.disabled {
    color: #bfbfbf;
  }
`;
const ActionItem: FC<{
  operationAvailable?: boolean | null;
  onDetailClick: MouseEventHandler<HTMLDivElement>;
  partsListOperation: PartsListOperation[];
  onOperationCLick: (item: PartsListOperation) => void;
  isFromSDK: boolean;
  isPartsCodeAdded: boolean;
  allowCancelAddedParts: boolean;
  onAddPart: MouseEventHandler<HTMLDivElement>;
}> = (props) => {
  let extraOperations: ReactNode | null = null; // 自定义按钮
  if (!isEmpty(props.partsListOperation)) {
    // SDK 定义了额外的按钮功能
    // 如果只定义了两个按钮，那就直接显示，超过两个按钮的话，就只显示第一个按钮和一个"更多操作"按钮
    const isSizeExceed = size(props.partsListOperation) > 2;
    const headOperations = isSizeExceed
      ? props.partsListOperation.slice(0, 1)
      : props.partsListOperation;
    extraOperations = (
      <>
        {headOperations.map((item) => (
          <ActionButton key={item.name} onClick={() => props.onOperationCLick(item)}>
            {item.name}
          </ActionButton>
        ))}
        {isSizeExceed && (
          <Dropdown
            overlay={
              <Menu>
                {props.partsListOperation.slice(1).map((item) => (
                  <Menu.Item key={item.name} onClick={() => props.onOperationCLick(item)}>
                    {item.name}
                  </Menu.Item>
                ))}
              </Menu>
            }
            placement="bottomRight">
            <ActionButton>更多操作</ActionButton>
          </Dropdown>
        )}
      </>
    );
  }
  let buttonAdd: ReactNode | null = null;
  if (props.isFromSDK) {
    const textDel = props.allowCancelAddedParts ? '取消添加' : '已添加';
    buttonAdd = (
      <ActionButton
        className={cns({ disabled: props.isPartsCodeAdded && !props.allowCancelAddedParts })}
        onClick={props.onAddPart}
      >
        {props.isPartsCodeAdded ? '添加' : textDel}
      </ActionButton>
    );
  }
  console.log('operationAvailable', props.operationAvailable)
  return (
    <>
      {props.operationAvailable !== false && (
        <>
          <ActionButton onClick={props.onDetailClick}>详情</ActionButton>
        </>
      )}
      {extraOperations || buttonAdd}
    </>
  );
};
const StyledTable = styled<typeof Table<PartsTableData>>(Table)`
  .ant-table table {
    border: 1px solid #dcdfe6;
    border-collapse: collapse;
  }
  .ant-table-body {
    table {
      border-top: none;
    }
    .ant-table-row:hover .ant-table-cell {
      background: var(--primary-epc-table-select-bg);
    }
  }
  .ant-table-thead {
    .ant-table-cell:before {
      display: none;
    }
    th {
      color: #606266;
      background-color: #f5f5f5;
    }
  }
  .ant-table-row {
    &.selected {
      background: var(--primary-epc-table-select-bg);
      border: 2px solid var(--primary-epc-table-select-border);
      border-bottom: none;
      + .ant-table-row {
        border-top: 2px solid var(--primary-epc-table-select-border);
        &.selected {
          border-top: none;
          border-bottom: 2px solid var(--primary-epc-table-select-border);
        }
      }
    }
    &:last-child.selected {
      border-bottom: 2px solid var(--primary-epc-table-select-border);
    }
    &.red {
      color: #eb3341;
    }
  }
  .ant-table-cell {
    font-size: 14px;
    border: 1px solid #dcdfe6;
    border-top: none;
  }
`;
export const EpcTable: FC<{
  vinCode: string;
  tableGroupData: PartsTableData[];
  onRowClick: (row: PartsTableData) => void;
  activePosition: string;
  selectedIndexes: string[];
  enableFilter: boolean;
  isFromSDK: boolean;
  partsListOperation: PartsListOperation[];
  onCorrectionClick: (partsCode: string) => void;
  containerHeight: string;
  onDetailClick: (item: PartsTableData) => void;
  onAddPart: (part: PartsTableData) => void;
  onOperationClick: (item: PartsListOperation, part: PartsTableData) => void;
  addedPartsCodes: string[];
  allowCancelAddedParts: boolean;
}> = (props) => {
  const firstCols = first(props.tableGroupData)?.details;
  const columns: ColumnsType<PartsTableData> = !isEmpty(firstCols)
    ? firstCols!
      .concat({ type: '操作😄', typeCode: 'action' } as PartGenericFieldDTO)
      .map<ColumnType<PartsTableData>>((item) => ({
        title: item.type,
        dataIndex: item.typeCode,
        width:
          {
            showPosition: 82,
            quantity: 72,
            partsCode: 154,
            partsCodeField: 154,
            partsName: 200,
            btrPartsNames: 116,
          }[item.typeCode] || undefined,
        render(_, record) {
          const detail = record.details.find((d) => d.typeCode === item.typeCode);
          return (
            <>
              {item.typeCode === 'action' ? (
                <ActionItem
                  operationAvailable={record.operationAvailable}
                  onDetailClick={() => props.onDetailClick(record)}
                  partsListOperation={props.partsListOperation}
                  onOperationCLick={(op) => props.onOperationClick(op, record)}
                  isFromSDK={props.isFromSDK}
                  isPartsCodeAdded={props.addedPartsCodes.includes(record.partsCode)}
                  allowCancelAddedParts={props.allowCancelAddedParts}
                  onAddPart={() => props.onAddPart(record)}
                />
              ) : (
                <DetailItem
                  {...detail!}
                  isSelected={props.selectedIndexes.includes(record.dataIndex)}
                  onCorrectionClick={() => props.onCorrectionClick(record.partsCode)}
                />
              )}
            </>
          );
        },
      }))
    : [];
  const y = Number(props.containerHeight.replace(/px/g, '')) - 38;
  return (
    <>
      {isEmpty(props.tableGroupData) && <GroupDataMissing />}
      {!isEmpty(props.tableGroupData) && (
        <StyledTable
          size="small"
          tableLayout="fixed"
          scroll={{ y }}
          pagination={false}
          columns={columns}
          rowKey={row => row.dataIndex}
          rowClassName={row =>
            cns({
              selected: props.selectedIndexes.includes(row.dataIndex),
              red: !row.vinAvailable,
            })
          }
          onRow={row => ({
            'data-index': row.dataIndex,
            onClick: () => props.onRowClick(row),
          })}
          dataSource={props.tableGroupData} />
      )}
    </>
  );
};
