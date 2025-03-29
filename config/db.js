import mongoose from "mongoose";


// connect database from mongodh
 export const connectDB = async () =>{
    await mongoose.connect(process.env.MONGODB_URI )
    .then(()=>{
        console.log("DB Connected")
    });
}

