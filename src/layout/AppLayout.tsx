import { Layout } from "antd";
import { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import { Outlet } from "react-router-dom";

const { Content, Sider } = Layout;

const AppLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Layout className="flex min-h-screen w-full">
      <Sider trigger={null} collapsible collapsed={!isOpen}>
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      </Sider>
      <Layout>
        <Header />
        <Content className="flex flex-col bg-white p-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
