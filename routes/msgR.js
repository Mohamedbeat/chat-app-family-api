import express from 'express'
import { addMsg, getAllMsgs } from '../controllers/msgC.js'
const router = express.Router()



router.post('/addMsg', addMsg)
router.post('/getAllMsgs', getAllMsgs)




export default router