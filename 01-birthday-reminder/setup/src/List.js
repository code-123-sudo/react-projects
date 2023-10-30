import React from 'react';

// comment
const List = ({ people }) => {
	let [people,setPeople] = React.useState([]);
    return (
    <>
    	{people.map(( person ) => {
    		let { id, name , age, image } = people;
             return (
             	<article key={id} className='person'>
             		<img src={image} alt={name} />
             		<div>
             			<h4>{name}</h4>
             			<p>{age} years</p>
             		</div>
             	</article>
             	)
    	})}
    </>
  );
};

export default List;
