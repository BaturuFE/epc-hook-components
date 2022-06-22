import { FC } from 'react';
import styled from '@emotion/styled';
import defaultPng from '../assets/default.png';

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
export const GroupDataMissing: FC = () => {
  return (
    <StyledGroupDataMissing>
      <div className="image"/>
      <div className="msg">该图组不适用该VIN码</div>
    </StyledGroupDataMissing>
  )
};
