import { ListingType } from '../types/listingType';

export default function Contact({ listing }: { listing: ListingType }) {
    return (
        <>
        {/* #TODO: Fix this */}
            <h2>Contact</h2>
            <p>{listing.name}</p>
        </>
    );
}
