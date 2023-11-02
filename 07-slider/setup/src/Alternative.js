import React, { useState, useEffect } from 'react'
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi'
import { FaQuoteRight } from 'react-icons/fa'
import data from './data'
function App() {
	const [people, setPeople] = useState(data)
	const [index, setIndex] = React.useState(0)

	const nextSlide = () => {
		setIndex((oldIndex) => {
			let index = oldIndex + 1
			if ( index > people.length - 1) {
				index = 0
			}
			return index;
		})
	}
	const prevSlide = () => {
		setIndex((oldIndex) => {
			let index = oldIndex - 1
			if ( index < 0 ){
				index = people.length - 1
			}
			return index;
		})
	}
	useEffect(() => {
		let slider = setInterval(() => {
			setIndex((oldIndex) => {
				let index = oldIndex + 1
				if ( index > people.length - 1){
					index = 0
				}
				return index
			})

		},5000)
		return () => {
			clearInterval(slider)
		}
	},[index])

	return (
		<section className='section'>
			<div className='title'>
				<h2>
					<span>/</span>reviews
				</h2>
			</div>
			<div className='section-center'>
			</div>
		</section>
	)
}