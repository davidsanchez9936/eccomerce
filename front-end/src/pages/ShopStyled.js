/* ShopStyled.jsx */
import styled from "styled-components";
import { Menu } from "antd";


export const StyledMenu = styled(Menu)`
.ant-menu-item,
.ant-menu-item-selected,
.ant-menu-item-only-child {
  min-height: 18vh;
}

.brand-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px;
}

.brand-radio {
  margin: 5px;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &.ant-radio-wrapper-checked {
    border-color: #1890ff;
    color: #1890ff;
  }

  &:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
}
`;