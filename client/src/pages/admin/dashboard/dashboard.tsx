import React, { useState } from "react";
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
  FileDoneOutlined,
  InboxOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const [isServeysOpen, setIsServeysOpen] = useState(false);
  const [selectedAddSurvey, setSelectedAddSurvey] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedAddCompany, setSelectedAddCompany] = useState(null);
  const [selectedAddQuestion, setSelectedAddQuestion] = useState(null);
  const [selectedEditQuestion, setSelectedEditQuestion] = useState(null);
  const [feedbackDetail, setFeedbackDetail] = useState(null);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuItemClick = (item: string) => {
    setSelectedItem(item);
    setSelectedDetail(null);
    setSelectedAddCompany(null);
    setSelectedAddQuestion(null);
    setSelectedEditQuestion(null);
    setSelectedAddSurvey(null);
    setFeedbackDetail(null);
  };

  const handleServeysClick = () => {
    setIsServeysOpen(!isServeysOpen);
  };

  const menu = (
    <Menu onClick={({ key }) => handleMenuItemClick(key)}>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      {/* <Menu.Item key="setting" icon={<SettingOutlined />}>
        Settings
      </Menu.Item> */}
      <Menu.Item key="3" icon={<LogoutOutlined />}>
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
          <Title level={5}>company</Title>
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

          <Menu.SubMenu
            key="Serveys"
            title="Serveys"
            icon={<UnorderedListOutlined />}
            onTitleClick={handleServeysClick}
          >
            <Menu.Item
              key="Published"
              icon={<FileDoneOutlined />}
              style={{ userSelect: "none" }}
            >
              Published
            </Menu.Item>
            <Menu.Item key="Draft" icon={<InboxOutlined />}>
              Draft
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.Item key="FeedBacks" icon={<NotificationOutlined />}>
            Feedbacks
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
                <Avatar src="" style={{ cursor: "pointer" }} />
              </Dropdown>
              <Title level={5}>User</Title>
            </div>
          </div>
        </Header>

        <Content style={{ margin: "16px" }}>
          <>
            {selectedItem === "Dashboard" && <div>Dashboard</div>}
            {selectedItem === "Published" && <div>Published</div>}
            {selectedItem === "Draft" && <div>Draft</div>}
            {selectedItem === "FeedBacks" && <div>feed back</div>}
            {selectedItem === "setting" && <div>setting</div>}
            {selectedItem === "profile" && <div>profile</div>}
          </>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
