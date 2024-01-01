import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useEffect, useRef, useState } from 'react';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
    updateUserStart,
    updateUserFailure,
    updateUserSuccess,
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signOutUserStart,
    signOutUserFailure,
    signOutUserSuccess,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

import { ListingType } from '../types/listingType';
interface FormData {
    avatar?: string;
    username?: string;
    email?: string;
    password?: string;
}

export default function Profile() {
    const { currentUser, loading, error } = useSelector(
        (state: RootState) => state.user
    );
    const fileRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [fileUploadPercentage, setFileUploadPercentage] = useState<number>(0);
    const [fileUploadError, setFileUploadError] = useState<boolean | string>(
        false
    );
    const [formData, setFormData] = useState<FormData>({});
    const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
    const [showListingsError, setShowListingsError] = useState<boolean>(false);
    const [userListings, setUserListings] = useState<ListingType[] | null>(
        null
    );

    const dispatch = useDispatch();

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file]);

    const handleFileUpload = async (file: File) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + '-' + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFileUploadPercentage(Math.round(progress));
            },
            (error) => {
                if (error.message) setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFormData({ ...formData, avatar: downloadURL });
                });
            }
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            dispatch(updateUserStart());

            const response = await fetch(
                `/api/user/update/${currentUser?._id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();
            if (!data.success) {
                dispatch(updateUserFailure(data.message));
                return;
            }

            dispatch(updateUserSuccess(data.user));
            setUpdateSuccess(true);
        } catch (err: unknown) {
            const error = err as Error;
            dispatch(updateUserFailure(error.message));
        }
    };

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());
            const response = await fetch(
                `/api/user/delete/${currentUser?._id}`,
                {
                    method: 'DELETE',
                }
            );

            const data = await response.json();
            if (!data.success) {
                dispatch(deleteUserFailure(data.message));
                return;
            }

            dispatch(deleteUserSuccess(data));
        } catch (err: unknown) {
            const error = err as Error;
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleSignOut = async () => {
        try {
            dispatch(signOutUserStart());
            const response = await fetch('/api/auth/signout', {
                method: 'POST',
            });

            const data = await response.json();
            if (!data.success) {
                dispatch(signOutUserFailure(data.message));
                return;
            }

            dispatch(signOutUserSuccess(data));
        } catch (err: unknown) {
            const error = err as Error;
            dispatch(signOutUserFailure(error.message));
        }
    };

    const handleShowListing = async () => {
        try {
            setShowListingsError(false);
            const response = await fetch(
                `/api/user/listings/${currentUser?._id}`,
                {
                    method: 'GET',
                }
            );

            const data = await response.json();
            if (!data.success) {
                setShowListingsError(true);
                return;
            }

            setUserListings(data.listings);
        } catch (err: unknown) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const error = err as Error;
            setShowListingsError(true);
        }
    };

    const handleListingDelete = async (listingId: string) => {
        try {
            const response = await fetch(`/api/listing/delete/${listingId}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (!data.success) {
                return;
            }

            setUserListings((prev) =>
                prev
                    ? prev.filter((listing) => listing._id !== listingId)
                    : null
            );
        } catch (err: unknown) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const error = err as Error;
            console.log(error);
        }
    };

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <input
                    onChange={(e) => {
                        if (e.target.files?.length) {
                            setFile(e.target.files[0]);
                        }
                    }}
                    type='file'
                    ref={fileRef}
                    hidden
                    accept='image/.*'
                />
                <img
                    onClick={() => fileRef.current?.click()}
                    src={formData?.avatar || currentUser?.avatar}
                    alt={currentUser?.username}
                    className='w-24 h-24 rounded-full object-cover cursor-pointer self-center mt-2'
                />
                <p className='text-sm self-center'>
                    {fileUploadError ? (
                        <span className='text-red-700'>
                            Error uploading image
                        </span>
                    ) : fileUploadPercentage > 0 &&
                      fileUploadPercentage < 100 ? (
                        <span className='text-slate-700'>
                            Uploading {fileUploadPercentage}%
                        </span>
                    ) : fileUploadPercentage === 100 ? (
                        <span className='text-green-700'>Upload Success</span>
                    ) : (
                        ''
                    )}
                </p>
                <input
                    type='text'
                    name='username'
                    id='username'
                    placeholder='Username'
                    className='border p-3 rounded-lg'
                    onChange={handleChange}
                    defaultValue={currentUser?.username}
                />
                <input
                    type='email'
                    name='email'
                    id='email'
                    placeholder='Email'
                    className='border p-3 rounded-lg'
                    onChange={handleChange}
                    defaultValue={currentUser?.email}
                />
                <input
                    type='password'
                    name='password'
                    id='password'
                    placeholder='Password'
                    className='border p-3 rounded-lg'
                    onChange={handleChange}
                />
                <button
                    type='submit'
                    className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Update'}
                </button>
                <Link
                    to={'/create-listing'}
                    className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
                >
                    Create Listing
                </Link>
            </form>
            <div className='flex justify-between mt-5'>
                <span
                    className='text-pink-900 cursor-pointer'
                    onClick={handleDeleteUser}
                >
                    Delete Account
                </span>
                <span
                    className='text-red-700 cursor-pointer'
                    onClick={handleSignOut}
                >
                    Sign Out
                </span>
            </div>
            <div className='mt-5 flex justify-center'>
                {updateSuccess && (
                    <span className='text-green-700'>
                        Profile updated successfully!
                    </span>
                )}
                {error && (
                    <span className='text-red-700'>Error updating profile</span>
                )}
            </div>
            <button
                onClick={handleShowListing}
                type='button'
                className='text-green-700'
            >
                Show Listings
            </button>
            {showListingsError && (
                <span className='text-red-700'>Error showing listings</span>
            )}

            {userListings && userListings.length > 0 && (
                <div className='flex flex-col gap-4'>
                    <h2 className='text-center mt-7 text-2xl font-semibold'>
                        Your Listings
                    </h2>
                    {userListings.map((listing) => (
                        <div
                            key={listing._id}
                            className='border rounded-lg p-3 flex justify-between items-center gap-4'
                        >
                            <Link to={`/listing/${listing._id}`}>
                                <img
                                    src={listing.imageUrls[0]}
                                    alt={listing.name}
                                    className='h-16 w-16 object-contain'
                                />
                            </Link>
                            <Link
                                to={`/listing/${listing._id}`}
                                className='flex-1 text-slate-700 font-semibold  hover:underline truncate'
                            >
                                {listing.name}
                            </Link>
                            <div className='flex flex-col items-center'>
                                <button
                                    type='button'
                                    className='text-red-700'
                                    onClick={() =>
                                        handleListingDelete(listing._id)
                                    }
                                >
                                    Delete
                                </button>
                                <button
                                    type='button'
                                    className='text-green-700'
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
