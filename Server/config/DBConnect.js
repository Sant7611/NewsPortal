import mongoose from "mongoose"

export default function DbConnection() {
    mongoose.connect(process.env.MONGODBURI)
        .then(() => {
            console.log("Mongodb connected Successfully")
        })
        .catch((err) => {
            console.log(err);
        })

}