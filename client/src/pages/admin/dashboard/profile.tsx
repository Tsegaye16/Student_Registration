import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Typography,
  Upload,
  message,
} from "antd";
import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { changePassword, updateProfile } from "../../../redux/action/user";

const { Title } = Typography;
//const { Meta } = Card;

interface UserType {
  name: string;
  email: string;
  id: string;
  image?: string;
}

interface ProfileProps {
  user: UserType;

  onUpdate: any;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const dispatch = useDispatch();

  // State for user data
  const [userData, setUserData] = useState<{
    name: any;
    email: any;
    image: any;
  }>({
    name: "",
    email: "",
    image: null,
  });

  const [isUserChanged, setIsUserChanged] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        image: user.image || null,
      });
    }
  }, [user]);

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
    setIsUserChanged(true);
  };

  const handleUserImageChange = (info: any) => {
    const file = info.file.originFileObj;
    if (file) {
      setUserData((prevData) => ({ ...prevData, image: file }));
      setIsUserChanged(true);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleEditProfile = async () => {
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    if (userData.image) {
      formData.append("image", userData.image);
    }

    const response = await dispatch(updateProfile(user.id, formData) as any);

    if (response?.payload) {
      setUserData({
        name: response.payload.user.name || user.name,
        email: response.payload.user.email || user.email,
        image: response.payload.user.image || user.image,
      });
      message.success(`${response.payload.message}`);
      setIsUserChanged(false);
      await onUpdate();
    } else if (response?.error) {
      message.error(`${response.error}`);
    } else {
      message.error("Error updating profile");
    }
  };

  // forgote password functionality
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    const response = await dispatch(
      changePassword({
        currentPassword,
        newPassword,
        email: user?.email,
      }) as any
    );
    if (response?.payload?.message) {
      message.success(`${response?.payload?.message}`);
      setShowChangePassword(false);
    } else if (response?.error) {
      message.error(`${response.error}`);
    } else {
      message.error("Error changing password");
    }
  };

  return (
    <Row gutter={[16, 16]}>
      {/* Profile Section */}
      <Col xs={24} sm={24} md={12}>
        <Card title="Profile" bordered={false}>
          <Form layout="vertical">
            <Form.Item label="Profile Photo">
              <Upload
                name="image"
                listType="picture-circle"
                showUploadList={false}
                onChange={handleUserImageChange}
              >
                {userData.image ? (
                  <Avatar
                    src={
                      typeof userData.image === "string"
                        ? `http://localhost:4000/${userData.image}`
                        : URL.createObjectURL(userData.image)
                    }
                    size={100}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <Avatar size={100} icon={<PlusOutlined />} />
                )}
              </Upload>
            </Form.Item>

            <Form.Item label="Name">
              <Input
                name="name"
                value={userData.name}
                onChange={handleUserInputChange}
              />
            </Form.Item>

            <Form.Item label="Email">
              <Input
                name="email"
                value={userData.email}
                onChange={handleUserInputChange}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                onClick={handleEditProfile}
                disabled={!isUserChanged}
                icon={<EditOutlined />}
                style={{ marginRight: 8 }}
              >
                Save
              </Button>
              <Button
                type="default"
                style={{ float: "right" }}
                onClick={() => setShowChangePassword(true)}
              >
                Change Password
              </Button>
            </Form.Item>
          </Form>
          {showChangePassword ? (
            <Form layout="vertical">
              <Form.Item
                label="Current password"
                name="currentPassword"
                rules={[
                  {
                    required: true,
                    message: "Please enter your current password!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Enter current password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="New password"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: "Please enter new and strong password!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Enter new password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item>
                <Row gutter={[8, 8]}>
                  <Col>
                    <Button
                      type="primary"
                      // onClick={handleEditProfile}
                      //disabled={!isUserChanged}
                      icon={<EditOutlined />}
                      style={{ marginRight: 8 }}
                      onClick={handleChangePassword}
                    >
                      Save
                    </Button>
                    <Button
                      type="default"
                      style={{ float: "right" }}
                      onClick={() => setShowChangePassword(false)}
                    >
                      cancel
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          ) : null}
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;
