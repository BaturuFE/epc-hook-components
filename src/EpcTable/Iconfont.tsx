import { FC } from 'react';
import styled from '@emotion/styled';

interface IconfontProps {
  name: string;
  className?: string;
  width?: number;
  height?: number;
  color?: string;
  onClick?: (e?: any) => void | undefined;
}

const StyledIconfont = styled.svg`
  width: 22px;
  height: 22px;
  overflow: hidden;
  vertical-align: -4px;
  fill: currentColor;
  -webkit-font-smoothing: antialiased;
`;

const Iconfont: FC<IconfontProps> = ({
  name,
  className = '',
  width = undefined,
  height = undefined,
  color = undefined,
  onClick = undefined,
}) => {
  const iconStyle = { width, height, color };
  return (
    <StyledIconfont
      className={className}
      aria-hidden="true"
      style={iconStyle}
      onClick={onClick}
    >
      <use xlinkHref={`#${name}`} />
    </StyledIconfont>
  );
};

export default Iconfont;
