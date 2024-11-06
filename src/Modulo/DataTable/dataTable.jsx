import React, { useEffect, useState, useRef } from "react";
import { Button, Input, Space, Table } from "antd";
import { createStyles } from "antd-style";
import Highlighter from "react-highlight-words";
import { SearchOutlined, FileExcelOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import conexion from "../../conexion";
import "../DataTable/dataTable.css";

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      display: flex;
      flex-direction: column;
      height: 100%; /* Asegura que la tabla ocupe toda la altura disponible */

      .table-container {
        flex: 1;
        overflow-y: auto;
        overflow-x: auto;
      }

      /* Media query para pantallas más pequeñas */
      @media (max-width: 768px) {
        .table-container {
          height: 100%;
        }

        /* Ajuste del tamaño del paginador para pantallas pequeñas */
        .ant-pagination {
          display: flex;
          justify-content: center;
          padding: 10px;
        }
      }

      /* Ajustar tamaño de letra en pantallas pequeñas */
      @media (max-width: 576px) {
        .custom-row td {
          font-size: 10px; /* Reducir el tamaño de la letra en pantallas pequeñas */
        }
      }
    `,
  };
});

const DataTable = ({
  data,
  idPlazaSeleccionada,
  idDesarrolloSeleccionada,
  idEtapaSeleccionada,
}) => {
  const [customers, setCustomers] = useState([]);
  const [columns, setColumns] = useState([]);
  /*filtros*/
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const searchInput = useRef(null);
  const { styles } = useStyle();

  useEffect(() => {
    if (data) {
      const tipo = data.menu;
      const plaza = data.plaza;
      const desarrollo = data.desarrollo;
      const etapa = data.etapa;
      CargarListado(tipo, plaza, desarrollo, etapa);
    }
  }, [data]);

  const CargarListado = async (tipo, plaza, desarrollo, etapa) => {
    let response;
    try {
      switch (tipo) {
        case "1":
          response = await conexion("listadoParametros", {
            plaza,
            desarrollo,
            etapa,
          });
          break;
        default:
          console.error("Tipo de datos no soportado");
          return;
      }
      let formattedData = response.map((item) => ({ ...item }));
      formattedData = replaceNullWithZero(formattedData);
      
      setCustomers(formattedData);
      setFilteredData(formattedData);
      if (formattedData.length > 0) {
        const generatedColumns = Object.keys(formattedData[0]).map((key) => ({
          title: key.replace(/nom_/g, " ").toUpperCase(),
          dataIndex: key,
          key: key,
          ...getColumnSearchProps(key),
          onHeaderCell: () => ({
            style: { whiteSpace: "nowrap" },
          }),
          width: 200,
          ellipsis: true,
          align: detectDataType(formattedData, key) === "number" ? "right" : "center",
        }));

        setColumns(generatedColumns);
      }
    } catch (error) {
      console.error("Error al cargar el listado desarrollo etapa:", error);
    }
  };

  const detectDataType = (data, key) => {
    const firstNonNullValue = data.find((item) => item[key] !== null)?.[key];
    return typeof firstNonNullValue === "number" ? "number" : "text";
  };

  const replaceNullWithZero = (data) => {
    return data.map(item => {
      const newItem = {};
      for (let key in item) {
        newItem[key] = item[key] === null ? 0 : item[key];
      }
      return newItem;
    });
  };


  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>

        <Input
          ref={searchInput}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }}
          style={{ marginBottom: 8, display: "block" }}
        />

        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>

          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Limpiar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      const recordValue = record[dataIndex];
      return recordValue ? recordValue.toString().toLowerCase().includes(value.toLowerCase()) : false;
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    const filtered = customers.filter((item) =>
      item[dataIndex]?.toString().toLowerCase().includes(selectedKeys[0].toLowerCase())
    );
    setFilteredData(filtered);
    confirm();
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText("");
    setSearchedColumn("");
    setFilteredData(customers);

    if (confirm) {
      confirm();
    }
  };

  useEffect(() => {
    if (searchText === "" && searchedColumn === "") {
      setFilteredData(customers); // Restore original data
    }
  }, [searchText, searchedColumn, customers]);


  useEffect(() => {
    setFilteredData(customers);
  }, [customers]);

  const exportExcel = () => {
    const headers = columns.map((column) => column.title);

    const dataIndexes = columns.map((column) => column.dataIndex);

    const data = [
      headers,
      ...filteredData.map((customer) =>
        dataIndexes.map((index) => customer[index] || "")
      ),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Prueba");

    XLSX.writeFile(workbook, "prueba.xlsx");
  };

  return (
    <div>
      <div className="table-container">
        <Table
          className={styles.customTable}
          columns={columns}
          dataSource={filteredData.length ? filteredData : customers}
          pagination={{
            pageSize: 20,
            position: ["bottomCenter"],
            showSizeChanger: false,
            responsive: true,
          }}
          scroll={{ x: "max-content", y: "calc(100vh - 200px)" }}
          size="small"
          onChange={(pagination, filters, sorter, extra) => {
            setFilteredData(extra.currentDataSource);
          }}
          title={() => (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "10px",
              }}
            >
              <Button icon={<FileExcelOutlined />} onClick={exportExcel}>
                Exportar a Excel
              </Button>
            </div>
          )}
          rowClassName={() => "custom-row"}
          locale={{ emptyText: "No se encontraron resultados" }}
        />
      </div>
    </div>
  );
};
export default DataTable;
