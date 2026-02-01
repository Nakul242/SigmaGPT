import express from 'express';
import Thread from '../models/Thread.js';
import getOpenAIAPIResponse from '../utils/gemini.js';

const router = express.Router();

// test route
router.post('/test', async (req, res) => {
    try {
        const thread = new Thread({ 
            threadId: "xyz123",
            title: "Testing Thread"
        });

        const resposne = await thread.save();
        res.send(resposne);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save in db" });
    }   
});

// Get all threads
router.get("/thread", async(req, res) => {
    try {
        // descending order of updatedAt , most recent data on top
        const threads = await Thread.find({}).sort({updatedAt: -1});
        res.json(threads);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

router.get("/thread/:threadId", async(req, res) => {
    const {threadId} = req.params;

    try {
        const thread = await Thread.findOne({threadId});

        if(!thread) {
            res.status(404).json({error: "Thread not found"});
        }

        res.json(thread.messages);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId", async(req, res) => {
    const { threadId } = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({threadId});

        if(!deletedThread) {
            res.status(404).json({error: "Thread not found"});
        }
        res.status(200).json({success: "Thread deleted successfully"});
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to delete thread"});
    }
});

router.post("/chat", async(req, res) => {
    const { threadId, message } = req.body;

    if(!threadId || !message) {
        return res.status(400).json({error: "missing required fields"});
    }

    try {
        let thread = await Thread.findOne({threadId});

        if(!thread) {
            // create new thread
            thread = new Thread({
                threadId,
                title: message,
                messages: [{ role: "user", content: message }]
            });
        }
        else {
            // append to existing thread
            thread.messages.push({ role: "user", content: message });
        }

        // get response from Gemini API
        const assistantReply = await getOpenAIAPIResponse(message);

        // update existing thread
        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();
        res.json({ reply: assistantReply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "something went wrong" });
    }
});

export default router;