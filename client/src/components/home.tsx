import React, { useState } from "react";
import { Input, Button, message, Watermark } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { StyledContainer, Header, InputWrapper } from "./HomeStyle"; // Import the styles

import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [secretePhrase, setSecretePhrase] = useState<string>("");

  // const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <StyledContainer>
      <Header>
        <Button type="link" onClick={() => navigate("/login")}>
          Login
        </Button>
        <Button type="link" onClick={() => navigate("/register")}>
          Register
        </Button>
      </Header>
      <InputWrapper>
        <Input
          placeholder="Insert the secret phrase"
          prefix={<SearchOutlined />}
          value={secretePhrase}
          onChange={(e) => setSecretePhrase(e.target.value)}
        />
      </InputWrapper>
    </StyledContainer>
  );
};

export default Home;
