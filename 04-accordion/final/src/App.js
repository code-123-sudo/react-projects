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
    setUserMessages(userMessages => [...userMessages,message]);
  }
  return (
    <main>
      <div>
        {userMessages.map((message) => {
          return (
            <div>
              {message}
            </div>
            )
        })

        }
        <input type='text' onChange={handleChange} value={message}/>
        <button type='button' onClick={addToArray}>send</button>
      </div>
    </main>
  );
}

export default App;
