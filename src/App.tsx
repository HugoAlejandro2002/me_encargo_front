import './App.css';
import AppLayout from './layout/AppLayout';
import { ConfigProvider } from 'antd';
import { HashRouter } from 'react-router-dom';

function App() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: '#8c30f5',
            algorithm: true, // Enable algorithm
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

