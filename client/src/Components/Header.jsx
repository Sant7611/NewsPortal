import { Pen, Sun, User, UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [user, setUser] = useState({});
    const [profileData, setProfileData] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    let leaveTimer = null;  // To store the timeout for delaying the profile hide

    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setUser(decoded);
            } catch (error) {
                console.error("Token decoding failed:", error);
                navigate('/login');
            }
        }

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token');
            const response = await fetch("http://localhost:4040/api/user/profile", {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Failed to fetch profile");

            setLoading(true)
            const data = await response.json();
            setProfileData(data.data);
        } catch (error) {
            console.error("Profile fetch error:", error);
            setProfileData(null);
        }
    };

    const handleMouseEnter = () => {
        clearTimeout(leaveTimer);  // Clear the timeout if the mouse enters again
        setShowProfile(true);
        if (!profileData) {
            fetchUserProfile();
        }
    };

    const handleMouseLeave = () => {
        leaveTimer = setTimeout(() => {
            setShowProfile(false);  // Delay hiding the profile
        }, 300);  // 300ms delay before hiding
    };

    const renderUserButton = () => {
        if (user.role === 'admin') {
            return (
                <button
                    className="px-4 py-2 flex items-center space-x-2 cursor-pointer bg-black text-white rounded-3xl text-sm hover:bg-gray-800 transition-colors"
                    onClick={() => navigate('/adminPanel/dashboard')}
                >
                    <UserCog className="w-4 h-4" />
                    <span>Admin</span>
                </button>
            );
        }

        if (user.role === 'journalist') {
            return (
                <button
                    className="px-4 py-2 flex items-center space-x-2 cursor-pointer bg-black text-white rounded-3xl text-sm hover:bg-gray-800 transition-colors"
                    onClick={() => navigate('/createPost')}
                >
                    <Pen className="w-4 h-4" />
                    <span>Write News</span>
                </button>
            );
        }

        return null;
    };

    return (
        <div className="flex justify-between border-b relative">
            {/* Left Section */}
            <div className="flex items-center space-x-6 p-6 border-r-2 border-indigo-950 rounded-md">
                <div className="font-semibold text-xl">Paperio</div>
                <div className="flex items-center space-x-2">
                    <Sun className="w-4 h-4 text-gray-600" />
                    <div className="text-sm text-gray-600">
                        <p className="font-medium">{currentTime.toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
                        <p className="text-xs">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>
            </div>

            {/* Center Section */}
            <div className="flex-1 flex items-center justify-center p-6 border-r-2 border-indigo-950 rounded-md">
                <h1
                    className="text-6xl font-serif font-bold tracking-wide cursor-pointer"
                    onClick={() => navigate(`/homepage`)}
                >
                    BREAKING NEWS PORTAL
                </h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-6 p-6 relative">
                {renderUserButton()}

                <div
                    className="relative inline-block"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <User className="w-6 h-6 text-gray-700" />
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 z-50 animate-fade-in">
                            {profileData ? (
                                <div>
                                    <h2 className="text-lg font-semibold mb-2">User Profile</h2>
                                    <p><span className="font-medium">Name:</span> {profileData.name}</p>
                                    <p><span className="font-medium">Email:</span> {profileData.email}</p>
                                    <p><span className="font-medium">Role:</span> {profileData.role}</p>
                                    <button
                                        className="mt-4 w-full py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                                        onClick={() => {
                                            localStorage.removeItem('token');
                                            navigate('/');
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <p className="text-gray-600 text-sm">Loading profile...</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
