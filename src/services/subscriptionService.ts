import api from '../lib/api';

/**
 * Get subscription plans
 */
export const getPlans = async () => {
    const response = await api.get('/api/subscription/plans');
    return response.data;
};

/**
 * Create Razorpay order
 */
export const createOrder = async (planId: string) => {
    const response = await api.post('/api/subscription/create-order', { planId });
    return response.data;
};

/**
 * Verify payment
 */
export const verifyPayment = async (paymentData: {
    orderId: string;
    paymentId: string;
    signature: string;
    planId: string;
}) => {
    const response = await api.post('/api/subscription/verify-payment', paymentData);
    return response.data;
};

/**
 * Get current subscription
 */
export const getCurrentSubscription = async () => {
    const response = await api.get('/api/subscription/current');
    return response.data;
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async () => {
    const response = await api.post('/api/subscription/cancel');
    return response.data;
};

/**
 * Get usage statistics
 */
export const getUsage = async () => {
    const response = await api.get('/api/subscription/usage');
    return response.data;
};
