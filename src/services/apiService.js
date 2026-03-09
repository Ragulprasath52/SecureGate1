const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock database to hold request states: waiting, approved, denied
const mockRequests = {};

export const apiService = {
    async registerVisitor(data) {
        await delay(1000);
        const requestId = Date.now().toString();
        const timestamp = new Date().toLocaleTimeString();

        mockRequests[requestId] = {
            id: requestId,
            ...data,
            timestamp,
            status: 'waiting'
        };

        const approvalLink = `${window.location.origin}/resident/approve/${requestId}`;

        return {
            success: true,
            message: "Visitor registered successfully.",
            data: {
                requestId,
                approvalLink
            }
        };
    },

    async checkRequestStatus(requestId) {
        // no artificial delay to make polling snappy
        const req = mockRequests[requestId];
        if (!req) throw new Error('Request not found');
        return { success: true, status: req.status };
    },

    async getRequestDetails(requestId) {
        await delay(500);
        const req = mockRequests[requestId];
        if (!req) throw new Error('Request not found');
        return { success: true, data: req };
    },

    async approveVisitor(requestId) {
        await delay(1000);
        if (mockRequests[requestId]) {
            mockRequests[requestId].status = 'approved';
        }
        return { success: true, message: "Request approved." };
    },

    async rejectVisitor(requestId) {
        await delay(1000);
        if (mockRequests[requestId]) {
            mockRequests[requestId].status = 'denied';
        }
        return { success: true, message: "Request rejected." };
    },

    async verifyOTP(otp) {
        await delay(1200);
        if (otp === '1234') {
            return { success: true, message: "OTP Verified successfully." };
        }
        throw new Error('Invalid OTP');
    },

    async verifyQR(qrData) {
        await delay(1200);
        return { success: true, message: "QR Code Verified successfully." };
    },

    async openGate() {
        await delay(2000);
        return { success: true, message: "Gate Opened." };
    },

    async recordExit(method) {
        await delay(1000);
        return { success: true, message: "Exit recorded successfully." };
    }
};
