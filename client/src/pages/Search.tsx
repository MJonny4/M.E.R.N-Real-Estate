import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { ListingType } from '../types/listingType';

export default function Search() {
    const [sideBarData, setSideBarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
    });
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState<ListingType[]>([]);
    const [showMore, setShowMore] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('searchTerm');
        const type = urlParams.get('type');
        const parking = urlParams.get('parking');
        const furnished = urlParams.get('furnished');
        const offer = urlParams.get('offer');
        const sort = urlParams.get('sort');
        const order = urlParams.get('order');

        if (
            searchTerm ||
            type ||
            parking ||
            furnished ||
            offer ||
            sort ||
            order
        ) {
            setSideBarData({
                searchTerm: searchTerm ?? '',
                type: type ?? 'all',
                parking: parking === 'true' ? true : false,
                furnished: furnished === 'true' ? true : false,
                offer: offer === 'true' ? true : false,
                sort: sort ?? 'created_at',
                order: order ?? 'desc',
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const response = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await response.json();

            if (data.listings.length > 8) {
                setShowMore(true);
            }

            if (data.success) {
                setListings(data.listings);
                setLoading(false);
            }

            setLoading(false);
        };
        fetchListings();
    }, [location.search]);

    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLSelectElement>
    ) => {
        e.preventDefault();

        if (
            e.target.id === 'all' ||
            e.target.id === 'rent' ||
            e.target.id === 'sale'
        ) {
            setSideBarData({
                ...sideBarData,
                type: e.target.id,
            });
        }

        if (e.target.id === 'searchTerm') {
            setSideBarData({
                ...sideBarData,
                searchTerm: e.target.value,
            });
        }

        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
        ) {
            setSideBarData({
                ...sideBarData,
                [e.target.id]: (e.target as HTMLInputElement).checked,
            });
        }

        if (e.target.id === 'sort_order') {
            const [sort, order] = e.target.value.split('_');
            setSideBarData({
                ...sideBarData,
                sort,
                order,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sideBarData.searchTerm);
        urlParams.set('type', sideBarData.type);
        urlParams.set('parking', sideBarData.parking.toString());
        urlParams.set('furnished', sideBarData.furnished.toString());
        urlParams.set('offer', sideBarData.offer.toString());
        urlParams.set('sort', sideBarData.sort);
        urlParams.set('order', sideBarData.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('startIndex', startIndex.toString());

        const searchQuery = urlParams.toString();
        const response = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await response.json();

        if (data.listings.length < 8) {
            setShowMore(false);
        }

        if (data.success) {
            setListings([...listings, ...data.listings]);
        }
    };

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
                <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                    <div className='flex items-center gap-2'>
                        <label
                            htmlFor='searchTerm'
                            className='whitespace-nowrap font-bold'
                        >
                            Search Term:
                        </label>
                        <input
                            type='text'
                            name='searchTerm'
                            id='searchTerm'
                            placeholder='Search...'
                            className='border border-gray-300 rounded-lg p-3 w-full'
                            value={sideBarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label htmlFor='all' className='font-bold'>
                            Type:
                        </label>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                name='all'
                                id='all'
                                className='w-5'
                                onChange={handleChange}
                                checked={sideBarData.type === 'all'}
                            />
                            <span>Rent & Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                name='rent'
                                id='rent'
                                className='w-5'
                                onChange={handleChange}
                                checked={sideBarData.type === 'rent'}
                            />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                name='sale'
                                id='sale'
                                className='w-5'
                                onChange={handleChange}
                                checked={sideBarData.type === 'sale'}
                            />
                            <span>Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                name='offer'
                                id='offer'
                                className='w-5'
                                onChange={handleChange}
                                checked={sideBarData.offer === true}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label htmlFor='all' className='font-bold'>
                            Ameneties:
                        </label>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                name='parking'
                                id='parking'
                                className='w-5'
                                onChange={handleChange}
                                checked={sideBarData.parking === true}
                            />
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                name='furnished'
                                id='furnished'
                                className='w-5'
                                onChange={handleChange}
                                checked={sideBarData.furnished === true}
                            />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className=''>
                        <label htmlFor='sort_order' className='font-bold'>
                            Sort:{' '}
                        </label>
                        <select
                            name='sort_order'
                            id='sort_order'
                            className='border border-gray-300 rounded-lg p-3'
                            onChange={handleChange}
                            defaultValue='created_at_desc'
                        >
                            <option value='regularPrice_desc'>
                                Price: High to Low
                            </option>
                            <option value='regularPrice_asc'>
                                Price: Low to High
                            </option>
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option>
                        </select>
                    </div>
                    <button
                        type='submit'
                        className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
                    >
                        Search
                    </button>
                </form>
            </div>
            <div className='flex-1'>
                <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
                    Listing Results
                </h1>
                <div className='p-7 flex flex-wrap gap-4'>
                    {!loading && listings.length === 0 && (
                        <p className='text-xl text-center text-slate-700 w-full'>
                            No listings found.
                        </p>
                    )}
                    {loading && (
                        <p className='text-xl text-center text-slate-700 w-full'>
                            Loading...
                        </p>
                    )}
                    {!loading &&
                        listings &&
                        listings.map((listing: ListingType) => (
                            <ListingItem key={listing._id} listing={listing} />
                        ))}
                </div>
                {showMore && (
                    <button
                        type='button'
                        onClick={() => {
                            onShowMoreClick();
                        }}
                        className='text-green-700 hover:underline p-7 text-center w-full'
                    >
                        Show More
                    </button>
                )}
            </div>
        </div>
    );
}
