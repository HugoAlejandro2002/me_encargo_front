import Layout, { Content } from 'antd/es/layout/layout';
import AppRoutes from '../routes/AppRoutes';
import Sidebar from './Sidebar';

const AppLayout = () => {
    return (
        <div>
            <Layout
                className='layout'
                style={{ minHeight: '100vh', width: '100vw', maxWidth: '100%' }}
            >
                <Sidebar />
                <Content>
                    <AppRoutes />
                </Content>
            </Layout>
        </div>
    );
};

export default AppLayout;
