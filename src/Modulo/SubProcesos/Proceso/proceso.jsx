import React from "react";
import { Layout } from "antd";
import DataTable from "../../DataTable/dataTable";

const proceso = (menu, plaza, desarrollo, etapa) => {
  return (
    <Layout>
      <DataTable
        data={menu}
        idPlazaSeleccionada={plaza}
        idDesarrolloSeleccionada={desarrollo}
        idEtapaSeleccionada={etapa}
      />
    </Layout>
  );
};

export default proceso;
