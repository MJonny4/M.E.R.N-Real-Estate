import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res: Response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                return navigate('/signin');
            }
            setError(data.message);
            setLoading(false);
        } catch (err: unknown) {
            setLoading(false);

            const error = err as Error;
            setError(error.message || 'Something went wrong');
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
            {error && (
                <div className="text-red-500 p-3 rounded-lg my-4 bg-red-100">
                    {error}
                </div>
            )}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="border p-3 rounded-lg"
                    placeholder="username"
                    id="username"
                    onChange={handleChange}
                />
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
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>
                <OAuth />
            </form>
            <div className="flex gap-2 mt-4">
                <p>Already have an account?</p>
                <Link to="/signin">
                    <span className="text-blue-700 hover:underline">
                        Sign In
                    </span>
                </Link>
            </div>
            
        </div>
    );
}
