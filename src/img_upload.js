import multer from 'multer';
const { v4: uuidv4 } = require("uuid");
import path from 'path';

// Configuración absoluta del directorio
const __dirname = path.resolve();

// Define file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, 'src', 'uploads')); // Ruta completa
      // cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(
        null,        
        uuidv4() + "-" + file.originalname
      );
    },
  });
  
  // Specify file format that can be saved
  function fileFilter(req, file, cb) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
  
const upload = multer({ storage, fileFilter });

module.exports = upload;


