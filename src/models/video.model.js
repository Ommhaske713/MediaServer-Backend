import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({

    videoFile:{
        type:String,
        required:[true ,"Something went wrong"]

    },
    thumbnail:{
        type:String,
        required:true 

    },
    title:{
        type:String,
        required:true 

    },
    discription:{
        type:String,
        required:true 

    },
    duration:{
        type:Number,
        required:true 

    },
    views:{
        type:Number,
        default:0

    },
    isPublished:{
        type:Boolean,
        default:true 

    },
    videoOwner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
    


}
    
,{Timestamp:true});


videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video",videoSchema);