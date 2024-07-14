import './App.css';
import AppLayout from './layout/AppLayout';
import { ConfigProvider } from 'antd';
import { HashRouter } from 'react-router-dom';

export const App = () => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: '#8c30f5',
            algorithm: true,
          },
        },
      }}
    >
      <HashRouter>
        <AppLayout />
      </HashRouter>
    </ConfigProvider>
  );
}

export default App;
