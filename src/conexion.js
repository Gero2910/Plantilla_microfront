import axios from "axios";

const apiUrlVisor = "http://192.168.0.60:5000/api/v1/planeacionestrategica";
const apiUrlFinanzas = "http://192.168.0.60:5000/api/v1/gestionadministracionfinanzas";

// Mapeo de funciones para cada proceso (proc)
const conexionProceso = {
  listado: async () => {
    try {
      const response = await axios.get(`${apiUrlVisor}/inventariotierras`);
      return response.data.body;
    } catch (error) {
      console.error("Error al cargar el listado", error);
      return null;
    }
  },
  listadoParametros: async (params) => {
    try {
      const response = await axios.get(`${apiUrlVisor}/segmentacionproyecto`, {
        params: {
          plaza: params.plaza,
          desarrollo: params.desarrollo,
          etapa: params.etapa,
        },
      });
      return response.data.body;
    } catch (error) {
      console.error("Error al cargar el listado", error);
      return null;
    }
  },
  listadoModeloFinanciero: async (params) => {
    try {
      const response = await axios.get(`${apiUrlFinanzas}/modelofinanciero`, {
        params: {
          plaza: params.plaza,
          desarrollo: params.desarrollo,
          etapa: params.etapa,
        },
      });
      return response.data.body;
    } catch (error) {
      console.error("Error al cargar el listado", error);
      return null;
    }
  },
};

const conexion = async (proc, params = null, data = null) => {
  const handler = conexionProceso[proc];
  if (handler) {
    return await handler(params, data);
  } else {
    console.error("Proceso no soportado:", proc);
    return null;
  }
};

export default conexion;
