import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Badge,
  Dropdown,
  Typography,
  // notification,
  Button,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  NotificationOutlined,
  //  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../../../constant/actionType";
import { jwtDecode } from "jwt-decode";
import { getUserById } from "../../../redux/action/user";
import Profile from "./profile";
import Student from "./student";
import Course from "./course";
import AddCourse from "./addCourse";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  //const [isServeysOpen, setIsServeysOpen] = useState(false);
  const [selectedAddCourse, setSelectedAddCourse] = useState(false);
  //const [selectedDetail, setSelectedDetail] = useState(null);
  //const [selectedAddCompany, setSelectedAddCompany] = useState(null);
  //const [selectedAddQuestion, setSelectedAddQuestion] = useState(null);
  //const [selectedEditQuestion, setSelectedEditQuestion] = useState(null);
  //const [feedbackDetail, setFeedbackDetail] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("user");

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    await dispatch({ type: LOGOUT });
    localStorage.removeItem("user");
    //notification.warning({ message: "You are logged out" });
    navigate("/");
  };

  const user = useSelector((state: any) => state.user?.user?.newUser);
  console.log("User: ", user);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    if (token) {
      const decodedToken: any = jwtDecode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) {
        handleLogout();
      }
      dispatch(getUserById(decodedToken.id) as any);
    }
  }, [dispatch, navigate, token]);

  const onUpdate = async () => {
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const data = await dispatch(getUserById(decodedToken.id) as any);
      return data;
    }
    return;
  };

  const handleMenuItemClick = (item: any) => {
    setSelectedItem(item);
    setSelectedAddCourse(false);
  };
  const handleAddCourse = () => {
    setSelectedAddCourse(true);
  };

  const handleCancel = () => {
    setSelectedAddCourse(false);
  };

  const menu = (
    <Menu onClick={({ key }) => handleMenuItemClick(key)}>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      {/* <Menu.Item key="setting" icon={<SettingOutlined />}>
        Settings
      </Menu.Item> */}
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        theme="light"
        style={{ position: "fixed", height: "100vh", left: 0, top: 0 }}
      >
        <div className="logo" style={{ padding: "16px", textAlign: "center" }}>
          <Avatar src="" />
          <Title level={5}>ፎርሲዝን</Title>
        </div>

        <Menu
          //theme="light"
          defaultSelectedKeys={["Dashboard"]}
          mode="inline"
          onClick={({ key }) => handleMenuItemClick(key)}
        >
          <Menu.Item key="Dashboard" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>

          <Menu.Item key="Student" icon={<UserOutlined />}>
            Student
          </Menu.Item>
          <Menu.Item key="Course" icon={<BookOutlined />}>
            Course
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout
        className="site-layout"
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "margin-left 0.2s",
          backgroundColor: "#FAF9F6",
        }}
      >
        <Header
          style={{
            backgroundColor: "white",
            padding: 0,
            top: 0,
            position: "sticky",
            zIndex: 999,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
              style={{ fontSize: "16px", width: 64, height: 64 }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                paddingRight: "20px",
              }}
            >
              <Badge count={4}>
                <NotificationOutlined style={{ fontSize: "24px" }} />
              </Badge>

              <Dropdown overlay={menu} trigger={["click"]}>
                <Avatar
                  src={`http://localhost:4000/${user?.image}`}
                  style={{ cursor: "pointer" }}
                />
              </Dropdown>
              <Title level={5}>{user?.name}</Title>
            </div>
          </div>
        </Header>

        <Content style={{ margin: "16px" }}>
          {selectedAddCourse ? (
            <AddCourse onSave={handleCancel} />
          ) : (
            <>
              {selectedItem === "Dashboard" && <div>Dashboard</div>}
              {selectedItem === "Student" && <Student />}
              {selectedItem === "Course" && (
                <Course onAddCourse={handleAddCourse} />
              )}

              {selectedItem === "profile" && (
                <Profile user={user} onUpdate={onUpdate} />
              )}
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
