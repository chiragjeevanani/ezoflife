import { create } from 'zustand';

const useVendorOrderStore = create((set) => ({
    incomingRequest: null,
    setIncomingRequest: (request) => set({ incomingRequest: request }),
    clearIncomingRequest: () => set({ incomingRequest: null }),
}));

export default useVendorOrderStore;
