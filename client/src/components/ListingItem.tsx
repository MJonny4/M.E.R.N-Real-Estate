import { ListingType } from '../types/listingType';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBath, FaBed } from 'react-icons/fa6';

export default function ListingItem({ listing }: { listing: ListingType }) {
    return (
        <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-80'>
            <Link to={`/listing/${listing._id}`}>
                <img
                    src={listing.imageUrls[0]}
                    alt={listing.name}
                    className='h-80 sm:h-56 w-full object-cover hover:scale-105 transition-all duration-300'
                />
                <div className='p-3 flex flex-col gap-2 w-full'>
                    <p className='text-slate-700 font-bold text-lg truncate'>
                        {listing.name}
                    </p>
                    <div className='flex items-center gap-1'>
                        <MdLocationOn className='h-4 w-h4 text-green-700' />
                        <p className='text-sm text-gray-600 truncate'>
                            {listing.address}
                        </p>
                    </div>
                    <p className='text-sm text-gray-600 line-clamp-2'>
                        {listing.description}
                    </p>
                    <p className='text-slate-500 mt-2 font-semibold'>
                        {listing.offer
                            ? listing.discountedPrice.toLocaleString('es-ES', {
                                  style: 'currency',
                                  currency: 'EUR',
                              })
                            : listing.regularPrice.toLocaleString('es-ES', {
                                  style: 'currency',
                                  currency: 'EUR',
                              })}
                        {listing.type === 'rent' ? ' / month' : ''}
                    </p>
                    <div className='flex gap-4 text-md text-gray-700'>
                        <div className='flex items-center gap-1'>
                            <FaBed />
                            <span>{listing.bedrooms}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <FaBath />
                            <span>{listing.bathrooms}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
