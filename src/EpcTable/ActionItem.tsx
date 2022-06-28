import styled from '@emotion/styled';
import { FC, MouseEventHandler, ReactNode } from 'react';
import { PartsListOperation } from '@baturu/yitian-sdk';
import { isEmpty, size } from 'lodash';
import { Dropdown, Menu } from 'antd';
import cns from 'classnames';

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

export const ActionItem: FC<{
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
        {props.isPartsCodeAdded ? textDel : '添加'}
      </ActionButton>
    );
  }
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
