import React, { useState } from 'react';
import data from './data';
import List from './List';
function App() {
  const [people,setPeople] = useState(data)
  return (
  	<div>
  		<section className='container'>
  		<h3>{people.length} have birthdays today</h3>
  		<List people={people} />
  		<button onClick={() => {setPeople([])}}>Clear All</button>
  		</section>
  	</div>
  )
}

export default App;
