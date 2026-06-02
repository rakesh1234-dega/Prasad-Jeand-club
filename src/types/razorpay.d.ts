declare module 'razorpay' {
  interface RazorpayOptions {
    key_id: string;
    key_secret: string;
  }

  interface OrderCreateOptions {
    amount: number;
    currency: string;
    receipt?: string;
    notes?: Record<string, string>;
  }

  interface RazorpayOrder {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    created_at: number;
  }

  interface Orders {
    create(options: OrderCreateOptions): Promise<RazorpayOrder>;
  }

  class Razorpay {
    constructor(options: RazorpayOptions);
    orders: Orders;
  }

  export = Razorpay;
}
