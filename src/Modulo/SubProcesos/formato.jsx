import React, { useState, useRef, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";
import { Button, Layout, Input, Divider, Typography } from "antd";
import "./formato.css";
import SubMenu from "../SubMenu/menu.jsx";
import Proceso from "../SubProcesos/Proceso/proceso.jsx";
import Proceso2 from "../SubProcesos/procesos_2/proceso_2.jsx";
const { Search } = Input;
const { Title } = Typography;

const { Header, Content } = Layout;
const App = () => {
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario
  const [updateFlag, setUpdateFlag] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedPage, setSelectedPage] = useState("1"); // almacena la pagina seleccionada
  /* catalgos */
  const [idPlaza, setIdPlaza] = useState(localStorage.getItem("plazaSelected"));
  const [idDesarrollo, setIdDesarrollo] = useState(
    localStorage.getItem("desarrolloSelected")
  );
  const [idEtapa, setIdEtapa] = useState(localStorage.getItem("etapaSelected"));

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    window.eventBus.on("userLoggedIn", (data) => {
      setUserData(data);
    });

    window.eventBus.on("plazaSelected", (value) => {
      localStorage.setItem("plazaSelected", value);
      setIdPlaza(value);
    });

    window.eventBus.on("desarrolloSelected", (value) => {
      localStorage.setItem("desarrolloSelected", value);
      setIdDesarrollo(value);
    });

    window.eventBus.on("etapaSelected", (value) => {
      localStorage.setItem("etapaSelected", value);
      setIdEtapa(value);
    });

    return () => {
      window.eventBus.off("userLoggedIn");
      window.eventBus.off("plazaSelected");
      window.eventBus.off("desarrolloSelected");
      window.eventBus.off("etapaSelected");
    };
  }, []);

  const regresarMenu = () => {
    limpiar();
    window.history.pushState(null, "", "/menu");
  };

  const limpiar = () => {
    setCollapsed(false);
    setSelectedPage("");
    setUserData(null);
  };

  const renderContent = () => {
    switch (selectedPage) {
      case "1":
        return (
          <Proceso
            menu={selectedPage}
            plaza={idPlaza}
            desarrollo={idDesarrollo}
            etapa={idEtapa}
          />
        );
      case "2":
        return (
          <Proceso2
            menu={selectedPage}
            plaza={idPlaza}
            desarrollo={idDesarrollo}
            etapa={idEtapa}
          />
        );
      default:
        return <div>Seleccione una opción del menú</div>;
    }
  };

  return (
    <Layout style={{ border: "none", height: "100vh" }}>
      <SubMenu
        collapsed={collapsed}
        onSelectPage={(key) => setSelectedPage(key)}
      />
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
              alignItems: "center", // Centra verticalmente
              marginRight: "15px", // Añadir margen derecho para separarlo del borde
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
