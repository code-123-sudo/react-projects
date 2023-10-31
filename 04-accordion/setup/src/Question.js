import React, { useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
const Question = () => {
	const [showInfo, setShowInfo] = useState(false);
  return (
  	<article className='question'>
  		<header>
  			<h4></h4>
  			<button className='btn' onClick={() => setShowInfo(!showInfo)}>
  				{showInfo ? <AiOutlineMinus /> : <AiOutlinePlus />}
  			</button>
  		</header>
  		{ showInfo && <p>a</p>}
  	</article>

  )
};

export default Question;
