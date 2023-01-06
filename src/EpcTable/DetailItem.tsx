import styled from '@emotion/styled';
import { FC, MouseEventHandler } from 'react';
import { Popover } from 'antd';
import cns from 'classnames';
import CopyBtn from './CopyBtn';
import { PartGenericFieldDTO, PartsListConfig, PartsTableData } from '../types/data';

export const StyledDetailItem = styled.div`
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
    justify-content: space-between;
    .value {
      flex: 1;
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
    width: 18px;
    height: 100%;
    padding-left: 2px;
  }
`;

export const DetailItem: FC<PartsTableData & PartsListConfig & {
  isSelected: boolean;
}> = (props) => {
  const fieldValue = props[props.field as keyof PartsTableData] || props.extendFields[props.field];
  const __html = Array.isArray(fieldValue) ? fieldValue.join('<br />') : fieldValue as string;
  const hasCopyButton = __html && props.needCopy;
  return (
    <StyledDetailItem>
      <Popover
        trigger={props.needPopover ? 'hover' : 'none'}
        placement="bottom"
        content={
          <div className="popover-field" dangerouslySetInnerHTML={{ __html }}/>
        }>
        <div
          className={cns('cell', {
            'flex-row': hasCopyButton,
            selected: props.isSelected,
          })}>
          <div className="value" dangerouslySetInnerHTML={{ __html }}/>
          {hasCopyButton && (
            <div onClick={(e) => e.stopPropagation()} className="action">
              <CopyBtn value={__html} width={16} height={16} />
            </div>
          )}
        </div>
      </Popover>
    </StyledDetailItem>
  );
};
