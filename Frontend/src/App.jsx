import './App.css';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { MyContext } from './MyContext';
import { useState } from 'react';
import { v1 as uuidv1 } from 'uuid';

function App() {
	const [ prompt, setPrompt ] = useState('');  // state to store the current prompt
	const [ reply, setReply ] = useState(null);  // state to store the current reply
	const [ currThreadId, setCurrThreadId ] = useState(uuidv1());
	const [ prevChats, setPrevChats ] = useState([]); // store all chats of curr threads
	const [ newChat, setNewChat ] = useState(true); // to indicate if a new chat is started
	const [ allThreads, setAllThreads ] = useState([]); // to store all threads
	
	const providerValue = { 
		prompt, setPrompt, 
		reply, setReply,
		currThreadId, setCurrThreadId,
		prevChats, setPrevChats,
		newChat, setNewChat,
		allThreads, setAllThreads
	}; // Set an appropriate value for the context

	return (

		<div className="app">
			<MyContext.Provider value={providerValue}>
				<Sidebar />
				<ChatWindow />
			</MyContext.Provider>
		</div>
	)
}

export default App
