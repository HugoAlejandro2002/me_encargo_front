import { ConfigProvider } from "antd";
import { App as AntdApp } from "antd";
import { HashRouter } from "react-router-dom";
import { UserContextProvider } from "./context/userContext";
import AppLayout from "./layout/AppLayout";
import "./App.css";

export const App = () => {
  return (
    <AntdApp>
      <UserContextProvider>
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: "#8c30f5",
                algorithm: true,
              },
            },
          }}
        >
          <HashRouter>
            <AppLayout />
          </HashRouter>
        </ConfigProvider>
      </UserContextProvider>
    </AntdApp>
  );
};

export default App;
