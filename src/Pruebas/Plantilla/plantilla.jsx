import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  Input,
  Space,
  Divider,
  Typography,
} from "antd";
import "../Plantilla/plantilla.css"
import DataTable from "../DataTable/dataTable.jsx"
const { Search } = Input;
const { Title } = Typography;

const { Header, Sider, Content } = Layout;
const App = () => {
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario
  const [updateFlag, setUpdateFlag] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Escuchar el evento 'userLoggedIn' del Event Bus
  useEffect(() => {
    // Intentamos recuperar los datos desde localStorage primero
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData)); // Establecer los datos del usuario desde localStorage
    }

    // Escuchar el evento 'userLoggedIn' desde el Event Bus
    window.eventBus.on("userLoggedIn", (data) => {
      console.log("Datos recibidos en el administrador:", data);
      setUserData(data); // Actualizar los datos del usuario cuando se emite el evento
    });

    return () => {
      // Limpiamos la suscripción al desmontar el componente
      window.eventBus.off("userLoggedIn");
    };
  }, []);


  const regresarMenu = () => {
    limpiar();
    window.history.pushState(null, "", "/menu");
  };
  return (
    <Layout style={{ border: "none", height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div classnombre="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "USUARIO",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#000", // Cambié el fondo a negro
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
            {/* Mostrar los datos del usuario recibidos por el Event Bus */}
            <Title
              level={3}
              style={{ color: "white", margin: "0", fontSize: "13px" }}
            >
              <UserOutlined />
              <Divider type="vertical" style={{ borderColor: "#FFF" }} />
              {userData ? userData.nombre : "Cargando..."}{" "}
              {/* Mostrar el nombre del usuario */}
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
          {/* <Table columns={columns} dataSource={customers} /> */}
          <DataTable/>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
