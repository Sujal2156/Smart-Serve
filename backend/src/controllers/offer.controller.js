import { Offer } from "../models/offer.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const createOffer = asyncHandler(async (req, res, next) => {
    const { resid } = req.params

    const { offerName, offerDescription } = req.body
    if (!offerName || !offerDescription || !offerName.trim() || !offerDescription.trim()) {
        return next(new ApiError(400, "Offer name and description are required"))
    }

    const offerLocalPath = req.files?.offerImage?.[0]?.path

    if (!offerLocalPath) {
        return next(new ApiError(400, "Offer image is required"))
    }

    const offerImage = await uploadOnCloudinary(offerLocalPath)

    const offer = await Offer.create({
        restaurantId: resid,
        offerName: offerName.trim(),
        offerDescription: offerDescription.trim(),
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
}