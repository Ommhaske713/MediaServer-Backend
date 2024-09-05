import mongoose,{Schema} from "mongoose";
import { User } from "./user.model";



const subscriptionSchema = new Schema({
    subscriber:{

        type:Schema.Types.ObjectId,     //  one who is subscribing channel 
        ref:User                       

    },
    channel:{

        type:Schema.Types.ObjectId,     // one to whom 'subscriber' is subscribing 
        ref:User

    }

},{timestamps:true});

export const Subscription = mongoose.model("Subscription",subscriptionSchema);



// import mongoose from 'mongoose';
// const subTodoSchema = new mongoose.Schema({}, { timestamps: true });
// export const SubTodo = mongoose.model('SubTodo', subTodoSchema);