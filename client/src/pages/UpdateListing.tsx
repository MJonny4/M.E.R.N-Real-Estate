import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { useEffect, useState } from 'react';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateListing() {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const [files, setFiles] = useState<File[]>([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 1,
        discountedPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState<boolean | string>(
        false
    );
    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<boolean | string>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            const response = await fetch(`/api/listing/get/${id}`);
            const data = await response.json();

            if (!data.success) {
                setError(data.message);
                return;
            }

            setFormData(data.listing);
        };

        fetchListing();
    }, []);

    const handleImageSubmit = () => {
        if (
            files.length === 0 ||
            files.length + formData.imageUrls.length > 6
        ) {
            setImageUploadError('You must upload between 1 and 6 images');
            setUploading(false);
            return;
        }

        setUploading(true);
        setImageUploadError(false);
        const promises: Promise<unknown>[] = [];

        files.forEach((file: File) => {
            promises.push(storeImage(file));
        });

        Promise.all(promises)
            .then((urls) => {
                setFormData({
                    ...formData,
                    // @ts-expect-error - I don't know how to fix this
                    imageUrls: formData.imageUrls.concat(urls),
                });
                setImageUploadError(false);
                setUploading(false);
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .catch((error) => {
                if (error) setImageUploadError('Image upload failed (2mb max)');
                setUploading(false);
            });
    };

    const storeImage = async (file: File) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            resolve(downloadURL);
                        }
                    );
                }
            );
        });
    };

    const handleRemoveImage = (index: number) => () => {
        const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
        setFormData({ ...formData, imageUrls: newImageUrls });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        e.preventDefault();

        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id,
            });
        }

        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: (e.target as HTMLInputElement).checked,
            });
        }

        if (
            e.target.type === 'number' ||
            e.target.type === 'text' ||
            e.target.type === 'textarea'
        ) {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (formData.imageUrls.length < 1) {
                setError('You must upload at least one image');
                return;
            }

            // Control regularPrice < discountedPrice
            if (+formData.regularPrice < +formData.discountedPrice) {
                setError('Regular price must be higher than discounted price');
                return;
            }

            setLoading(true);
            setError(false);

            const response = await fetch(`/api/listing/update/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser?._id,
                }),
            });
            const data = await response.json();
            setLoading(false);

            if (!data.success) {
                setError(data.message);
                return;
            }

            navigate(`/listing/${data._id}`);
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message);
        }
    };

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>
                Update listing
            </h1>
            <form
                className='flex flex-col sm:flex-row gap-4'
                onSubmit={handleSubmit}
            >
                <div className='flex flex-col gap-4 flex-1'>
                    <input
                        type='text'
                        name='name'
                        id='name'
                        placeholder='Name'
                        className='border border-gray-300 p-3 rounded-lg'
                        maxLength={62}
                        minLength={10}
                        required
                        onChange={handleChange}
                        value={formData.name}
                    />
                    <textarea
                        name='description'
                        id='description'
                        placeholder='Description'
                        className='border border-gray-300 p-3 rounded-lg'
                        maxLength={256}
                        minLength={10}
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />
                    <input
                        type='text'
                        name='address'
                        id='address'
                        placeholder='Address'
                        className='border border-gray-300 p-3 rounded-lg'
                        minLength={1}
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                name='sale'
                                id='sale'
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.type === 'sale'}
                            />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                name='rent'
                                id='rent'
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.type === 'rent'}
                            />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                name='parking'
                                id='parking'
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.parking}
                            />
                            <span>Parking spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                name='furnished'
                                id='furnished'
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.furnished}
                            />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                name='offer'
                                id='offer'
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.offer === true}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                name='bedrooms'
                                id='bedrooms'
                                min={1}
                                max={10}
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                                onChange={handleChange}
                                value={formData.bedrooms}
                            />
                            <p>Bedrooms</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                name='bathrooms'
                                id='bathrooms'
                                min={1}
                                max={10}
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                                onChange={handleChange}
                                value={formData.bathrooms}
                            />
                            <p>Bathrooms</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                name='regularPrice'
                                id='regularPrice'
                                min={1}
                                max={1000000}
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                                onChange={handleChange}
                                value={formData.regularPrice}
                            />
                            <div className='flex flex-col items-center'>
                                <p>Regular Price</p>
                                <span className='text-xs'>(€ / Month)</span>
                            </div>
                        </div>
                        {formData.offer && (
                            <div className='flex items-center gap-2'>
                                <input
                                    type='number'
                                    name='discountedPrice'
                                    id='discountedPrice'
                                    min={0}
                                    max={1000000}
                                    required
                                    className='p-3 border border-gray-300 rounded-lg'
                                    onChange={handleChange}
                                    value={formData.discountedPrice}
                                />
                                <div className='flex flex-col items-center'>
                                    <p>Discounted Price</p>
                                    <span className='text-xs'>(€ / Month)</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>
                        Images:
                        <span className='font-normal text-gray-600 ml-2'>
                            The first image will be the cover (max 6)
                        </span>
                    </p>
                    <div className='flex gap-4'>
                        <input
                            onChange={(e) =>
                                setFiles(Array.from(e.target.files || []))
                            }
                            className='p-3 border border-gray-300 rounded w-full'
                            type='file'
                            name='images'
                            id='images'
                            accept='image/.*'
                            multiple
                            required
                        />
                        <button
                            disabled={uploading}
                            onClick={handleImageSubmit}
                            type='button'
                            className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    {imageUploadError && (
                        <p className='text-red-700 text-center text-sm'>
                            {imageUploadError}
                        </p>
                    )}
                    {formData.imageUrls.length > 0 &&
                        formData.imageUrls.map((url: string, index) => (
                            <div
                                className='flex justify-between p-3 border items-center'
                                key={url}
                            >
                                <img
                                    src={url}
                                    alt='listing image'
                                    className='w-20 h-20 object-contain rounded-lg'
                                />
                                <button
                                    onClick={handleRemoveImage(index)}
                                    type='button'
                                    className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    <button
                        className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                        type='submit'
                        disabled={loading || uploading}
                    >
                        {loading
                            ? 'Updating listing...'
                            : uploading
                            ? 'Uploading images...'
                            : 'Update listing'}
                    </button>
                    {error && <p className='text-red-700'>{error}</p>}
                </div>
            </form>
        </main>
    );
}
