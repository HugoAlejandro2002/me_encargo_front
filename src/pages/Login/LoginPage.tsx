import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";

const LoginPage = () => {
  const handleFinish = (values: any) => {
    console.log("Received values:", values);
    message.success("¡Inicio de sesión exitoso!");
  };

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#fff",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <img
          alt="logo"
          src="/src/assets/logo.png"
          style={{ height: "48px", marginBottom: "16px" }}
        />
        <h2 className="font-bold">Me encargo</h2>
      </div>
      <Form
        name="login"
        initialValues={{ autoLogin: true }}
        onFinish={handleFinish}
      >
        <>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "¡Por favor ingrese su nombre de usuario!",
              },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="Nombre de usuario: admin o user"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "¡Por favor ingrese su contraseña!",
              },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Contraseña: ant.design"
            />
          </Form.Item>
        </>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>
            Iniciar sesión
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
