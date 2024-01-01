import { useEffect, useState } from 'react';
import { ListingType } from '../types/listingType';
import { Link } from 'react-router-dom';

interface User {
    username: string;
    email: string;
    password: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
}

export default function Contact({ listing }: { listing: ListingType }) {
    const [landlord, setLandlord] = useState<User | null>(null);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const response = await fetch(`/api/user/${listing.userRef}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                if (!data.success) {
                    return;
                }

                setLandlord(data.user);
            } catch (err: unknown) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const error = err as Error;
            }
        };

        fetchLandlord();
    }, [listing.userRef]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    return (
        <>
            {landlord && (
                <div className='flex flex-col gap-2'>
                    <p>
                        Contact:{' '}
                        <span className='font-bold'>{landlord.username}</span>{' '}
                        for{' '}
                        <span className='font-semibold'>{listing.name}</span>
                    </p>
                    <textarea
                        name='message'
                        id='message'
                        rows={2}
                        onChange={handleChange}
                        value={message}
                        placeholder='Message...'
                        className='w-full border border-gray-300 rounded-lg p-3'
                    ></textarea>
                    <Link
                        to={`mailto:${landlord.email}?subject=Regarding%20${listing.name}&body=${message}`}
                        className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
                    >
                        Send Message
                    </Link>
                </div>
            )}
        </>
    );
}
