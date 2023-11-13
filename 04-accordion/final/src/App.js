import React, { useState , useEffect } from 'react';
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const llm = new OpenAI({
  openAIApiKey: "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",
  temperature: 0,
});

const chatModel = new ChatOpenAI();

function App() {
  const [message, setMessage] = useState('');
  const [userMessages, setUserMessages] = useState([]);
  const [isTypingLeft,setIsTypingLeft] = useState(false);
  const [isTypingRight,setIsTypingRight] = useState(false);
  
  const handleChange = (event) => {
    setMessage(event.target.value)
  }

  useEffect(() => { console.log(userMessages)
    setMessage('');
   }, [userMessages])

  const addToArray2 = async () => {
    try {
    await setIsTypingRight(true);
    // const chatModelResult = await chatModel.predict(text);
    const llmResult = await chatModel.predict(message);
     console.log(llmResult)
     console.log(message)
    await setIsTypingRight(false);
    await setUserMessages(userMessages => [...userMessages,{text:llmResult,isReply:true}]);
   // await setIsTypingRight(false)
    } catch(error) {
      await setIsTypingRight(false);
      toast("something went wrong");
      console.log(error)
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
        <button type='button' onClick={addToArray}>send</button>
      </div>
    </main>
  );
}

export default App;
