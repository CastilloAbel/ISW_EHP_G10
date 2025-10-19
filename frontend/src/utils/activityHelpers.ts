// Importar las imágenes
import safariImg from "../assets/zafari.png";
import tirolesaImg from "../assets/tirolesa.png";
import jardineriaImg from "../assets/jardineria.png";
import palestraImg from "../assets/palestra.png";

// Función para obtener el avatar según el nombre o código de la actividad
export const getActivityAvatar = (activityName: string, codigo?: string): string => {
  const name = activityName.toLowerCase();
  const code = (codigo || "").toLowerCase();

  if (code === "safari" || name.includes("safari") || name.includes("zafari"))
    return safariImg;
  if (code === "tirolesa" || name.includes("tirolesa")) return tirolesaImg;
  if (code === "jardineria" || name.includes("jardiner")) return jardineriaImg;
  if (code === "palestra" || name.includes("palestra")) return palestraImg;
  return ""; // default
};

// Función para formatear fecha y hora
export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const dateStr = date.toLocaleDateString("es-AR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  const timeStr = date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { dateStr, timeStr };
};

