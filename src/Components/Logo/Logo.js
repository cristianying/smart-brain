import React from 'react';
import Tilt from 'react-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {

	return (
		<div className='ma4 mt0'>
			<Tilt className="Tilt br2 shadow-2" options={{ max : 45 }} style={{ height: 155, width: 155 }} >
		 		<div className="Tilt-inner"> 
		 			<img style={{padding:'1px, 1px'}} alt='logo' src={brain}/> 
		 		</div>
			</Tilt>
		</div>

		);
}

export default Logo;