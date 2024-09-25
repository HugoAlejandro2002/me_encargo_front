import "./App.css";
import { UserContextProvider } from "./context/userContext";
import AppLayout from "./layout/AppLayout";
import { ConfigProvider } from "antd";
import { HashRouter } from "react-router-dom";

export const App = () => {
  return (
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
  );
};

export default App;
