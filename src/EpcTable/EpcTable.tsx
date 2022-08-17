import { FC, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { Table } from 'antd';
import cns from 'classnames';
import { PartsListOperation } from '@baturu/yitian-sdk';
import { assign, isEmpty, omit } from 'lodash';
import { ColumnsType, ColumnType } from 'antd/lib/table';
import { GroupDataMissing } from './GroupDataMissing';
import { DetailItem } from './DetailItem';
import { PartsListConfig, PartsTableData } from '../types/data';
import { ActionItem } from './ActionItem';
import { useAsync } from 'react-use';

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
      font-weight: bold;
    }
  }
  .ant-table-row {
    box-sizing: border-box;
    width: 100%;
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
  partsListConfigs: PartsListConfig[];
  onDetailClick: (item: PartsTableData) => void;
  onAddPart: (part: PartsTableData) => void;
  onOperationClick: (item: PartsListOperation, part: PartsTableData) => void;
  addedPartsCodes: string[];
  allowCancelAddedParts: boolean;
}> = (props) => {
  const columns: ColumnsType<PartsTableData> = !isEmpty(props.partsListConfigs)
    ? props.partsListConfigs
      .concat({ field: 'action', title: '操作', headerStyle: { width: 150 } })
      .map<ColumnType<PartsTableData>>(conf => ({
        title: conf.title,
        dataIndex: conf.field,
        align: conf.field === 'action' ? 'left' : 'center',
        width: conf.headerStyle?.width || conf.columnStyle?.width,
        onHeaderCell() {
          return { style: omit(assign({}, conf.columnStyle, conf.headerStyle), 'width') }
        },
        onCell() {
          return { style: omit(conf.columnStyle, 'width') };
        },
        render(_, record) {
          const detail = record.details.find((d) => d.typeCode === conf.field);
          return (
            <>
              {conf.field === 'action' ? (
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

  const x = useMemo(() => columns
    .reduce((sum, conf) => sum + parseInt(conf.width as string, 10) || 0, 0),
    [columns]);
  const [y, setY] = useState(Number(props.containerHeight.replace(/px/g, '')) - 38);
  useAsync(async () => { // 福特车型的表头文字可能会换行，导致高度增加，所以这里动态计算一下表头高度
    await Promise.resolve(); // 这里的目标是要实现类似于 Vue.nextTick 的效果
    const header = document.querySelector<HTMLDivElement>('.epc-table .ant-table-header');
    const headerHeight = header?.offsetHeight || 38;
    setY(Number(props.containerHeight.replace(/px/g, '')) - headerHeight);
  }, [props.partsListConfigs]);

  return (
    <>
      {isEmpty(props.tableGroupData) && <GroupDataMissing />}
      {!isEmpty(props.tableGroupData) && (
        <StyledTable
          size="small"
          tableLayout="fixed"
          className="epc-table"
          scroll={{ x, y }}
          pagination={false}
          columns={columns}
          rowKey={row => row.dataIndex}
          rowClassName={row => cns({
            selected: props.selectedIndexes.includes(row.dataIndex),
            red: !row.vinAvailable,
          })}
          onRow={row => ({
            'data-index': row.dataIndex,
            onClick: () => props.onRowClick(row),
          })}
          dataSource={props.tableGroupData} />
      )}
    </>
  );
};
