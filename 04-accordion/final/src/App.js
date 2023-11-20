import React, { useState , useEffect , useRef } from 'react';
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ToastContainer, toast } from 'react-toastify';
import data from './data.js'
import 'react-toastify/dist/ReactToastify.css';

import { API_KEY, API_URL } from "./constants.js"

import send from './assets/send.png'
import menu from './assets/menu.png';


function App() {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  
  const [isStreaming,setIsStreaming] = useState('');
  const [streamData,setStreamData] = useState();

  const [isTypingLeft,setIsTypingLeft] = useState(false);
  const [isTypingRight,setIsTypingRight] = useState(false);
  const [isHamburger,setIsHamburger] = useState(false);
  const [isHamburgerAnimate,setIsHamburgerAnimate] = useState(false);

  const [count,setCount] = useState(0);

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
      setChatMessages(chatMessages)
      scrollToBottom();
  },[chatMessages])

  const addAiAnswerToChat = async () => {
    try {
      setIsTypingRight(true);
      scrollToBottom();

      // first search in cache for the user question
      searchInCache();

      if (!foundInCache){
      // if not found in cache , get answer from open chat ai
        const finalMessage = "chatgpt " + message + " Reply in a maximum of 20 words. Always reply in Hindi with English characters";
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

        let textRecieved = ""
        const decoder = new TextDecoder();
        await setIsStreaming(true);
        for await (const chunk of streamAsyncIterator(response.body)) {
          setIsTypingRight(false)
          const data = decoder.decode(chunk)
          const lsData = data.split("\n\n")
          lsData.map((data) => {
          try {
            const jd = JSON.parse(data.replace("data: ",""));
            if ( jd["choices"][0]["delta"]["content"] ){
              const txt = jd["choices"][0]["delta"]["content"]
              textRecieved += txt;
              setStreamData(textRecieved)
            }
          } catch(err) {

            }
          })
        }
        setIsStreaming(false)
        setChatMessages(chatMessages => [...chatMessages,{text:textRecieved,isReply:true}]);
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
    setChatMessages(chatMessages => [...chatMessages,{text:message,isReply:false}]);
    setStreamData("")
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

  const startNewChat = () => {
    setCount(count++);
    let stringConverted = JSON.string(chatMessages);
    let key = "chat" + count.toString();
    localStorage.setItem(key,stringConverted);
    setChatMessages([]);
    console.log("some yex dijs ")
  }

  const showSavedChat = (countNo) => {
    let keyR = "chat" + countNo.toString();
    let retString = localStorage.getItem(keyR);
    let retArray = JSON.parse(retString);
    setChatMessages(retArray);
  }

  return (
    <div className="topDiv">
      <div className="menuButton" onClick={() => {setIsHamburger(!isHamburger);setIsHamburgerAnimate(!isHamburgerAnimate)}}>
        <img src={menu} className="iconImg" />
      </div>
      <div className={ isHamburger ? 'hamburger' : 'hamburger hamburger2'} >
        {[1,2,3,4,5].map((value) => {
            let tempCount = value.toString();
            let tempKey = "chat" + tempCount;
            let text = JSON.parse(localStorage.getItem(tempKey))[0].slice(0,9)
            return (
              <div>
                {text}
              </div>
            )
          })
        }
        <div className="newChatButton" onClick={startNewChat}>New Chat +</div>
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
                  <div className="user">Assistant2</div>
                  <div className='chat-right'>
                    {streamData}
                  </div>
                </div>
              }
        </div>
        </div>
        <div className="commonfaqs">
            <div className="faqs1">
              <div className="faq">Who is Nelson Mandela</div>
              <div className="faq">Who is Rahul Dravid</div>
            </div>
            <div className="faqs2">
              <div className="faq">Who is Barack Obama</div>
              <div className="faq">Who is Undertaker</div>
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
