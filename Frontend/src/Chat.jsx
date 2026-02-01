import "./Chat.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";  // for styling gpt reply with markdown
import rehypeHighlight from "rehype-highlight";  // for syntax highlighting in code blocks
import 'highlight.js/styles/atom-one-dark.css';  // import desired highlight.js theme
// import 'highlight.js/styles/github-dark.css';  // import desired highlight.js theme

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [ latestReply, setLatestReply ] = useState(null);

    useEffect(() => {
        if (reply === null) {
            setLatestReply(null);
            return;
        }

        // latestReply separate => typing effect create
        if (!prevChats.length) return;

        const content = reply.split(" "); // Split reply into words
        let idx = 0;

        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" ")); // Update latestReply with words up to idx
            idx++;
            if (idx >= content.length) clearInterval(interval); // Clear interval when done

        }, 40); // Adjust speed (in ms) as needed

        return () => clearInterval(interval); // Cleanup on unmount or when reply changes

    }, [prevChats, reply]);

    return (
        <>
            { newChat && <h1>Start a New Chat!</h1>}

            <div className="chats">
                {
                    prevChats?.slice(0, -1).map((chat, idx) => 
                        <div className={chat.role === "user"? "userDiv" : "gptDiv"} key={idx}>
                            {
                                chat.role === "user"?
                                <p className="userMessage">{chat.content}</p> :
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                            }
                        </div>
                    )
                }

                {
                    prevChats.length > 0 && (
                        <>
                            {
                                latestReply === null ? (
                                    <div className="gptDiv" key={"non-typing"}>
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length - 1].content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="gptDiv" key={"typing"}>
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                    </div>
                                )
                            }
                        </>
                    )
                }

            </div>
        </>
    );
}

export default Chat;