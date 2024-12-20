import React, { useEffect, useState } from "react";
import { Layout, Select, Divider, Row, Col, Button } from "antd";
import DataTable from "../../DataTable/dataTable4";
import { FileExcelOutlined } from "@ant-design/icons";

const Visor = (plaza, desarrollo, etapa) => {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [exportExcelFunc, setExportExcelFunc] = useState(null);

  useEffect(() => {
    cargarCatalagoTablas();
  }, []);

  const cargarCatalagoTablas = () => {
    const data = [
      { value: 1, label: "Opcion 1" },
      { value: 2, label: "Opcion 2" },
      { value: 3, label: "Opcion 3" },
      { value: 4, label: "Opcion 4" },
      { value: 5, label: "Opcion 5" },
    ];
    setOptions(data);
  };

  const handleChange = (value) => {
    setSelected(value);
  };
  const handleExport = () => {
    if (exportExcelFunc) {
      exportExcelFunc();
    } else {
      console.warn("No se ha inicializado la función exportExcel.");
    }
  };
  return (
    <Layout style={{ padding: "1%" }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          Seleccióne una tabla
          <Select
            value={selected}
            showSearch
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            allowClear
            placeholder="Seleccione una tabla"
            onChange={handleChange}
            options={options}
            style={{
              width: 200,
              marginRight: "10px",
            }}
          />
        </Col>
        <Col span={6}>
          <Button
            icon={<FileExcelOutlined />}
            onClick={handleExport}
            disabled={!selected}
            style={{
              width: 200,
              marginRight: "10px",
            }}
          >
            Exportar a Excel
          </Button>
        </Col>
      </Row>
      <Divider />
      {selected && (
        <DataTable tabla={selected} setExportExcelFunc={setExportExcelFunc} />
      )}
    </Layout>
  );
};

export default Visor;
