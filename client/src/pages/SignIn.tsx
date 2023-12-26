import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    signInSuccess,
    signInFailure,
    signInStart,
} from '../redux/user/userSlice';
import { RootState } from '../redux/store';
import OAuth from '../components/OAuth';

export default function SignIn() {
    const [formData, setFormData] = useState({});

    const { error, loading } = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(signInStart());

        try {
            const res: Response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!data.success) {
                dispatch(signInFailure(data.message));
                return;
            }
            dispatch(signInSuccess(data.user));
            navigate('/');
        } catch (err: unknown) {
            const error = err as Error;
            dispatch(signInFailure(error.message));
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
            {error && (
                <div className="text-red-500 p-3 rounded-lg my-4 bg-red-100">
                    {error}
                </div>
            )}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                    type="email"
                    className="border p-3 rounded-lg"
                    placeholder="email"
                    id="email"
                    onChange={handleChange}
                />
                <input
                    type="password"
                    className="border p-3 rounded-lg"
                    placeholder="password"
                    id="password"
                    onChange={handleChange}
                />
                <button
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Sign In'}
                </button>
                <OAuth />
            </form>
            <div className="flex gap-2 mt-4">
                <p>Don&apos;t have an account?</p>
                <Link to="/signup">
                    <span className="text-blue-700 hover:underline">
                        Sign In
                    </span>
                </Link>
            </div>
        </div>
    );
}
