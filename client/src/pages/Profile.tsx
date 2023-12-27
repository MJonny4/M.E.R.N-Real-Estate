import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useEffect, useRef, useState } from 'react';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';

export default function Profile() {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const fileRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [fileUploadPercentage, setFileUploadPercentage] = useState<number>(0);
    const [fileUploadError, setFileUploadError] = useState<boolean | string>(
        false
    );
    const [formData, setFormData] = useState({});

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

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form className='flex flex-col gap-4' action=''>
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
                    src={currentUser?.avatar}
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
                        ""
                    )}
                </p>
                <input
                    type='text'
                    name='username'
                    id='username'
                    placeholder='Username'
                    className='border p-3 rounded-lg'
                />
                <input
                    type='email'
                    name='email'
                    id='email'
                    placeholder='Email'
                    className='border p-3 rounded-lg'
                />
                <input
                    type='password'
                    name='password'
                    id='password'
                    placeholder='Password'
                    className='border p-3 rounded-lg'
                />
                <button
                    type='button'
                    className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
                >
                    Update
                </button>
            </form>
            <div className='flex justify-between mt-5'>
                <span className='text-pink-900 cursor-pointer'>
                    Delete Account
                </span>
                <span className='text-red-700 cursor-pointer'>Sign Out</span>
            </div>
        </div>
    );
}
