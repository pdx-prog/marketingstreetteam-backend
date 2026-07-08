import { Router} from "express";
import { getUsuarios, getRutas, getLeads } from "../controllers/usuarios.js";
import visitasRouter from "./visitas.js";

const router = Router()

router.get('/usuarios', getUsuarios)
router.get('/rutas', getRutas)
router.get('/leads', getLeads)
router.use('/visitas', visitasRouter)

export default router