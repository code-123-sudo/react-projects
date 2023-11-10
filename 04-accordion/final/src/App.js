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
  const addToArray = () => {
    setUserMessages(userMessages => [...userMessages,{message:message,isReply:false}]);
  }
   const addToArray2 = () => {
    setUserMessages(userMessages => [...userMessages,{message:message,isReply:true}]);
  }
  return (
    <main>
      <div>
        {userMessages.map((value) => {
          if (!value.isReply) {
          return (
            <div className='left'>
              {value.message}
            </div>
            )
          }else {
            return (
            <div className='right'>
              {value.message}
            </div>
            )
          }
        })

        }
        <input type='text' onChange={handleChange} value={message}/>
        <button type='button' onClick={addToArray}>send</button>
        <button type='button' onClick={addToArray2}>Recieve</button>
      </div>
    </main>
  );
}

export default App;
