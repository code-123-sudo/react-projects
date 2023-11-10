import React, { useState , useEffect } from 'react';
import data from './data';
import SingleQuestion from './Question';
import { OpenAI } from "langchain/llms/openai";

const llm = new OpenAI({
  openAIApiKey: "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",
  temperature: 0.9,
});

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

    const llmResult = await llm.predict(message);
    await setUserMessages(userMessages => [...userMessages,{message:llmResult,isReply:true}]);
    await setIsTypingRight(false)
  }
  const addToArray = async () => {
    await setIsTypingRight(true)
    await setUserMessages(userMessages => [...userMessages,{message:message,isReply:false}]);
    setTimeout(addToArray2,1000)
  }
  return (
    <main>
      <div>
        <div className='chat-container'>
          {userMessages.map((value) => {
            if (!value.isReply) {
              return (
                <div className='chat-left'>
                  {value.message}
                </div>
                )
            }else {
              return (
                <div className='chat-right'>
                  {value.message}
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

        <input type='text' onChange={handleChange} value={message}/>
        <button type='button' onClick={addToArray}>send</button>
      </div>
    </main>
  );
}

export default App;
