import React, { useState } from 'react';
import data from './data';
import SingleQuestion from './Question';
function App() {
  const [questions, setQuestions] = useState(data);
  const [userMessages, setUserMessages] = useState([]);
  const handleChange = (event) => {
    let temp = event.target.value;
    let temp2 = [...userMessages,temp];
    console.log(temp2);
  }
  return (
    <main>
      <div>
        <input type='text' onChange={handleChange} />
        <button type='button'>send</button>
      </div>
    </main>
  );
}

export default App;
