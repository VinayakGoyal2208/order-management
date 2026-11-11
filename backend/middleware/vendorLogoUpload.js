import multer from "multer";
import { logoContentType, maxLogoSize } from "../utils/vendorLogo.js";

const parseLogo = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxLogoSize, files: 1, fields: 16, fieldSize: 16 * 1024 },
}).single("image");

export default function vendorLogoUpload(req, res, next) {
  parseLogo(req, res, (error) => {
    if (error?.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ msg: "Vendor logos must be 3 MB or smaller." });
    }
    if (error) return res.status(400).json({ msg: "Invalid vendor image upload." });
    if (req.file && !logoContentType(req.file.buffer)) {
      return res.status(415).json({ msg: "Choose a JPEG, PNG, WebP, or GIF image." });
    }
    next();
  });
}
