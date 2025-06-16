import __dirname from "./index.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const basePath = `${__dirname}/../public/img`;

    if (file.fieldname === "petImage") {
      cb(null, path.join(basePath, "pets"));
    } else if (file.fieldname === "documents") {
      cb(null, path.join(basePath, "documents"));
    } else {
      cb(null, basePath);
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({ storage });

export default uploader;
