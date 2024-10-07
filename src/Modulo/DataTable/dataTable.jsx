import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import { Button, Input, Space, Table } from 'antd';
import { createStyles } from 'antd-style';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const useStyle = createStyles(({ css, token }) => {
    const { antCls } = token;
    return {
        customTable: css`
        display: flex;
        flex-direction: column;
        height: 100vh; /* Ocupar el alto total de la ventana */
        .table-container {
            flex: 1; /* Esto permitirá que la tabla ocupe el espacio disponible */
            overflow-y: auto; /* Scroll automático si es necesario */
        }
      `,
    };
});
const DataTable = () => {
    const apiUrlVisor = "http://192.168.0.60:5000/api/v1/generica";
    const [customers, setCustomers] = useState([]);
    const [columns, setColumns] = useState([]);
    /*filtros*/
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const searchInput = useRef(null);
    const { styles } = useStyle();

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get(`${apiUrlVisor}/centrocostos`);
                const data = response.data.body;

                const formattedData = data.map((item) => ({
                    ...item,
                }));

                setCustomers(formattedData);

                // Generar columnas dinámicamente
                if (formattedData.length > 0) {
                    const generatedColumns = Object.keys(formattedData[0]).map((key) => ({
                        title: key.replace(/_/g, " ").toUpperCase(), // Convertir key en el título
                        dataIndex: key,
                        key: key,
                        ...getColumnSearchProps(key)
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

        fetchCustomers();
    }, []);

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
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filtrar
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
    };

    const exportExcel = () => {
        // Extraer los títulos de las columnas
        const headers = columns.map((column) => column.title);

        // Extraer los campos (dataIndex) correspondientes a cada columna
        const dataIndexes = columns.map((column) => column.dataIndex);

        // Crear los datos para Excel incluyendo el encabezado
        const data = [
            headers, // Primera fila: Títulos de las columnas
            ...customers.map((customer) =>
                dataIndexes.map((index) => customer[index] || '')
            ), // Las demás filas: Datos de los customers
        ];

        // Crear hoja de trabajo a partir de los datos
        const worksheet = XLSX.utils.aoa_to_sheet(data);

        // Crear el libro y añadir la hoja
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tabla');

        // Escribir el archivo Excel
        XLSX.writeFile(workbook, 'tabla.xlsx');
    };

    return (
        <div>
            <Button onClick={exportExcel}>Excel</Button>
            <div className="table-container">
                <Table
                    columns={columns}
                    dataSource={customers}
                    pagination={{ pageSize: 10 }}
                    scroll={{ y: 'calc(90vh - 150px)' }} // Ajusta la tabla con el scroll dinámico
                />
            </div>
        </div>
    );
};
export default DataTable;