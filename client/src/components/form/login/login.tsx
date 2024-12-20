import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Typography,
  Avatar,
  Watermark,
} from "antd";
import {
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { jwtDecode } from "jwt-decode";
import { signin } from "../../../redux/action/auth";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

const initialState = {
  email: "",
  password: "",
};

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);

  const { t, i18n } = useTranslation();

  const token = localStorage.getItem("user");

  useEffect(() => {
    if (token) {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken.exp * 1000 > new Date().getTime()) {
        navigate("/admin");
      }
    }
  }, [dispatch, navigate, token]);

  const handleSubmit = async (values: any) => {
    const response = await dispatch(signin(values) as any);

    if (response?.payload?.message) {
      message.success(`${response?.payload?.message}`);
      navigate("/admin");
    } else if (response?.error) {
      if (response.payload.includes(":")) {
        message.error(`${response.payload.split(":")[1]?.trim()}`);
      } else {
        message.error(response.payload); // or handle it another way if `:` is not present
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #e2e2e2, #c9d6ff)",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "40px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Avatar
            style={{ backgroundColor: "#1890ff", marginBottom: "10px" }}
            icon={<LockOutlined />}
          />
          <Title level={3}>{t("Sign In")}</Title>
        </div>

        <Form
          name="login"
          onFinish={handleSubmit}
          initialValues={formData}
          layout="vertical"
        >
          {/* Email Field */}
          <Form.Item
            label={t("Email Address")}
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not a valid email address!",
              },
              {
                required: true,
                message: t("Please enter your email!"),
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder={t("Email")}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label={t("Password")}
            name="password"
            rules={[
              {
                required: true,
                message: t("Please enter your password!"),
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t("Password")}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Link to="/forgot-password" style={{ color: "#1890ff" }}>
              {t("Forgot password?")}
            </Link>
          </div>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t("Sign In")}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <Typography.Text>
            {t("Don't have an account?")}{" "}
            <Link to="/register">{t("Sign Up")}</Link>
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default Login;
