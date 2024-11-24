import { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Typography,
  Button,
  Select,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  LogoutOutlined,
  BookOutlined,
  UserOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../../../constant/actionType";
import { jwtDecode } from "jwt-decode";
import { getUserById } from "../../../redux/action/user";
import Profile from "./profile";
import Course from "../course/course";
import AddCourse from "../course/addCourse";
import EditCourse from "../course/editCourse";
import AddStudent from "../student/addStudent";
import ActiveStudent from "../student/activeStudent";
import GraduatedStudent from "../student/graduatedStudent";
import Attendance from "../Attendance/attendance";
import StudentDetail from "../student/studentDetail";
import { useTranslation } from "react-i18next";
import AttendanceDetail from "../Attendance/attendanceDetail";
import Grade from "../grade/grade";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

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
  const [selectedAttendanceDetail, setSelectedAttendanceDetail] =
    useState(null);

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
    navigate("/");
  };

  const user = useSelector((state: any) => state.user?.userData?.user);
  console.log("user: ", user);
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
    setSelectedAttendanceDetail(null);
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

  const handleAttendanceDetailClick = (record: any) => {
    setSelectedAttendanceDetail(record);
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
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang); // Save to localStorage
  };

  const menu = (
    <Menu onClick={({ key }) => handleMenuItemClick(key)}>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        {t("Profile")}
      </Menu.Item>
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
        {t("Logout")}
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
          defaultSelectedKeys={["Dashboard"]}
          mode="inline"
          onClick={({ key }) => handleMenuItemClick(key)}
        >
          <Menu.Item key="Dashboard" icon={<DashboardOutlined />}>
            {t("dashboard")}
          </Menu.Item>

          <Menu.SubMenu
            key="Students"
            title={t("Students")}
            icon={<UserOutlined />}
            onTitleClick={handleStudentsClick}
          >
            <Menu.Item
              key="Active"
              icon={<CheckCircleOutlined />}
              style={{ userSelect: "none" }}
            >
              {t("Active Student")}
            </Menu.Item>
            <Menu.Item key="Graduated" icon={<TrophyOutlined />}>
              {t("Graduated Student")}
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="Attendance" icon={<ClockCircleOutlined />}>
            {t("Attendance")}
          </Menu.Item>
          <Menu.Item key="Course" icon={<BookOutlined />}>
            {t("Course")}
          </Menu.Item>
          <Menu.Item key="Grade" icon={<ReadOutlined />}>
            {t("Grade")}
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
              <Select
                defaultValue={i18n.language}
                style={{ width: 120 }}
                onChange={changeLanguage}
              >
                <Option value="en">English</Option>
                <Option value="am">አማረኛ</Option>
              </Select>
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
          ) : selectedAttendanceDetail ? (
            <AttendanceDetail record={selectedAttendanceDetail} />
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
              {selectedItem === "Attendance" && (
                <Attendance onDetailClick={handleAttendanceDetailClick} />
              )}
              {selectedItem === "Grade" && <Grade />}
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
