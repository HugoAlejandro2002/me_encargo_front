import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { checkLogin, getUserByCookie } from "../../api/user";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { useContext } from "react";

const LoginPage = () => {
  const { setUser } = useContext(UserContext)!;
  const navigate = useNavigate();
  const handleFinish = async (values: any) => {
    try {
      await checkLogin(values);
      const user = await getUserByCookie();
      setUser(user);
      message.success("¡Inicio de sesión exitoso!");
      navigate("/product");
    } catch (error) {
      message.error("Error al iniciar sesión");
      console.error(error);
    }
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
            name="email"
            rules={[
              {
                required: true,
                message: "¡Por favor ingrese su email!",
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
