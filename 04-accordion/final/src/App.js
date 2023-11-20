import React, { useState , useEffect , useRef } from 'react';
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ToastContainer, toast } from 'react-toastify';
import data from './data.js'
import 'react-toastify/dist/ReactToastify.css';

import { API_KEY } from "./constants.js"

import send from './assets/send.png'
import menu from './assets/menu.png';

const API_URL = "https://api.openai.com/v1/chat/completions";


const chatModel = new ChatOpenAI({
  openAIApiKey: API_KEY,
  temperature: 0,
  model: "text-davinci-003"
  // max_tokens: 100,
  // temperature: 0,
  // stream: true,
}, { responseType: 'stream' });

function App() {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  
  const [isStreaming,setIsStreaming] = useState('');
  const [streamData,setStreamData] = useState();

  const [isTypingLeft,setIsTypingLeft] = useState(false);
  const [isTypingRight,setIsTypingRight] = useState(false);
  const [isHamburger,setIsHamburger] = useState(false);
  const [isHamburgerAnimate,setIsHamburgerAnimate] = useState(false);
  let foundInCache = false;
  let messagesEndRef = useRef(null);
  
  const handleChange = (event) => {
    setMessage(event.target.value)
  }

  const searchInCache = () => {
    data.forEach( (quesAns) => {
        if ( quesAns.question == message ) {
          setChatMessages(chatMessages => [...chatMessages,{text:quesAns.answer,isReply:true}]);
          setIsTypingRight(false);
          foundInCache = true;
          return;
        }
    })
  }

  useEffect(() => {
      setMessage('');
      scrollToBottom();
    },[chatMessages])

  const addAiAnswerToChat = async () => {
    try {
      await setIsTypingRight(true);
      scrollToBottom();

      // first search in cache for the user question
      searchInCache();

      if (!foundInCache){
      // if not found in cache , get answer from open chat ai
        const finalMessage = message + "Reply in a maximum of 100 words. Always reply in Hindi with English characters";
        const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user",content: finalMessage }],
          temperature: 0.1,
          stream : true
          }),
        });


       async function* streamAsyncIterator(stream) {
  // Get a lock on the stream
  const reader = stream.getReader();

  try {
    while (true) {
      // Read from the stream
      const {done, value} = await reader.read();
      // Exit if we're done
      if (done) return;
      // Else yield the chunk
      yield value;
    }
  }
  finally {
    reader.releaseLock();
  }
}

let text = ""
const decoder = new TextDecoder();

for await (const chunk of streamAsyncIterator(response.body)) {
    // …
    const data = decoder.decode(chunk)
    console.log(data)
  }
      










    














        // const llmResult = await chatModel.predict({
        //   model: "text-davinci-003",
        //   max_tokens: 100,
        //   temperature: 0,
        //   stream: true,
        //   content: finalMessage
        // }, { responseType: 'stream' });

        // let str = ""
        // await setIsStreaming(true);
        // console.log(llmResult)
        // for await (const chunk of llmResult) {
        //   console.log(chunk)
        //   str += chunk;
        //   await setStreamData(str)
        //   await setTimeout(() => {
        //     console.log("---- time interval ----")
        //   },1000)
        // }
          // console.log(chunk); // This correctly streams it in the terminal 
      
        await setIsStreaming(false)
        await setIsTypingRight(false);
        await setChatMessages(chatMessages => [...chatMessages,{text:"str",isReply:true}]);
        foundInCache = false;
      }
      foundInCache=false;
    } 
    catch(error) {
      await setIsTypingRight(false);
      console.log(error)
      toast("something went wrong");
    }
  }

  const addUserQuestionToChat = async () => { 
    await setChatMessages(chatMessages => [...chatMessages,{text:message,isReply:false}]);
    addAiAnswerToChat();
  }

  const enterKeySend = e => {
    if (e.keyCode === 13) {
      addUserQuestionToChat();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="topDiv">
      <div className="menuButton" onClick={() => {setIsHamburger(!isHamburger);setIsHamburgerAnimate(!isHamburgerAnimate)}}>
        <img src={menu} className="iconImg" />
      </div>
      <div className={ isHamburger ? 'hamburger' : 'hamburger hamburger2'} >
        <div className="newChatButton">New Chat +</div>
      </div>
      <div className= {"chatBox " +  (isHamburgerAnimate ? 'chatBox2' : null) }>
        <div className="parentDiv">
        <div>
          <ToastContainer />
          <div className='chat-container'>
            {chatMessages.map((value) => {
              if (!value.isReply) {
                return (
                  <div className="chatLeftContainer">
                    <div className="user">You</div>
                    <div className='chat-left'>
                      {value.text}
                    </div>
                  </div>
                  )
              }else {
                return (
                  <div className="chatLeftContainer">
                    <div className="user">Assistant</div>
                    <div className='chat-right'>
                      {value.text}
                    </div>
                  </div>
                )
              }
          })}
          <div className='scroll-point' ref={messagesEndRef} />
            {
              isTypingLeft &&
                <div className="chatLeftContainer">
                  <div className="user">Assistant</div>
                  <div className='chat-left'>
                    ...typing
                  </div>
                </div>
              }
              {
               isTypingRight &&
               <div className="chatLeftContainer">
                  <div className="user">Assistant</div>
                  <div className='chat-right'>
                    ...typing
                  </div>
                </div>
              }
          </div>
           
            {
              isStreaming &&
                <div className="chatLeftContainer">
                  <div className="user">Assistant</div>
                  <div className='chat-right'>
                    {streamData}
                  </div>
                </div>
              }
        </div>
        </div>
        <div className="flexRowContainer">
          <div className="flexRow">
            <div className="inputContainer">
              <input type='text' placeholder='Ask me anything about Jainism' onKeyDown={enterKeySend} onChange={handleChange} value={message}/>
            </div>
            <div className="icon" onClick={addUserQuestionToChat}> <img src={send} /> </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
