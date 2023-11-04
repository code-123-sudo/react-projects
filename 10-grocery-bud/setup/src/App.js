import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'
function App() {
	const [name,setName] = useState('')
 
  return (
  	<section className='section-center'>
  		<form className='grocery-form' onSubmit={handleSubmit}>
  		</form>
  		<h3>grocery bud</h3>
  		<div className='form-control'>
  			<input
  				type='text'
  				className='grocery'
  				placeholder='e.g. eggs'
				value={name}
				onChange={(e) => setName(e.target.value)}  				
  		</div>
  	</section>
  	)
}

export default App
