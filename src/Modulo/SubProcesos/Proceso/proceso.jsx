import React, { useState, useRef, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Input,
  Divider,
  Typography,
} from "antd";
import "./procesos.css"
import DataTable from "../../DataTable/dataTable.jsx"
import SubMenu from "../../SubMenu/menu.jsx"
const { Search } = Input;
const { Title } = Typography;

const { Header,  Content } = Layout;
const App = () => {
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario
  const [updateFlag, setUpdateFlag] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedPage, setSelectedPage] = useState("1"); // almacena la pagina seleccionada

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    window.eventBus.on("userLoggedIn", (data) => {
      setUserData(data);
    });

    return () => {
      window.eventBus.off("userLoggedIn");
    };
  }, []);

  const regresarMenu = () => {
    //limpiar();
    window.history.pushState(null, "", "/menu");
  };

  const renderContent = () => {
    switch (selectedPage) {
      case "1":
        return <DataTable />;
      default:
        return <div>Seleccione una opción del menu</div>;
    }
  };

  return (
    <Layout style={{ border: "none", height: "100vh" }}>
      <SubMenu
        collapsed={collapsed}
        onSelectPage={(key) => setSelectedPage(key)} // Actualizar la página seleccionada
      />
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#000",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "18px",
              width: 64,
              height: 64,
              color: "#fff",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "5px",
              marginBottom: "5px",
              marginRight: "15px",
            }}
          >
            <Title
              level={3}
              style={{ color: "white", margin: "0", fontSize: "13px" }}
            >
              <UserOutlined />
              <Divider type="vertical" style={{ borderColor: "#FFF" }} />
              {userData ? userData.nombre : "Cargando..."}{" "}
            </Title>
            <Button
              type="primary"
              icon={<LeftCircleOutlined />}
              onClick={regresarMenu}
              style={{ marginLeft: "20px" }}
            ></Button>
          </div>
        </Header>

        <Content
          style={{
            margin: 0,
            padding: 0,
            maxHeight: "100vh",
            background: "#fff",
            border: "none",
          }}
        >
          {renderContent()}
        </Content>

      </Layout>
    </Layout>
  );
};

export default App;
