import express from 'express'
import { getAllUsers, login, register, setAvatar } from '../controllers/userC.js'
const router = express.Router()


router.post('/register', register)
router.post('/login', login)
router.post('/setAvatar/:id', setAvatar)
router.get('/allUsers/:id', getAllUsers)








export default router