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

        await listing.deleteOne(); // or listing.remove() if you're using an older version of Mongoose

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

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer; // false, true, or undefined
        if (offer === 'false' || offer === undefined) {
            offer = {
                $in: [false, true],
            };
        }

        let furnished = req.query.furnished; // false, true, or undefined
        if (furnished === 'false' || furnished === undefined) {
            furnished = {
                $in: [false, true],
            };
        }

        let parking = req.query.parking; // false, true, or undefined
        if (parking === 'false' || parking === undefined) {
            parking = {
                $in: [false, true],
            };
        }

        let type = req.query.type; // sale, rent, undefined or all
        if (type === undefined || type === 'all') {
            type = {
                $in: ['sale', 'rent'],
            };
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        return res.status(200).json({
            success: true,
            listings,
        });
    } catch (error) {
        next(error);
    }
};
