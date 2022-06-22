import type { MouseEvent, CSSProperties } from 'react';
import { FC } from 'react';
import { useCopyToClipboard } from 'react-use';
import { message } from 'antd';
import Iconfont from './Iconfont';
import styled from '@emotion/styled';

interface CopyBtnProps {
  value: string;
  className?: string;
  mode?: string;
  succMsg?: string;
  errorMsg?: string;
  styles?: CSSProperties;
  width?: number;
  height?: number;
  color?: string;
}

const defaultProps: CopyBtnProps = {
  className: '',
  value: '',
  mode: 'icon',
  succMsg: '复制成功',
  errorMsg: '复制失败',
  styles: {},
  width: 16,
  height: 16,
  color: '#606266',
};

const StyleDiv = styled.div`
  cursor: pointer;
`;

const CopyBtn: FC<CopyBtnProps> = (props) => {
  const [, copyToClipboard] = useCopyToClipboard();

  function onClickHl(event?: MouseEvent) {
    event && event.preventDefault();
    const value = props.value.replace(/<br>|<br\/>|<br \/>/g, '\r\n');
    copyToClipboard(value);
    message.success('已复制： ' + value);
  }

  const content = props.children ? (
    <StyleDiv onClick={(event) => onClickHl(event)}>
      {props.children}
    </StyleDiv>
  ) : (
    <StyleDiv
      style={props.styles}
      onClick={(event) => onClickHl(event)}>
      {props.mode === 'icon' && (
        <Iconfont
          name={'icon-duplicates'}
          width={props.width}
          height={props.height}
          color={props.color}
        />
      )}
      {props.mode !== 'icon' && '复制'}
    </StyleDiv>
  );

  return <div className={props.className}>{content}</div>;
};

CopyBtn.defaultProps = defaultProps;

export default CopyBtn;
