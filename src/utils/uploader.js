import __dirname from "./index.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Definir la carpeta base donde se guardarán las imágenes
    const basePath = `${__dirname}/../public/img`;

    // Detectar si el archivo es "document" o "pet" según el campo del formulario o el mimetype
    if (file.fieldname === "petImage") {
      // Guardar en carpeta pets
      cb(null, path.join(basePath, "pets"));
    } else if (file.fieldname === "documents") {
      // Guardar en carpeta documents
      cb(null, path.join(basePath, "documents"));
    } else {
      // Por defecto, en carpeta general img
      cb(null, basePath);
    }
  },
  filename: function (req, file, cb) {
    // Nombre único para evitar sobreescrituras
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({ storage });

export default uploader;
