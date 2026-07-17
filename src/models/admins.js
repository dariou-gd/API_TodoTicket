import mongoose, {Schema, model} from "mongoose";

const adminsSchema = new Schema(
    {
        name: {
            type: String,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        isVerified: {
            type: Boolean,
        },
        loginAttempts: {
            type: Number,
        },
        timeOut: {
            type: Number,
        },
    },
    {
        timestamps: true,
        strict: false
    },
);

export default model("admins", adminsSchema);