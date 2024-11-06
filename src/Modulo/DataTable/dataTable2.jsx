import React, { useEffect, useState, useRef, Children } from 'react';
import { Button, Space, Table } from 'antd';
import { createStyles } from 'antd-style';
import { UserDeleteOutlined, EditOutlined, FileExcelOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import conexion from "../../conexion"
import "../DataTable/dataTable.css"

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
const DataTable = ({ data, idPlazaSeleccionada, idDesarrolloSeleccionada, idEtapaSeleccionada }) => {
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const { styles } = useStyle();

    useEffect(() => {
        const fetchData = async () => {
            if (data) {
                const tipo = data.menu;
                const plaza = data.plaza;
                const desarrollo = data.desarrollo;
                const etapa = data.etapa;
                CargarListado(tipo, plaza, desarrollo, etapa);
            }
        };
        fetchData();
    }, []);

    const CargarListado = async (tipo, plaza, desarrollo, etapa) => {
        let response;
        try {
            switch (tipo) {
                case "2":
                    response = await conexion("listadoModeloFinanciero", {
                        plaza,
                        desarrollo,
                        etapa,
                    });
                    break;
                default:
                    console.error("Tipo de datos no soportado");
                    return;
            }
            const header = [
                {
                    title: "EJECUTADO REAL",
                    dataIndex: "ejecutado",
                    key: "ejecutado",
                    children: [
                        {
                            dataIndex: "ejecutado",
                            key: "ejecutado",
                        },
                        {
                            dataIndex: "total_real",
                            key: "total_real"
                        },
                        {
                            dataIndex: "total_porcentaje_real",
                            key: "total_porcentaje_real"
                        },
                    ]
                },
                {
                    title: "MFE V.2",
                    children: [
                        {
                            dataIndex: "total_planeado",
                            key: "total_planeado"
                        },
                        {
                            dataIndex: "total_porcentaje_planeado",
                            key: "total_porcentaje_planeado"
                        },
                    ]
                }
            ];

            const body = [
                {
                    key: 1,
                    ejecutado: "INGRESOS",
                    total_real: "$81,353,219.60",
                    total_porcentaje_real: "%",
                    total_planeado: "$0.00",
                    total_porcentaje_planeado: "%",
                    children: [
                        {
                            key: "1.1",
                            ejecutado: "ESCRITURACION",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        },
                        {
                            key: "1.2",
                            ejecutado: "OTROS INGRESOS",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        },
                        {
                            key: "1.3",
                            ejecutado: "DESCUENTOS SOBRE VENTA",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        }
                    ]
                },
                {
                    key: 2,
                    ejecutado: "COSTOS DE PRODUCCION",
                    total_real: "$43,918,054.42",
                    total_porcentaje_real: "%",
                    total_planeado: "$257,145,017.92",
                    total_porcentaje_planeado: "%",
                    children: [
                        {
                            key: "2.4",
                            ejecutado: "TERRENOS",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        },
                        {
                            key: "2.5",
                            ejecutado: "EDIFICACION",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        },
                        {
                            key: "2.6",
                            ejecutado: "URBANIZACION",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        },
                        {
                            key: "2.7",
                            ejecutado: "INFRAESTRUCTURA",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        },
                        {
                            key: "2.8",
                            ejecutado: "OBRA CIVIL DE IMAGEN URBANA",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        },
                        {
                            key: "2.9",
                            ejecutado: "JARDINERIA Y EQUIPAMIENTO",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        },
                        {
                            key: "2.10",
                            ejecutado: "INDIRECTOS DE OBRA",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        },
                        {
                            key: "2.11",
                            ejecutado: "TRAMITES Y LICENCIAS",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        },
                        {
                            key: "2.12",
                            ejecutado: "ESTUDIOS Y PROYECTOS",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        },
                        {
                            key: "2.13",
                            ejecutado: "MANTENIMIENTO JARDINERIA",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        },
                        {
                            key: "2.14",
                            ejecutado: "DECORACION CASA MUESTRA",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        },
                        {
                            key: "2.15",
                            ejecutado: "SERVICIO AL CLIENTE",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        },
                        {
                            key: "2.16",
                            ejecutado: "POST VENTA",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        },
                        {
                            key: "2.17",
                            ejecutado: "ACTUALIZACION DE COSTOS 5%",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        },
                        {
                            key: "2.18",
                            ejecutado: "OBRA EXTRA",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        }
                    ]
                },
                {
                    key: 3,
                    ejecutado: "GASTOS DE OPERACION",
                    total_real: "$0.00",
                    total_porcentaje_real: "%",
                    total_planeado: "$0.00",
                    total_porcentaje_planeado: "%",
                    children: [
                        {
                            key: "3.19",
                            ejecutado: "GASTOS DE ADMINISTRACION",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        },
                        {
                            key: "3.20",
                            ejecutado: "GASTOS DE VENTA",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        },
                        {
                            key: "3.21",
                            ejecutado: "COMISIONES SOBRE VENTA",
                            real: "$83,059,827.60",
                            procetanje_real: " ",
                            planeado: "$0.00",
                            procetanje_planeado: " "
                        }
                    ]
                }
            ];

            //const header = response["t-header"];
            //const body = replaceNullWithZero(response["t-body"]);

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
                align: detectDataType(dataSource, col.dataIndex) === "number" ? "right" : "center",
                onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
            };

            if (col.children && col.children.length > 0) {
                columnConfig.children = generateColumns(col.children);
            }

            return columnConfig;
        });
    };


    const replaceNullWithZero = (data) => {
        return data.map(item => {
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
                    total_procetanje_planeado: child.procetanje_planeado || child.total_procetanje_planeado,
                    total_porcentaje_real: child.procetanje_real || child.total_porcentaje_real
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
                    scroll={{ x: 'max-content', y: 'calc(100vh - 200px)' }}
                    size="small"
                    onChange={(pagination, filters, sorter, extra) => {
                        setFilteredData(extra.currentDataSource);
                    }}
                    title={() => (
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                            <Button icon={<FileExcelOutlined />} onClick={exportExcel}>
                                Exportar a Excel
                            </Button>
                        </div>
                    )}
                    rowClassName={() => "custom-row"}
                />
            </div>
        </div >
    );
};

export default DataTable;
