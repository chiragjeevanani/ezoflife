import Ticket from '../models/Ticket.js';

// Create a new support ticket
export const createTicket = async (req, res) => {
    try {
        console.log('Incoming Ticket Data:', req.body);
        const { customer, subject, category, description } = req.body;
        
        const newTicket = new Ticket({
            customer,
            subject,
            category,
            description,
            messages: [{
                sender: customer,
                senderRole: 'Customer',
                message: description
            }]
        });

        await newTicket.save();
        console.log('Ticket Created Successfully:', newTicket._id);
        res.status(201).json(newTicket);
    } catch (error) {
        console.error('Ticket Creation Error Details:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get all tickets for a specific customer
export const getCustomerTickets = async (req, res) => {
    try {
        const { customerId } = req.params;
        const tickets = await Ticket.find({ customer: customerId }).sort({ updatedAt: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all tickets (For Admin)
export const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find()
            .populate('customer', 'displayName phone email')
            .sort({ updatedAt: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a message to a ticket (Chat)
export const addMessage = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { sender, senderRole, message } = req.body;

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        ticket.messages.push({ sender, senderRole, message });
        ticket.lastMessageAt = Date.now();
        
        // Auto update status if admin replies
        if (senderRole === 'Admin' && ticket.status === 'Open') {
            ticket.status = 'In Progress';
        }

        await ticket.save();
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update ticket status
export const updateTicketStatus = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { status } = req.body;

        const ticket = await Ticket.findByIdAndUpdate(
            ticketId, 
            { status }, 
            { new: true }
        );
        
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single ticket details
export const getTicketDetails = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticket = await Ticket.findById(ticketId)
            .populate('customer', 'displayName phone email')
            .populate('messages.sender', 'displayName profileImage');
            
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
