import { Order } from "../models/order.model.js"
import { Restaurant } from "../models/restaurant.models.js"
import { Menu } from "../models/menu.models.js"
import { Offer } from "../models/offer.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import crypto from "crypto"

// generate unique order number
const generateOrderToken = async () => {
    try {
        let unique = false
        let token
        while (!unique) {
            token = crypto.randomInt(10000000, 100000000)
            const existingOrder = await Order.findOne({ orderNo: token })

            if (!existingOrder) {
                unique = true
            }
        }
        return token
    } catch (err) {
        throw new ApiError(500, "Something went wrong while generating order number")
    }
}

// Place order controller   @CUSTOMER
const placeOrder = asyncHandler(async (req, res, next) => {
    const { resid } = req.params
    const { items, taxPrice, totalPrice, serviceCharge, restaurantId, tableNumber, remarks, promoCode } = req.body

    if (!req.user?._id) {
        return next(new ApiError(401, "Please login before placing an order"));
    }

    if (!remarks?.trim()) {
        return next(new ApiError(400, "Remark is required to place an order"));
    }

    let appliedOffer = null;
    const normalizedPromoCode = String(promoCode || "").trim().toUpperCase();
    if (normalizedPromoCode) {
        appliedOffer = await Offer.findOne({ restaurantId: restaurantId, offerCode: normalizedPromoCode });
        if (!appliedOffer) {
            return next(new ApiError(400, "Promo code does not match an active offer"));
        }
    }

    let targetResId = resid && resid !== "undefined" && resid !== "null" ? resid : restaurantId;

    if (!targetResId && items && items.length > 0) {
        const menuId = items[0].menu || items[0].id || items[0]._id;
        if (menuId) {
            const menuItem = await Menu.findById(menuId);
            if (menuItem) {
                targetResId = menuItem.restaurantId;
            }
        }
    }

    if (!targetResId) {
        const defaultRest = await Restaurant.findOne();
        if (defaultRest) {
            targetResId = defaultRest._id;
        }
    }

    if (!targetResId) {
        return next(new ApiError(400, "Restaurant ID is required to place order"));
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
        return next(new ApiError(400, "No valid items in order"))
    }

    const hasInvalidItems = items.some(item => !item.quantity || Number(item.quantity) <= 0 || (item.price !== undefined && Number(item.price) < 0));
    if (hasInvalidItems) {
        return next(new ApiError(400, "Invalid item quantity or price in order"));
    }

    const orderNo = await generateOrderToken()

    const resolvedItems = await Promise.all(
        items.map(async (item) => {
            const menuId = item.menu || item.id || item._id;
            let itemName = item.name || item.itemName;
            let itemPrice = item.price;
            if (!itemName || itemPrice === undefined) {
                const menuItem = await Menu.findById(menuId);
                if (menuItem) {
                    itemName = itemName || menuItem.itemName;
                    itemPrice = itemPrice !== undefined ? itemPrice : menuItem.price;
                }
            }
            return {
                ...item,
                name: itemName || "SmartServe Specialty",
                price: Number(itemPrice) || 0,
                menu: menuId,
            };
        })
    );

    const promoDiscount = appliedOffer?.discountAmount || 0;
    const finalTotalPrice = Math.max(Number(totalPrice || 0) - promoDiscount, 0);

    const order = await Order.create({
        user: req.user._id,
        restaurantId: targetResId,
        tableNumber: tableNumber || "",
        remarks: remarks.trim(),
        customerPhone: req.user.phoneNumber || "",
        promoCode: normalizedPromoCode,
        promoOfferId: appliedOffer?._id,
        promoDiscount,
        orderNo,
        items: resolvedItems,
        taxPrice: taxPrice || 0,
        totalPrice: finalTotalPrice,
        serviceCharge: serviceCharge || 0,
    })

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        targetResId,
        { $push: { orders: order._id } },
        { new: true }
    );

    const placedOrder = await Order.findById(order._id)

    if (!placedOrder) {
        return next(new ApiError(500, "Something went wrong while placing order"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {placedOrder, updatedRestaurant}, "Order placed successfully"))

})

// Get Order           @USER only
const getMyOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user?._id })

    if (!orders) {
        return next(new ApiError(400, "No orders found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, orders, "Orders fetched successfully."))
})

// Get Order by ID           @USER only
const getOrderById = asyncHandler(async (req, res, next) => {
    const { orderid } = req.params
    const order = await Order.findById(orderid)

    if (!order) {
        return next(new ApiError(404, "Order not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order fetched successfully."))
})

// Get All Orders           @ADMIN only
const getOrders = asyncHandler(async (req, res, next) => {
    const resId = req.params.resid || req.user?.restaurantId;
    
    let filter = {};
    if (resId && resId !== "undefined") {
        filter = { restaurantId: resId };
    } else if (req.user?.restaurantId) {
        filter = { restaurantId: req.user.restaurantId };
    }

    const orders = await Order.find(filter)
        .populate("user", "fullName email phoneNumber")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, orders, "Orders fetched successfully."))
})

// Add additional item           @USER Only
const addItem = asyncHandler(async (req, res, next) => {
    const { orderid } = req.params
    const { items } = req.body

    const order = await Order.findById(orderid)

    if (!order) {
        return next(new ApiError(404, "Order not found"))
    }

    order.items.push(...items.map((item) => ({
        ...item,
        menu: item._id,
    })));

    order.totalPrice += items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (order.orderStatus === 'Served') {
        order.orderStatus = 'Pending'
    }

    await order.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order added successfully."))
})

// Update Order status           @ADMIN only
const updateOrderStatus = asyncHandler(async (req, res, next) => {
    const { orderid } = req.params
    const status = req.body.status || req.body.orderStatus

    const order = await Order.findById(orderid)

    if (!order) {
        return next(new ApiError(404, "Order not found"))
    }

    if (order.orderStatus === status) {
        return next(new ApiError(400, `Order is already ${order.orderStatus}`))
    }

    order.orderStatus = status
    await order.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Status updated successfully."))
})

const updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const { orderid } = req.params;

    // Find and update the order's status
    const order = await Order.findById(orderid);

    if (!order) {
        return next(new ApiError(404, "Order not found"));
    }

    // Set order properties to reflect payment
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentMethod = 'PayPal'

    // Destructure payment result from request body
    const { id, status, update_time, email_address } = req.body;
    order.paymentResult = {
        id,
        status,
        update_time,
        email_address,
    };

    // Save the updated order
    const updatedOrder = await order.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, updatedOrder, "Order updated to Paid successfully."));
});

export {
    placeOrder,             // user
    getMyOrders,           // user
    addItem,             // user
    getOrders,            // restaurant owner
    updateOrderStatus,  // restaurant owner
    updateOrderToPaid,   // private
    getOrderById,        // user
}