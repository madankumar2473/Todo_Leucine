import { Router } from 'express';
const summaryrouter = Router();
import {summarizeAndSend} from '../controllers/summarycontroller.js';

summaryrouter.post('/', summarizeAndSend);

export default summaryrouter;
