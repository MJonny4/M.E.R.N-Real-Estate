import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { ListingType } from '../types/listingType';

export default function Listing() {
    const [listing, setListing] = useState<ListingType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const { id } = useParams<{ id: string }>();
    SwiperCore.use([Navigation]);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/listing/get/${id}`);

                const data = await response.json();
                if (!data.success) {
                    setError(true);
                    setLoading(false);
                    return;
                }

                setListing(data.listing);
                setLoading(false);
            } catch (err: unknown) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const error = err as Error;
                setError(true);
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && (
                <p className='text-center my-7 text-2xl'>
                    Error loading listing
                </p>
            )}
            {listing && !loading && !error && (
                <>
                    <Swiper navigation>
                        {listing.imageUrls.map((image, index) => (
                            <SwiperSlide key={index}>
                                {/* <img
                                    src={image}
                                    alt={listing.name}
                                    className='w-full'
                                /> */}
                                <div
                                    className={`h-[550px] bg-cover bg-center bg-no-repeat`}
                                    style={{
                                        backgroundImage: `url(${image})`,
                                    }}
                                ></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </>
            )}
        </main>
    );
}
