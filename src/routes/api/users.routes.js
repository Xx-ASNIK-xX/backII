import { Router } from 'express';
import usersApiController from '../../controllers/users.api.controller.js';
import { authJwt } from '../../middlewares/jwt.middleware.js';

const router = Router();

// CRUD usuarios
router.get('/', authJwt, usersApiController.getAllUsers);
router.get('/:id', authJwt, usersApiController.getUserById);
router.post('/', usersApiController.createUser);
router.put('/:id', authJwt, usersApiController.updateUser);
router.delete('/:id', authJwt, usersApiController.deleteUser);

// Login (generar JWT y cookie)
router.post('/login', usersApiController.login);

export default router; 