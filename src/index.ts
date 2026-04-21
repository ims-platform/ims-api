import express from "express";
import router from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Prefijo principal para todos los endpoints
app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api/v1`);
});
