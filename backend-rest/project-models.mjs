import mongoose from 'mongoose';
import 'dotenv/config';

let connection = undefined;

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_STRING);
        connection = mongoose.connection;
        console.log("Successfully connected to MongoDB using Mongoose!");
    } catch (err) {
        console.log(err);
        throw Error(`Could not connect to MongoDB ${err.message}`);
    }
}

/* ---------- Users ---------- */
const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { collection: 'login' });

const User = mongoose.model('Login', userSchema);

const createUser = async (username, password) => {
    return await new User({ username, password }).save();
};

async function getUserByUsername(username) {
    return await User.findOne({ username });
}

async function getUsers() {
    return await User.find({}, { password: 0 });
}

/* ---------- Group Discussions ---------- */
const postSchema = mongoose.Schema({
    username: { type: String, required: true },
    message:  { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
}, { collection: 'discussions' });

const Post = mongoose.model('Post', postSchema);

const createPost = async (username, message) => {
    return await new Post({ username, message }).save();
};

async function getPosts() {
    return await Post.find({}).sort({ createdAt: -1 });
}

async function deletePostById(id) {
    return await Post.findByIdAndDelete(id);
}

export {
    connect,
    createUser,
    getUserByUsername,
    getUsers,
    createPost,
    getPosts,
    deletePostById,
};