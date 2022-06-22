import { FC } from 'react';
import styled from '@emotion/styled';
import { Table } from 'antd';
import cns from 'classnames';
import { PartsListOperation } from '@baturu/yitian-sdk';
import { first, isEmpty } from 'lodash';
import { ColumnsType, ColumnType } from 'antd/lib/table';
import { GroupDataMissing } from './GroupDataMissing';
import { DetailItem } from './DetailItem';
import { PartGenericFieldDTO, PartsTableData } from '../types/data';
import { ActionItem } from './ActionItem';

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
