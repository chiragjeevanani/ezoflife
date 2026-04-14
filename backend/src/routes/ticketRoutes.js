import express from 'express';
import { 
    createTicket, 
    getCustomerTickets, 
    getAllTickets, 
    addMessage, 
    updateTicketStatus,
    getTicketDetails 
} from '../controllers/ticketController.js';

const router = express.Router();

// Customer Routes
router.post('/create', createTicket);
router.get('/customer/:customerId', getCustomerTickets);
router.get('/:ticketId', getTicketDetails);
router.post('/:ticketId/message', addMessage);

// Admin Routes
router.get('/admin/all', getAllTickets);
router.patch('/admin/:ticketId/status', updateTicketStatus);

export default router;
