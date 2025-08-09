import { MessagesSquare } from "lucide-react";
import img from "../assets/image.png"
export default function Commentsection() {
    const comment = [
        {
            img:"dfadaf.png",
            comment:"This post good",
            name: "chirkut",
            time:"2 hours ago"
        },
        {
            img: "dfadaf.png",
            comment: "This post good",
            name: "chirkut",
            time: "2 hours ago"
        }
    ]
    return (
        <div className="border-0 rounded-4xl items-center content-center justify-center  m-7 p-12 shadow-lg">
            {/* commentbox */}
            <input type="text" className="bg-gray-300 grow w-full my-6 rounded-2xl p-2 h-20" placeholder="write comments" />
            <div className="flex gap-3">
                <MessagesSquare />
                <h1>Comments</h1>
                <button className="cursor-pointer shadow-white border-0 bg-amber-50 rounded-4xl px-2 w-auto hover:bg-amber-100">Submit</button>
            </div>
            <div className="my-6">
                {
                    comment.map((comments) => (
                        <div className="m-2">
                            <div className="flex space-x-6">
                                <img  className="rounded-full w-[31px]" src={img}/>
                                <h1 className="font-bold text-2xl">{comments.name}</h1>
                                <h1>{comments.time}</h1>
                            </div>
                            <div className="mx-16">
                                <p>{comments.comment}</p>
                            </div>
                        </div>
                        
                    ))
                }
            </div>


        </div >
    )
}