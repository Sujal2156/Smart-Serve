import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Restaurant",
    },
    tableNumber: {
      type: String,
      trim: true,
      default: "",
    },
    remarks: {
      type: String,
      trim: true,
      default: "",
    },
    promoCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },
    promoOfferId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
    },
    promoDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
    customerPhone: {
      type: String,
      trim: true,
      default: "",
    },
    orderNo: {
      type: String,
      required: true,
      unique: true,
    },
    items: [
      {
        menu: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Menu",
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
      },
    ],
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    serviceCharge: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Recieved', 'Received', 'Served'],
      default: 'Pending',
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Cash', 'Card', 'Online', 'PayPal'],
      default: 'Cash',
    },
    paymentResult: {
      id: {type: String},
      status: {type: String},
      update_time: {type: String},
      email_address: {type: String},
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model('Order', orderSchema)