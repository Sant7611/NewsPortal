import { Earth, Facebook, Instagram, Linkedin, Mail, Shield } from "lucide-react";

export default function Footer() {
    const sociallink = [
        "Our Team", "Terms and Services", "Our blog", "FAQ", "Our Stories"
    ]
    return (
        <footer>
            <div className="flex border-t-2">
                <div className="p-5">
                    <p>All right reserved</p>
                    <div className="flex space-x-3">
                        <Shield />
                        <h2>Papero News 2025</h2>
                    </div>
                    <Earth className="w-[11rem] h-[12rem]" />
                </div>

                <div className="text-center w-full flex flex-col justify-center">
                    {/* top-tier1 */}
                    <div className="grid grid-cols-2 place-items-center mb-8 pl-[21rem]">
                        <div className="flex flex-col items-center justify-center ">
                            <p className="font-medium">We're located at</p>
                            <p className="text-gray-600">7297 East Old Maple Boulevard, Suite 209-B, Washington</p>
                        </div>
                        <div className="flex items-center justify-center">
                            <p className="text-gray-600">Contact (123) 420-9421</p>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-[10.5rem] leading-none">Paperio News</h1>
                    </div>
                </div>
            </div>
            <div className="flex flex-cols border-t-2">
                <div className="flex space-x-1.5 border-r-2 p-8">
                    <Mail className="w-6 h-6 hover:text-gray-600 cursor-pointer" />
                    <Instagram className="w-6 h-6 hover:text-gray-600 cursor-pointer" />
                    <Facebook className="w-6 h-6 hover:text-gray-600 cursor-pointer" />
                    <Linkedin className="w-6 h-6 hover:text-gra y-600 cursor-pointer" href="#"/>
                </div>
                <div className="flex w-full items-center text-center justify-evenly ">
                    {sociallink.map((item) => (
                        <li className="p-4 list-none hover:text-gray-600 cursor-pointer" key={item}>
                            {item}
                        </li>
                    ))}
                </div>
            </div>
        </footer>
    )
}