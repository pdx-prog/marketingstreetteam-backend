import 'dotenv/config';
import express from 'express'
const app = express();
import cors from "cors";
import supabase from './config/db.js';
import routes from './routes/index.js'

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});