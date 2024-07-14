import { Layout } from 'antd';
import { useState } from 'react';
import './AppLayout.css';
import Sidebar from './Sidebar/Sidebar';
import AppRoutes from '../routes/AppRoutes';
import Header from './Header/Header';

const { Content, Sider } = Layout;

const AppLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Layout className="layout">
            <Sider trigger={null} collapsible collapsed={!isOpen}>
                <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            </Sider>
            <Layout>
                <Header />
                <Content className='site-layout-background'>
                    <AppRoutes />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AppLayout;
