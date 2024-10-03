import React, {  useEffect, useState } from 'react';
import axios from "axios";
import { Table } from 'antd';
import { createStyles } from 'antd-style';
const useStyle = createStyles(({ css, token }) => {
    const { antCls } = token;
    return {
        customTable: css`
        ${antCls}-table {
          ${antCls}-table-container {
            ${antCls}-table-body,
            ${antCls}-table-content {
              scrollbar-width: thin;
              scrollbar-color: unset;
            }
          }
        }
      `,
    };
});
const DataTable = () => {
    const apiUrlCatalogos = "http://192.168.0.60:5000/api/v1/gestorusuarios";
    const [customers, setCustomers] = useState([]);
    const [columns, setColumns] = useState([]);
    const { styles } = useStyle();
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get(`${apiUrlCatalogos}/consultarusuarios`);
                const data = response.data.body;

                const formattedData = data.map((item) => ({
                    ...item,
                    num_empleado: item.num_empleado,
                    nom_empleado: item.nom_empleado.toUpperCase(),
                    correo: item.des_correo.toUpperCase(),
                }));

                setCustomers(formattedData);

                // Generar columnas dinámicamente
                if (formattedData.length > 0) {
                    const generatedColumns = Object.keys(formattedData[0]).map((key) => ({
                        title: key.replace(/_/g, " ").toUpperCase(), // Convertir la key en un título legible
                        dataIndex: key,
                        key: key,
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

    return (
        <div>
            <Table
                columns={columns}
                dataSource={customers}
                pagination={{ pageSize: 10 }}
                scroll={{ y: 55 * 5 }}
            />
        </div>
    );
};
export default DataTable;