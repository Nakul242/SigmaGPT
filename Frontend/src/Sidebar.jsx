import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from 'uuid';

function Sidebar() {
    const { allThreads, setAllThreads, currThreadId, setCurrThreadId, setNewChat, setPrompt, setReply, setPrevChats } = useContext(MyContext);

    const getAllThreads = async () => {
        // Function to get all threads from backend
        try {
            const response = await fetch('http://localhost:8080/api/thread');
            const res = await response.json();
            const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title}));
            console.log("Fetched threads:", filteredData);
            setAllThreads(filteredData);
        } catch (error) {
            console.error("Error fetching threads:", error);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log("Fetched chat history:", res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        }
        catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method: 'DELETE'});
            const res = await response.json();
            console.log("Deleted thread:", res);

            // updated thread list re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(currThreadId === threadId) {
                // if deleted thread is current thread, create new chat
                createNewChat();
            }

        } catch (error) {
            console.error("Error deleting thread:", error);
        }
    };

    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className="history">
                {/* Chat history items will go here */}
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted" : ""}
                        >{thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation();  // stop event bubbling
                                    deleteThread(thread.threadId);
                                }}>
                            </i>
                        </li>
                        
                    ))
                }
            </ul>

            <div className="sign">
                <p>By Tyson2024 &hearts;</p>
            </div>
        
        </section>
    );
}

export default Sidebar;