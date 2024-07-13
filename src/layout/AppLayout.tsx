import { Layout } from "antd"
import { Content } from "antd/es/layout/layout"
import AppRoutes from "../routes/AppRoutes"
function AppLayout() {
    return (
        <Layout>
            <Content>
                <div>welcum</div>
                <AppRoutes />
            </Content>
        </Layout>
    )
}
export default AppLayout