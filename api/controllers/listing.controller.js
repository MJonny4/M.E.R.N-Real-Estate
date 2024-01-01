import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json({
            success: true,
            listing,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found'));
        }

        if (req.user.id !== listing.userRef.toString()) {
            return next(
                errorHandler(
                    401,
                    'You are not authorized to delete this listing'
                )
            );
        }

        await listing.remove();
        return res.status(200).json({
            success: true,
            message: 'Listing deleted successfully',
            listing,
        });
    } catch (error) {
        next(error);
    }
};

export const updateListing = async (req, res, next) => {
    try {
        let listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found'));
        }

        if (req.user.id !== listing.userRef.toString()) {
            return next(
                errorHandler(
                    401,
                    'You are not authorized to update this listing'
                )
            );
        }

        listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        return res.status(200).json({
            success: true,
            message: 'Listing updated successfully',
            listing,
        });
    } catch (error) {
        next(error);
    }
};

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found'));
        }

        return res.status(200).json({
            success: true,
            listing,
        });
    } catch (error) {
        next(error);
    }
};
