import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'
getLocalStorage = () => {
	let list = localStorage.getItem('list');
	if (list) {
		return ( list = JSON.parse(localStorage.getItem('list')));
	} else {
		return [];
	}
}
function App() {
	const [name,setName] = useState('');
	const [list, setList] = useState(getLocalStorage());
	const [isEditing, setIsEditing] = useState(false);
 	const [editId, setEditId] = useState(null);

	const clearList = () => {
		setList([]);
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!name){

		}
		else if (name && isEditing) {
		} else {
			const newItem = { id: new Date().getTime().toString(), title: name};
			setList([...list, newItem])
			setName('')
		}

	}


	

	const editItem = (id) => {
		const specificItem = list.find((item) => item.id ===  id);
		setIsEditing(true)
		setEditID(id);
		setName(specificItem.title);
	};
	useEffect(() => {

	},[list])

  return (
  	<section className='section-center'>
  		<form className='grocery-form' onSubmit={handleSubmit}>
  			<h3>grocery bud</h3>
  			<div className='form-control'>
  				<input
  					type='text'
  					className='grocery'
  					placeholder='e.g. eggs'
					value={name}
					onChange={(e) => setName(e.target.value)}  				
  				/>
  				<button type='submit' className='submit-btn'>
  					{isEditing ? 'edit' : 'submit'}
  				</button>
  			</div>
  		</form>
  		{list.length > 0 && (
  			<div className='grocery-container'>
  				<List items={list} removeItem={removeItem} editItem={editItem} />
  				<button className='clear-btn' onClick={clearList}>	
                	clear items 
  				</button>
  			</div>
  		)}
  	</section>
  	)
}

export default App
