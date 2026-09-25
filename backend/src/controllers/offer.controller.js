import { Offer } from "../models/offer.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const createOffer = asyncHandler(async (req, res, next) => {
    const { resid } = req.params

    const { offerName, offerCode, offerDescription, discountAmount } = req.body
    if (!offerName || !offerCode || !offerDescription || !offerName.trim() || !offerCode.trim() || !offerDescription.trim()) {
        return next(new ApiError(400, "Offer name, code, and description are required"))
    }

    if (Number(discountAmount) <= 0) {
        return next(new ApiError(400, "Discount amount must be greater than zero"))
    }

    const offerLocalPath = req.files?.offerImage?.[0]?.path

    if (!offerLocalPath) {
        return next(new ApiError(400, "Offer image is required"))
    }

    const offerImage = await uploadOnCloudinary(offerLocalPath)

    const offer = await Offer.create({
        restaurantId: resid,
        offerName: offerName.trim(),
        offerCode: offerCode.trim().toUpperCase(),
        offerDescription: offerDescription.trim(),
        discountAmount: Number(discountAmount),
        offerImage: offerImage?.url,
    })

    const createdOffer = await Offer.findById(offer._id)

    if (!createdOffer) {
        return next(new ApiError(500, "Something went wrong while creating offer"))
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdOffer, "Offer created successfully"))
})

const validateOffer = asyncHandler(async (req, res, next) => {
    const { resid } = req.params
    const offerCode = String(req.body.offerCode || "").trim().toUpperCase()

    if (!offerCode) {
        return next(new ApiError(400, "Promo code is required"))
    }

    const offer = await Offer.findOne({ restaurantId: resid, offerCode })
    if (!offer) {
        return next(new ApiError(404, "Promo code does not match an active offer"))
    }

    return res.status(200).json(new ApiResponse(200, {
        offerId: offer._id,
        offerName: offer.offerName,
        offerCode: offer.offerCode,
        discountAmount: offer.discountAmount,
    }, "Promo code applied successfully"))
})

const getOffers = asyncHandler(async (req, res, next) => {
    const { resid } = req.params

    const offers = await Offer.find({ restaurantId: resid }) || []

    return res
        .status(200)
        .json(new ApiResponse(200, offers, "Offers fetched successfully."))
})

const deleteOffer = asyncHandler(async (req, res, next) => {
    const { resid, offerid } = req.params
    const offer = await Offer.findById(offerid)

    if (!offer) {
        return next(new ApiError(404, "Offer not found"))
    }

    if (offer.restaurantId.toString() !== resid) {
        return next(new ApiError(401, "Access denied"))
    }

    await Offer.deleteOne({ _id: offer._id })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Offer deleted successfully."))
})

export {
    createOffer,
    deleteOffer,
    getOffers,
    validateOffer,
}