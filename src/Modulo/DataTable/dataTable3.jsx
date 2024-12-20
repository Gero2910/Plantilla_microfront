import React, { useEffect, useState, useRef, Children } from "react";
import { Button, Space, Table } from "antd";
import { createStyles } from "antd-style";
import {
  UserDeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
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
const DataTable = ({ data }) => {
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { styles } = useStyle();

  useEffect(() => {
    const fetchData = async () => {
      if (data) {
        const tipo = data.menu;
        CargarListado(tipo);
      }
    };
    fetchData();
  }, []);

  const CargarListado = async (tipo, plaza, desarrollo, etapa) => {
    let response;
    try {
      const conexiones = {
        2: "listadoInventarioTierras",
      };
      const conexionKey = conexiones[tipo];
      if (conexionKey) {
        response = await conexion(conexionKey, { plaza, desarrollo, etapa });
      } else {
        console.error("Tipo de datos no soportado");
        return;
      }

      const header = response["t-header"];
      const body = replaceNullWithZero(response["t-body"]);

      const generatedColumns = generateColumns(header);
      setColumns(generatedColumns);

      const formattedData = generateData(body);
      setDataSource(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error("Error al cargar el listado desarrollo etapa:", error);
    }
  };

  const generateColumns = (header) => {
    return header.map((col) => {
      const columnConfig = {
        title: col.title,
        dataIndex: col.dataIndex,
        key: col.key,
        width: 200,
        ellipsis: true,
        align:
          detectDataType(dataSource, col.dataIndex) === "number"
            ? "right"
            : "center",
        onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      };

      if (col.children && col.children.length > 0) {
        columnConfig.children = generateColumns(col.children);
      }

      return columnConfig;
    });
  };

  const replaceNullWithZero = (data) => {
    return data.map((item) => {
      const newItem = {};
      for (let key in item) {
        newItem[key] = item[key] === null ? 0 : item[key];
      }
      if (item.children) {
        newItem.children = replaceNullWithZero(item.children);
      }
      return newItem;
    });
  };

  const generateData = (body) => {
    return body.map((item) => {
      const row = { ...item };

      if (item.children) {
        row.children = item.children.map((child) => ({
          ...child,
          total_planeado: child.planeado || child.total_planeado,
          total_real: child.real || child.total_real,
          total_procetanje_planeado:
            child.procetanje_planeado || child.total_procetanje_planeado,
          total_porcentaje_real:
            child.procetanje_real || child.total_porcentaje_real,
        }));
      }

      return row;
    });
  };

  const detectDataType = (data, key) => {
    const firstNonNullValue = data.find((item) => item[key] !== null)?.[key];
    return typeof firstNonNullValue === "number" ? "number" : "text";
  };

  const exportExcel = () => {
    const headers = columns.map((col) => col.title || col.dataIndex);
    const data = [headers, ...flattenData(dataSource, columns)];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "data.xlsx");
  };

  const flattenData = (data, columns) => {
    const flatData = [];
    const flatten = (row) => {
      const flatRow = columns.map((col) => row[col.dataIndex] || "");
      flatData.push(flatRow);

      if (row.children) {
        row.children.forEach((child) => flatten(child));
      }
    };
    data.forEach((row) => flatten(row));
    return flatData;
  };

  return (
    <div>
      <div className="table-container">
        <Table
          className={styles.customTable}
          columns={columns}
          dataSource={filteredData.length ? filteredData : dataSource}
          pagination={{
            pageSize: 20,
            position: ["bottomCenter"],
            showSizeChanger: false,
            responsive: true,
          }}
          bordered
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
        />
      </div>
    </div>
  );
};

export default DataTable;
