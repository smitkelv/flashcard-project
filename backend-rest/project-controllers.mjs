import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import cors from 'cors';
import * as model from './project-models.mjs';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await model.connect();
    console.log(`Server listening on port ${PORT}...`);
});

/* ---------- Signup ---------- */
app.post('/signup', asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (typeof username === 'string' && username.trim() !== '' &&
        typeof password === 'string' && password.trim() !== '') {
        const existing = await model.getUserByUsername(username);
        if (existing) {
            return res.status(409).send({ "Error": "Username already taken" });
        }
        const user = await model.createUser(username, password);
        res.status(201).send({ username: user.username });
    } else {
        res.status(400).send({ "Error": "Invalid request" });
    }
}));

/* ---------- Login ---------- */
app.post('/login', asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await model.getUserByUsername(username);
    if (!user || user.password !== password) {
        return res.status(401).send({ "Error": "Invalid credentials" });
    }
    res.status(200).send({ username: user.username });
}));

/* ---------- Users ---------- */
app.get('/users', asyncHandler(async (req, res) => {
    res.status(200).send(await model.getUsers());
}));

/* ---------- Discussions ---------- */
app.get('/discussions', asyncHandler(async (req, res) => {
    res.status(200).send(await model.getPosts());
}));

app.post('/discussions', asyncHandler(async (req, res) => {
    const { username, message } = req.body;
    if (typeof username === 'string' && username.trim() !== '' &&
        typeof message === 'string' && message.trim() !== '') {
        const post = await model.createPost(username, message);
        res.status(201).send(post);
    } else {
        res.status(400).send({ "Error": "Invalid request" });
    }
}));

app.delete('/discussions/:id', asyncHandler(async (req, res) => {
    const deleted = await model.deletePostById(req.params.id);
    if (deleted) {
        res.status(204).send();
    } else {
        res.status(404).send({ "Error": "Not found" });
    }
}));