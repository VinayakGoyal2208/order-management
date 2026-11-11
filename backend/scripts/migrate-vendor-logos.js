import "dotenv/config";
import { readFile } from "node:fs/promises";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Vendor from "../models/Vendor.js";
import { logoContentType, maxLogoSize, vendorLogoFields } from "../utils/vendorLogo.js";

const apply = process.argv.includes("--apply");
let found = 0;
let skipped = 0;

try {
  await connectDB();
  const vendors = Vendor.find({ logo: /^\/?uploads[\\/]/ }).select("logo").cursor();

  for await (const vendor of vendors) {
    const filename = vendor.logo.split(/[\\/]/).at(-1);
    if (!filename || filename === "." || filename === "..") {
      skipped++;
      continue;
    }

    const url = new URL("../uploads/" + encodeURIComponent(filename), import.meta.url);
    const bytes = await readFile(url).catch((error) => {
      if (error.code === "ENOENT") return null;
      throw error;
    });
    if (!bytes || bytes.length > maxLogoSize || !logoContentType(bytes)) {
      console.warn(`Skipped ${vendor.id}: missing, unsupported, or over 3 MB`);
      skipped++;
      continue;
    }

    const { logo, logoBytes, logoContentType: contentType } = vendorLogoFields({ buffer: bytes }, "", vendor._id);
    if (apply) {
      const result = await Vendor.updateOne(
        { _id: vendor._id, logo: vendor.logo },
        { $set: { logo, logoBytes, logoContentType: contentType } },
      );
      if (!result.modifiedCount) {
        skipped++;
        continue;
      }
    }
    found++;
  }

  console.log(`${apply ? "Migrated" : "Ready to migrate"}: ${found}. Skipped: ${skipped}.`);
} catch (error) {
  console.error("Vendor logo migration failed:", error.code || error.name);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
