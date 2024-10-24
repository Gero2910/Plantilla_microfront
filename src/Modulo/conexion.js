import axios from "axios";

const apiUrlVisor = "http://192.168.0.60:5000/api/v1/planeacionestrategica";

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
  // Ejemplo de un POST
  crearUsuario: async (data) => {
    // Aquí recibes `data`, que contiene el payload para el POST
    try {
      const response = await axios.post(`${apiUrlVisor}/crearUsuario`, data);
      return response.data;
    } catch (error) {
      console.error("Error al crear usuario", error);
      return null;
    }
  },

  // Ejemplo de un PUT
  actualizarCentroCostos: async (id, data) => {
    try {
      const response = await axios.put(
        `${apiUrlVisor}/centrocostos/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error al actualizar centro de costos", error);
      return null;
    }
  },

  // Ejemplo de un DELETE
  eliminarUsuario: async (id) => {
    try {
      const response = await axios.delete(`${apiUrlVisor}/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar usuario", error);
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
