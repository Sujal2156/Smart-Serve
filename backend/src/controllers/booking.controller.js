import { Booking } from "../models/booking.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import crypto from "crypto"


// generate unique booking number
const generateBookingToken = async () => {
    try {
        let unique = false
        let token
        while (!unique) {
            token = crypto.randomInt(10000000, 100000000)
            const existingBooking = await Booking.findOne({ bookingToken: token })

            if (!existingBooking) {
                unique = true
            }
        }
        return token
    } catch (err) {
        throw new ApiError(500, "Something went wrong while generating booking number")
    }
}

// Book table function -- User access 
const bookTable = asyncHandler(async (req, res, next) => {
    const { resid } = req.params

    let { name, reservationDate, reservationTime, numGuests, specialRequests, contactPhone, contactEmail } = req.body

    if (
        [name, reservationDate, reservationTime, contactPhone, contactEmail].some((field) => field?.trim() === "")
    ) { return next(new ApiError(400, "All fields are required")) }

    contactPhone = String(contactPhone || "").replace(/[\s\-()]/g, "")
    contactEmail = String(contactEmail || "").trim().toLowerCase()

    if (!numGuests || numGuests < 1 || numGuests > 20) {
        return next(new ApiError(400, "Number of guests must be between 1 and 20"));
    }

    let parsedDate = reservationDate;
    if (typeof reservationDate === 'string' && reservationDate.includes('/')) {
        const [d, m, y] = reservationDate.split('/');
        parsedDate = new Date(Number(y), Number(m) - 1, Number(d));
    } else if (typeof reservationDate === 'string') {
        parsedDate = new Date(reservationDate);
    }

    const existedBooking = await Booking.findOne({
        restaurantId: resid,
        reservationDate: parsedDate,
        reservationTime,
        status: { $ne: 'Cancelled' },
        $or: [{ contactEmail }, { contactPhone }, { user: req.user._id }]
    })

    if (existedBooking) {
        return next(new ApiError(409, "You already have an active booking for this date and time slot"))
    }

    const bookingToken = await generateBookingToken()

    const booking = await Booking.create({
        user: req.user._id,
        restaurantId: resid,
        bookingToken,
        name,
        contactEmail,
        contactPhone,
        numGuests,
        reservationDate: parsedDate,
        reservationTime,
        specialRequests,
    })

    const createdBooking = await Booking.findById(booking._id)

    if (!createdBooking) {
        return next(new ApiError(500, "Something went wrong while booking table"))
    }

    // send booking confirmation mail

    return res
        .status(201)
        .json(new ApiResponse(201, createdBooking, "Table booked successfully"))
})

// User cancel boking(Table)   @User only
const cancelBookTable = asyncHandler(async (req, res, next) => {
    const { resid, bookingid } = req.params
    const userId = req.user?._id

    const booking = await Booking.findOne({ _id: bookingid, user: userId, restaurantId: resid })

    if (!booking) {
        return next(new ApiError(404, "Booking not found"))
    }

    if (booking.reservationDate < new Date()) {
        return next(new ApiError(400, "Past booking cannot be cancelled"))
    }

    booking.status = 'Cancelled'
    await booking.save({ validateBeforeSave: false })

    // send cancellation mail

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Booking cancelled successfully"))
})

// restaurant owner access
const cancelBooking = asyncHandler(async (req, res, next) => {
    const { bookingid } = req.params

    const booking = await Booking.findById(bookingid)

    if (!booking) {
        return next(new ApiError(404, "Booking not found"))
    }

    if (booking.reservationDate < new Date()) {
        return next(new ApiError(400, "Past booking cannot cancelled"))
    }

    // if (booking.status === 'Confirmed') {
    //     throw new ApiError(400, "Confirmed booking cannot be cancelled")
    // }

    await Booking.deleteOne({ _id: bookingid })

    // send cancellation mail

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Booking cancelled successfully"))

})

// update booking status
const updateBookingStatus = asyncHandler(async (req, res, next) => {
    const { bookingid } = req.params

    const booking = await Booking.findById(bookingid)

    if (!booking) {
        return next(new ApiError(404, "Booking not found"))
    }

    if (booking.status === 'Confirmed') {
        return next(new ApiError(402, "Booking is already confirmed"))
    }

    if (booking.status === 'Cancelled') {
        return next(new ApiError(400, "Cancelled booking cannot be confirmed"))
    }

    if (booking.status === 'Pending') {
        booking.status = 'Confirmed'

        // send confirmation mail
    }
    await booking.save({ validateBeforeSave: false })

    const updatedBooking = await Booking.findOne({ bookingToken: booking.bookingToken })

    return res
        .status(200)
        .json(new ApiResponse(200, updatedBooking, "Booking Confirmed successfully"))
})

// User access: Get all bookings with restaurant details
const getBookingsByUserId = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    // Fetch bookings for the specified user and populate restaurant details
    const bookings = await Booking.find({ user: userId })
        .populate({
            path: 'restaurantId',
            select: 'name address phoneNumber rating avatar',
        })
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, bookings || [], bookings && bookings.length > 0 ? "Bookings fetched successfully" : "No bookings found for this user"));
});


const getAllBookings = asyncHandler(async (req, res, next) => {
    const { resid } = req.params;
    const { date } = req.query;

    const targetResId = (resid && resid !== "undefined" && resid !== "null") ? resid : req.user?.restaurantId;
    const query = targetResId ? { restaurantId: targetResId } : {};

    if (date) {
        const [day, month, year] = date.split('/');
        const searchDate = new Date(year, month - 1, day);
        query.reservationDate = {
            $gte: searchDate,
            $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000),
        };
    }

    const allBookings = await Booking.find(query).sort({ reservationDate: -1 });

    // Return 200 OK with empty list when no bookings exist for the query
    return res
        .status(200)
        .json(new ApiResponse(200, allBookings, allBookings.length === 0 ? "No bookings found" : "All bookings fetched successfully"));
});


export {
    bookTable,
    updateBookingStatus,
    cancelBookTable,
    cancelBooking,
    getAllBookings,
    getBookingsByUserId,
}