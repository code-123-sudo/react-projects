import React, { useState , useEffect , useRef } from 'react';
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ToastContainer, toast } from 'react-toastify';
import data from './data.js'
import 'react-toastify/dist/ReactToastify.css';

// const llm = new OpenAI({
//   openAIApiKey: "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",
//   temperature: 0,
// });

const chatModel = new ChatOpenAI({
   openAIApiKey: "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",
  temperature: 0,
});

function App() {
  const [message, setMessage] = useState('');
  const [userMessages, setUserMessages] = useState([]);
  const [isTypingLeft,setIsTypingLeft] = useState(false);
  const [isTypingRight,setIsTypingRight] = useState(false);
  const [foundInCache,setFoundInCache] = useState(false);
  let messagesEndRef = useRef(null);
  
  const handleChange = (event) => {
    setMessage(event.target.value)
  }

  useEffect(() => { console.log(userMessages)
    setMessage('');
    scrollToBottom();
   }, [userMessages])

  const addToArray2 = async () => {
    try {
      await setIsTypingRight(true);
      scrollToBottom();
      data.forEach( (quesAns) => {
        if ( quesAns.question == message ) {
          setUserMessages(userMessages => [...userMessages,{text:quesAns.answer,isReply:true}]);
          setIsTypingRight(false);
          setFoundInCache(true);
          return;
        }
      })
      console.log("======1=======")
      console.log(foundInCache)
      console.log("======2=======")
      if (isTypingRight){
        const finalMessage = message + "Reply in a maximum of 20 words";
        const llmResult = await chatModel.predict(finalMessage);
        await setIsTypingRight(false);
        await setUserMessages(userMessages => [...userMessages,{text:llmResult,isReply:true}]);
        setFoundInCache(false);
      }
      setFoundInCache(false);
    } 
    catch(error) {
      await setIsTypingRight(false);
      toast("something went wrong");
    }
  }

  const addToArray = async () => {
    
    await setUserMessages(userMessages => [...userMessages,{text:message,isReply:false}]);
    //setTimeout(addToArray2,1000)
    addToArray2();
  }

  const onKeyDownHandler = e => {
    if (e.keyCode === 13) {
      addToArray();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }



  return (
    <main>
      <div>
        <ToastContainer />
        <div className='chat-container'>
          {userMessages.map((value) => {
            if (!value.isReply) {
              return (
                <div className='chat-left'>
                  {value.text}
                </div>
                )
            }else {
              return (
                <div className='chat-right'>
                  {value.text}
                </div>
              )
            }
        })}
          {
            isTypingLeft &&
                <div className='chat-left'>
                  ...typing
                </div>
            }
            {
             isTypingRight &&
                <div className='chat-right'>
                  ...typing
                </div>
            }
        </div>

        <input type='text' onKeyDown={onKeyDownHandler} onChange={handleChange} value={message}/>
        <button  type='button' onClick={addToArray}>send</button>
        <div className='scroll-point' ref={messagesEndRef} />
      </div>
   
    </main>
  );
}

export default App;
