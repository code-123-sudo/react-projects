import React, { useState, useEffect } from 'react';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { FaQuoteRight } from 'react-icons/fa';
import data from './data';
function App() {
	const [people, setPeople] = useState(data);
	const [index, setIndex] = React.useState(0);

	return (
		<section className="section">
			<div className="title">
				<h2>
					<span>/</span>reviews
				</h2>
			</div>
			<div className="section-center">
				{

				}
				<button className="prev" onClick={() => setIndex(index - 1 )}>
					<FiChevronLeft />
				</button>
				<button className="next" onClick={() => setIndex(index + 1)}>
					<FiChevronRight />
				</button>
			</div>
		</section> 
	)
}


export default App;
