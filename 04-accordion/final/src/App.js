import React, { useState , useEffect , useRef } from 'react';
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ToastContainer, toast } from 'react-toastify';
import data from './data.js'
import 'react-toastify/dist/ReactToastify.css';
import send from './assets/send.png'
import menu from './assets/menu.png';

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
  const [isHamburger,setIsHamburger] = useState(false);
  const [isHamburgerAnimate,setIsHamburgerAnimate] = useState(false);
  let foundInCache = false;
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
          foundInCache = true;
          return;
        }
      })
      if (!foundInCache){
        const finalMessage = message + "Reply in a maximum of 100 words. Always reply in Hindi with English characters";



        // const llmResult = await chatModel.createCompletion({
        //   model: "text-davinci-003",
        //   prompt: "hello world",
        //   max_tokens: 100,
        //   temperature: 0,
        //   stream: true,
        // }, { responseType: 'stream' });

        // console.log(llmResult)

        
        // llmResult.data.on('data', data => {
        //     const lines = data.toString().split('\n').filter(line => line.trim() !== '');
        //     console.log("______1_________")
        //     console.log(lines)
        //     console.log("______2_________")
            // for (const line of lines) {
                // const message = line.replace(/^data: /, '');
                // if (message === '[DONE]') {
                    // res.end();
                    // return
                // }
                // const parsed = JSON.parse(message);
                // res.write(`data: ${parsed.choices[0].text}\n\n`)
            // }
          // });

        const llmResult = await chatModel.predict(finalMessage);
        await setIsTypingRight(false);
        await setUserMessages(userMessages => [...userMessages,{text:llmResult,isReply:true}]);
        foundInCache = false;
      }
      foundInCache=false;
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
            {userMessages.map((value) => {
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
        </div>
        </div>
        <div className="flexRowContainer">
          <div className="flexRow">
            <div className="inputContainer">
              <input type='text' placeholder='Ask me anything about Jainism' onKeyDown={onKeyDownHandler} onChange={handleChange} value={message}/>
            </div>
            <div className="icon" onClick={addToArray}> <img src={send} /> </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
