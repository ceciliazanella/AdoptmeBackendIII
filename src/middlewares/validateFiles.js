const validateFiles = (req, res, next) => {
  if (
    !req.files ||
    ((!req.files.documents || req.files.documents.length === 0) &&
      (!req.files.petImage || req.files.petImage.length === 0))
  ) {
    return res.status(400).json({
      status: "error",
      message: "No se Recibieron Archivos para Subir...",
    });
  }
  next();
};

export default validateFiles;
