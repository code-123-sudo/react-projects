import React, { useState , useEffect } from 'react';
import data from './data';
import SingleQuestion from './Question';
function App() {
  const [message, setMessage] = useState('');
  const [userMessages, setUserMessages] = useState([]);
  const handleChange = (event) => {
    setMessage(event.target.value)
  }
  useEffect(() => { console.log(userMessages)
    setMessage('');
   }, [userMessages])
  const addToArray2 = () => {
    setUserMessages(userMessages => [...userMessages,{message:"Lorem ipsum dolor sit amettas tristique. ",isReply:true}]);
  }
  const addToArray = () => {
    setUserMessages(userMessages => [...userMessages,{message:message,isReply:false}]);
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
        </div>
        <input type='text' onChange={handleChange} value={message}/>
        <button type='button' onClick={addToArray}>send</button>
      </div>
    </main>
  );
}

export default App;
