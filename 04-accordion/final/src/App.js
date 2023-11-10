import React, { useState , useEffect } from 'react';
import data from './data';
import SingleQuestion from './Question';
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
    await setUserMessages(userMessages => [...userMessages,{message:"Lorem ipsum dolor sit amettas tristique. ",isReply:true}]);
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
            if( isTypingLeft ){
                <div className='chat-left'>
                  "...typing"
                </div>
              }
            if ( isTypingRight ){
                <div className='chat-right'>
                  "...typing"
                </div>
              }
            }
        </div>

        <input type='text' onChange={handleChange} value={message}/>
        <button type='button' onClick={addToArray}>send</button>
      </div>
    </main>
  );
}

export default App;
