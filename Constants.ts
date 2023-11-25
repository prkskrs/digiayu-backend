const Constants = {
  ORDER_STATUS: {
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled',
    PREPARING: 'preparing',
    DELIVERED: 'delivered',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    READY_FOR_PICKUP: 'ready_for_pickup',
  },

  COLLECTIONS: {
    USER: 'user',
    DOCTOR: 'doctor',
    PATIENT: 'patient',
    OTP: 'otp',
    APPOINTMENT: 'appointment',
    DIAGNOSIS: 'diagnosis',
    MEDICINE: 'medicine',
    PRODUCT: 'product',
    CATEGORY: 'category',
    SUB_CATEGORIES: 'sub_categories',
    ORDER: 'order',
    USER_WALLET: 'user_wallet',
    PAYMENT: 'payment',
    CART: 'cart',
    OFFERS: 'offers',
  },
} as const;
export default Constants;
