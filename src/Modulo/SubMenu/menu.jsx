import React from "react";
import { Layout, Menu } from "antd";

const { Sider } = Layout;

const SubMenu = ({ collapsed, onSelectPage }) => {
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        onClick={({ key }) => onSelectPage(key)}
        items={[
          {
            key: "1",
            label: "SUB PROCESO",
          },
          {
            key: "2",
            label: "SUB PROCESO 2",
          },
        ]}
      />
    </Sider>
  );
};

export default SubMenu;
