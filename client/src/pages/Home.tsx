import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ListingType } from '../types/listingType';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '@components/ListingItem';

export default function Home() {
    const [offerListings, setOfferListings] = useState([]);
    const [saleListings, setSaleListings] = useState([]);
    const [rentListings, setRentListings] = useState([]);
    SwiperCore.use([Navigation]);

    useEffect(() => {
        const fetchOfferListings = async () => {
            try {
                const response = await fetch(
                    '/api/listing/get?offer=true&limit=4'
                );
                const data = await response.json();

                if (data.success) {
                    setOfferListings(data.listings);
                }
                fetchRentListings();
            } catch (err: unknown) {
                const error = err as Error;
                console.log(error.message);
            }
        };

        const fetchRentListings = async () => {
            try {
                const response = await fetch(
                    `/api/listing/get?type=rent&limit=4`
                );
                const data = await response.json();

                if (data.success) {
                    setRentListings(data.listings);
                }
                fetchSaleListings();
            } catch (err: unknown) {
                const error = err as Error;
                console.log(error.message);
            }
        };

        const fetchSaleListings = async () => {
            try {
                const response = await fetch(
                    `/api/listing/get?type=sale&limit=4`
                );
                const data = await response.json();

                if (data.success) {
                    setSaleListings(data.listings);
                }
            } catch (err: unknown) {
                const error = err as Error;
                console.log(error.message);
            }
        };

        fetchOfferListings();
    }, []);

    return (
        <main>
            <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
                <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
                    Find your next{' '}
                    <span className='text-slate-500'>perfect</span>
                    <br /> place with ease
                </h1>
                <div className='text-gray-400 text-xs sm:text-base lg:text-lg'>
                    Munti Estates is the best place your next perfect place to
                    live.
                </div>
                <Link
                    to={'/search'}
                    className='text-xs sm:text-base text-blue-800 font-bold hover:underline lg:text-lg'
                >
                    Let&apos;s Start now
                </Link>
            </div>
            <Swiper navigation>
                {offerListings &&
                    offerListings.length > 0 &&
                    offerListings.map((listing: ListingType) => (
                        <SwiperSlide key={listing._id}>
                            <div
                                style={{
                                    backgroundImage: `url(${listing.imageUrls[0]})`,
                                }}
                                className='h-[500px] object-cover bg-center bg-no-repeat bg-cover'
                            ></div>
                        </SwiperSlide>
                    ))}
            </Swiper>
            <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
                {offerListings && offerListings.length > 0 && (
                    <div className=''>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>
                                Recent Offers
                            </h2>
                            <Link
                                to='/search?offer=true'
                                className='text-sm text-blue-800 hover:underline'
                            >
                                Show more offers
                            </Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {offerListings.map((listing: ListingType) => (
                                <ListingItem
                                    key={listing._id}
                                    listing={listing}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {/* rent */}
                {rentListings && rentListings.length > 0 && (
                    <div className=''>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>
                                Recent Rentals
                            </h2>
                            <Link
                                to='/search?type=rent'
                                className='text-sm text-blue-800 hover:underline'
                            >
                                Show more rentals
                            </Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {rentListings.map((listing: ListingType) => (
                                <ListingItem
                                    key={listing._id}
                                    listing={listing}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {/* sale */}
                {saleListings && saleListings.length > 0 && (
                    <div className=''>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>
                                Recent Sales
                            </h2>
                            <Link
                                to='/search?type=sale'
                                className='text-sm text-blue-800 hover:underline'
                            >
                                Show more sales
                            </Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {saleListings.map((listing: ListingType) => (
                                <ListingItem
                                    key={listing._id}
                                    listing={listing}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
