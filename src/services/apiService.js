const API_BASE_URL = 'http://127.0.0.1:8000/api';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
};

export const apiService = {
    async registerVisitor(visitorData) {
        const response = await fetch(`${API_BASE_URL}/visitors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(visitorData),
        });
        return handleResponse(response);
    },

    async getAllVisitors() {
        const response = await fetch(`${API_BASE_URL}/visitors`);
        return handleResponse(response);
    },

    async getDashboardStats() {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
        return handleResponse(response);
    },

    async checkRequestStatus(id) {
        const response = await fetch(`${API_BASE_URL}/visitors/${id}`);
        const data = await handleResponse(response);
        return { success: true, status: data.data.status };
    },

    async getRequestDetails(id) {
        const response = await fetch(`${API_BASE_URL}/visitors/${id}`);
        return handleResponse(response);
    },

    async approveVisitor(id) {
        const response = await fetch(`${API_BASE_URL}/visitors/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'approved' }),
        });
        return handleResponse(response);
    },

    async rejectVisitor(id) {
        const response = await fetch(`${API_BASE_URL}/visitors/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'rejected' }),
        });
        return handleResponse(response);
    },

    async verifyOTP(otp) {
        await delay(1200);
        if (otp === '1234') return { success: true, message: "OTP Verified successfully." };
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
