import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import DbConnection from "./config/DBConnect.js";
import userRoute from "./routes/userRoute.js"
import { globalErrorHandler } from "./middlewares/globalErroHandler.js";
import newsRoute from "./routes/newsRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import helmet from 'helmet'
import recentReadRoutes from "./routes/recentReadRoute.js";
import adroute from "./routes/admin.route.js";
dotenv.config();

const app = express();

app.use(cors())
app.use(helmet())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static());

const PORT = process.env.PORT || 4041;

//routes
app.use("/api/user", userRoute);
app.use("/api/admin", adroute)
app.use("/api/news", newsRoute)
app.use("/api/category", categoryRoute)
app.use('/api', recentReadRoutes);

app.listen(PORT, () => {
    DbConnection()
    console.log(`Server running at PORT ${PORT}`)
})


// error handlers middleware
app.use(globalErrorHandler);
