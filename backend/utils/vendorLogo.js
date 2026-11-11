import mongoose from "mongoose";

export const maxLogoSize = 3 * 1024 * 1024;

export function logoContentType(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))) return "image/png";
  if (bytes.subarray(0, 3).equals(Buffer.from("ffd8ff", "hex"))) return "image/jpeg";
  if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  if (["GIF87a", "GIF89a"].includes(bytes.toString("ascii", 0, 6))) return "image/gif";
}

export function vendorLogoFields(file, fallback, id = new mongoose.Types.ObjectId()) {
  if (!file) return { logo: fallback || "" };
  return {
    _id: id,
    logo: `/api/vendors/${id}/logo`,
    logoBytes: file.buffer,
    logoContentType: logoContentType(file.buffer),
  };
}
