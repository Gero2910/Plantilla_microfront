import axios from "axios";

// eslint-disable-next-line no-undef
const apiUrlVisor = process.env.REACT_API_URL_PLANEACIONESTRATEGICA;
// eslint-disable-next-line no-undef
const apiUrlFinanzas = process.env.REACT_API_URL_GESTIONFINANZAS;
// eslint-disable-next-line no-undef
const apiUrlCatalagos = process.env.REACT_API_URL_CATALOGOS;

const conexionProceso = {
  catalagos: async (numCatalago) => {
    try {
      const response = await axios.get(`${apiUrlCatalagos}/listadocatalogos`, {
        params: {
          catalogos: `[${numCatalago}]`,
        },
        paramsSerializer: (params) => {
          return new URLSearchParams(params).toString();
        },
      });
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
