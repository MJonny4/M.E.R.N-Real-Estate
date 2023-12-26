import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function Profile() {
    const { currentUser } = useSelector((state: RootState) => state.user);

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form className="flex flex-col gap-4" action="">
                <img
                    src={currentUser?.avatar}
                    alt={currentUser?.username}
                    className="w-24 h-24 rounded-full object-cover cursor-pointer self-center mt-2"
                />
                <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Username"
                    className="border p-3 rounded-lg"
                />
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    className="border p-3 rounded-lg"
                />
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    className="border p-3 rounded-lg"
                />
                <button
                    type="button"
                    className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
                >
                    Update
                </button>
            </form>
            <div className="flex justify-between mt-5">
                <span className="text-pink-900 cursor-pointer">
                    Delete Account
                </span>
                <span className="text-red-700 cursor-pointer">Sign Out</span>
            </div>
        </div>
    );
}
