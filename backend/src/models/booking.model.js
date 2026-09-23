import mongoose, { Schema } from "mongoose"

const bookingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    bookingToken: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    reservationDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                return v >= today
            },
            message: "Reservation date must be for today or a future date.",
        },
    },
    reservationTime: {
        type: String,
        required: true,
    },
    numGuests: {
        type: Number,
        required: true,
        min: [1, 'At least one guest is required'],
        max: [20, 'Maximum number of guest is 20'],
    },
    specialRequests: {
        type: String,
        trim: true,
    },
    contactPhone: {
        type: String,
        required: true,
        trim: true,
        match: /^\+?[0-9]{7,15}$/,
    },
    contactEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: /^\S+@\S+\.\S+$/,
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending',
    },
}, { timestamps: true })

bookingSchema.index({
    restaurantId: 1, reservationDate: 1, reservationTime: 1,
})

bookingSchema.index({
    user: 1, reservationDate: 1,
})

export const Booking = mongoose.model('Booking', bookingSchema)