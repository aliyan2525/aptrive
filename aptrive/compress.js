import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const input = path.join(__dirname, "app/logo-transparent-full.png");
const output = path.join(__dirname, "app/logo-transparent-full.webp");

sharp(input)
  .webp({ quality: 80 })
  .toFile(output)
  .then(() => {
    console.log("Image compressed successfully to WebP.");
  })
  .catch((err) => {
    console.error("Error compressing image:", err);
  });

