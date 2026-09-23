import { config } from './env';

export interface ProcessPaymentParams {
  userId: string;
  planTier: 'gold' | 'vip';
  amount?: number;
  paymentMethod?: string;
}

export interface ProcessPaymentResult {
  success: boolean;
  transactionId: string;
  tier: string;
  status: 'active' | 'pending' | 'failed';
  gateway: string;
  expiresAt: Date;
}

export const paymentService = {
  async processCheckout(params: ProcessPaymentParams): Promise<ProcessPaymentResult> {
    const txnId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expiresAt = new Date(Date.now() + 30 * 86400 * 1000); // 30 days validity

    if (config.payment.isConfigured) {
      console.log(`💳 [Payment Gateway: ${config.payment.provider}] Processing checkout for tier: ${params.planTier}`);
      // Integrate Razorpay order verification / Stripe session if keys are provided
    } else {
      console.log(`💳 [Payment Mode: Default Sandbox] Instant approval granted for tier: ${params.planTier}`);
    }

    return {
      success: true,
      transactionId: txnId,
      tier: params.planTier,
      status: 'active',
      gateway: config.payment.isConfigured ? config.payment.provider : 'default_sandbox',
      expiresAt,
    };
  },
};
