import styled from '@emotion/styled';

export const ColorTest = styled.div`
  display: block;
  content: '';
  width: 200px;
  height: 200px;
  background: ${props => props.theme.primaryColor};
`;

