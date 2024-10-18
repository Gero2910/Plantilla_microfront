import React, { useEffect, useState, useRef } from 'react';
import { Button, Input, Space, Table } from 'antd';
import { createStyles } from 'antd-style';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, FileExcelOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import conexion from "../conexion"
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


const DataTable = () => {
    const [customers, setCustomers] = useState([]);
    const [columns, setColumns] = useState([]);
    /*filtros*/
    const [searchText, setSearchText] = useState('');
    const [updateFlag, setUpdateFlag] = useState(false);
    const [searchedColumn, setSearchedColumn] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const searchInput = useRef(null);
    const { styles } = useStyle();
    /* catalgos */
    const [idPlaza, setIdPlaza] = useState(localStorage.getItem('plazaSelected'));
    const [idDesarrollo, setIdDesarrollo] = useState(localStorage.getItem('desarrolloSelected'));
    const [idEtapa, setIdEtapa] = useState(localStorage.getItem('etapaSelected'));
    
    useEffect(() => { 
        const storePlazaSelected = localStorage.getItem("plazaSelected");
        const storeDesarrolloSelected = localStorage.getItem("desarrolloSelected");
        const storeEtapaSelected = localStorage.getItem("etapaSelected");
    
        // Llamar filtrarListado solo si alguno de los valores no es '0'
        if (storePlazaSelected || storeDesarrolloSelected  || storeEtapaSelected ) {
            filtrarListado(storePlazaSelected, storeDesarrolloSelected, storeEtapaSelected);
        }
    
        window.eventBus.on("plazaSelected", (value) => {
            localStorage.setItem('plazaSelected', value);
            setIdPlaza(value);
        });
    
        window.eventBus.on("desarrolloSelected", (value) => {
            localStorage.setItem('desarrolloSelected', value);
            setIdDesarrollo(value);
        });
    
        window.eventBus.on("etapaSelected", (value) => {
            localStorage.setItem('etapaSelected', value);
            setIdEtapa(value);
        });
    
        return () => {
            window.eventBus.off("plazaSelected");
            window.eventBus.off("desarrolloSelected");
            window.eventBus.off("etapaSelected");
        };
    }, []);

    const filtrarListado = async (plazaStore, desarrolloStore, etapaStore) => {
        try {
            const response = await conexion("listadoParametros", { plaza: plazaStore, desarrollo: desarrolloStore, etapa: etapaStore });
            const formattedData = response.map((item) => ({
                ...item,
            }));

            setCustomers(formattedData);
            setFilteredData(formattedData);
            // Generar columnas dinámicamente
            if (formattedData.length > 0) {
                const generatedColumns = Object.keys(formattedData[0]).map((key) => ({
                    title: key.replace(/_/g, " ").toUpperCase(),
                    dataIndex: key,
                    key: key,
                    ...getColumnSearchProps(key),
                    onHeaderCell: () => ({
                        style: { whiteSpace: 'nowrap' }, // Evitar que los títulos se envuelvan
                    }),
                    width: 200,
                    ellipsis: true,
                }));

                //* Añadir la columna de acciones si es necesario*
                // generatedColumns.push({
                //     title: "Acciones",
                //     key: "acciones",
                //     render: (record) => (
                //         <Space size="middle">
                //             <Button
                //                 icon={<EditOutlined />}
                //                 onClick={() => mostrarModalEditarUsuario(record)}
                //             ></Button>
                //             <Button
                //                 icon={<UserDeleteOutlined />}
                //                 onClick={() => mostrarModalElimiar(record)}
                //                 danger
                //             ></Button>
                //         </Space>
                //     ),
                // });

                setColumns(generatedColumns);
            }
        } catch (error) {
            console.error("Error al cargar el listado desarrollo etapa:", error);
        }
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Buscar ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Buscar
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Cerrar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
        setFilteredData(customers);
    };

    const exportExcel = () => {
        // Extraer los títulos de las columnas
        const headers = columns.map((column) => column.title);

        // Extraer los campos (dataIndex) correspondientes a cada columna
        const dataIndexes = columns.map((column) => column.dataIndex);

        // Crear los datos para Excel incluyendo el encabezado
        const data = [
            headers, // Primera fila: Títulos de las columnas
            ...filteredData.map((customer) =>
                dataIndexes.map((index) => customer[index] || '')
            ), // Las demás filas: Datos filtrados
        ];

        // Crear hoja de trabajo a partir de los datos
        const worksheet = XLSX.utils.aoa_to_sheet(data);

        // Crear el libro y añadir la hoja
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Prueba');

        // Escribir el archivo Excel
        XLSX.writeFile(workbook, 'prueba.xlsx');
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