import { Layout } from 'antd';
import { useState } from 'react';
import './AppLayout.css';
import Sidebar from './Sidebar';
import AppRoutes from '../routes/AppRoutes';

const { Content } = Layout;

const AppLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Layout className='layout'>
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <Layout className={isOpen ? 'open' : 'closed'}>
                <Content className='site-layout-background'>
                    <AppRoutes />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AppLayout;