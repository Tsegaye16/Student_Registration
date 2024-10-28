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
  BookOutlined,
  UserOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../../../constant/actionType";
import { jwtDecode } from "jwt-decode";
import { getUserById } from "../../../redux/action/user";
import Profile from "./profile";
//import Student from "../student/student";
import Course from "../course/course";
import AddCourse from "../course/addCourse";
import EditCourse from "../course/editCourse";
import AddStudent from "../student/addStudent";
import ActiveStudent from "../student/activeStudent";
import GraduatedStudent from "../student/graduatedStudent";
import Attendance from "../Attendance/attendance";
import StudentDetail from "../student/studentDetail";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const [isStudentsOpen, setIsStudentsOpen] = useState(false);
  const [selectedAddCourse, setSelectedAddCourse] = useState(false);
  const [selectEditCourse, setSelectEditCourse] = useState<any>({
    name: "",
    duration: "",
    price: "",
  });
  const [selectAddStudent, setSelectAddStudent] = useState(false);
  const [selectDetail, setSelectDetail] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("user");

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleStudentsClick = () => {
    setIsStudentsOpen(!isStudentsOpen);
  };
  const handleLogout = async () => {
    await dispatch({ type: LOGOUT });
    localStorage.removeItem("user");
    //notification.warning({ message: "You are logged out" });
    navigate("/");
  };

  const user = useSelector((state: any) => state.user?.userData?.newUser);

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
    setSelectEditCourse({
      name: "",
      price: "",
      duration: "",
    });
    setSelectAddStudent(false);
    setSelectDetail(null);
  };
  const handleAddCourse = () => {
    setSelectedAddCourse(true);
  };

  const handleEditCourse = (id: {
    id: string;
    name: string;
    duration: string;
    price: string;
  }) => {
    setSelectEditCourse(id);
  };

  const handleAddStudent = () => {
    setSelectAddStudent(true);
  };

  const handleDetailClick = (record: any) => {
    setSelectDetail(record);
  };

  const handleCancel = () => {
    setSelectedAddCourse(false);
    setSelectAddStudent(false);
    setSelectEditCourse({
      name: "",
      duration: "",
      price: "",
    });
  };
  const onBack = () => {
    setSelectDetail(null);
  };
  const isSelectEditCourseEmpty = Object.values(selectEditCourse).every(
    (value) => value === ""
  );

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

          <Menu.SubMenu
            key="Students"
            title="Students"
            icon={<UserOutlined />} // Icon representing a person or user, suitable for "Students"
            onTitleClick={handleStudentsClick}
          >
            <Menu.Item
              key="Active"
              icon={<CheckCircleOutlined />} // Represents active or ongoing status
              style={{ userSelect: "none" }}
            >
              Active Student
            </Menu.Item>
            <Menu.Item
              key="Graduated"
              icon={<TrophyOutlined />} // Represents achievement or completion, suitable for "Graduated Student"
            >
              Graduated Student
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="Attendance" icon={<ClockCircleOutlined />}>
            Attendance
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
          ) : !isSelectEditCourseEmpty ? (
            <EditCourse courseInfo={selectEditCourse} onSave={handleCancel} />
          ) : selectAddStudent ? (
            <AddStudent onSave={handleCancel} />
          ) : selectDetail ? (
            <StudentDetail studentInfo={selectDetail} onback={onBack} />
          ) : (
            <>
              {selectedItem === "Dashboard" && <div>Dashboard</div>}

              {selectedItem === "Course" && (
                <Course
                  onAddCourse={handleAddCourse}
                  onEditCourse={handleEditCourse}
                />
              )}

              {selectedItem === "profile" && (
                <Profile user={user} onUpdate={onUpdate} />
              )}
              {selectedItem === "Active" && (
                <ActiveStudent
                  onAddStudent={handleAddStudent}
                  onDetailStudent={handleDetailClick}
                />
              )}
              {selectedItem === "Graduated" && <GraduatedStudent />}
              {selectedItem === "Attendance" && <Attendance />}
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
