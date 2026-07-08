import { Router } from "express";
import { getVisitas, checkIn, updateVisita } from "../controllers/visitas.js";
import { createLead } from "../controllers/leads.js";

const router = Router()

// Visitas
router.get('/', getVisitas)
router.post('/checkin', checkIn)
router.patch('/:id', updateVisita)

//Leads
router.get('/leads', createLead)

export default router
