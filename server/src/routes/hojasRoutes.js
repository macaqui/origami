import { Router } from 'express';
import {
  obtenerHojas,
  obtenerHojaPorId,
  crearHoja,
  actualizarHoja,
  eliminarHoja
} from '../controllers/hojasController.js';

const router = Router();

router.get('/', obtenerHojas);
router.get('/:id', obtenerHojaPorId);
router.post('/', crearHoja);
router.put('/:id', actualizarHoja);
router.delete('/:id', eliminarHoja);

export default router;
