import { House, Newspaper, ShieldUser } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminPanelNavbar() {
    const adminNavbar = ["Dashboard", "Users", "News"];
    const navigate = useNavigate();
    const admin = {
        name: "Admin Name",
        email: "admin@admin.com",
    };

    return (
        <div className="m-7">
            <div className="flex space-x-7 justify-between shadow-lg rounded-3xl p-5 my-6">

                {/* Admin Info */}
                <div>
                    <ShieldUser className="mb-1" />
                    <h1 className="font-bold">{admin.name}</h1>
                    <p className="font-bold text-sm text-gray-600">{admin.email}</p>
                </div>

                {/* Admin Panel Title */}
                <div className="flex items-center space-x-7">
                    <h1 className="text-6xl font-bold tracking-widest">ADMIN PANEL</h1>
                    <Newspaper className="size-[54px]" />
                </div>

                {/* Navbar */}
                <nav>
                    <ul className="flex space-x-4 items-center">
                        <li>
                            <House
                                className="cursor-pointer hover:text-amber-600 transition-colors"
                                onClick={() => navigate('/homepage')}
                                title="Homepage"
                            />
                        </li>
                        {adminNavbar.map((item, index) => (
                            <li key={index}>
                                <button
                                    className="font-bold cursor-pointer hover:bg-amber-50 hover:text-neutral-600 transition-all rounded-3xl px-4 py-2"
                                    onClick={() => navigate(`/adminpanel/${item.toLowerCase()}`)}
                                >
                                    {item}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}
