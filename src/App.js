import React, {Component} from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import Register from './Components/Register/Register';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import './App.css';
import Particles from 'react-particles-js';
import {partcilesOptions} from './particles'
import Clarifai from 'clarifai';
import Signin from './Components/Signin/Signin';


const app = new Clarifai.App({
 apiKey: '2909ae2f1b554de8b7de253d8659d965'
});



class App extends Component {

constructor(){
	super();
	this.state={

		input: '',
		imageUrl: '',
		box:{},
		route: 'signin',
		isSignedIn: false,
		user:{
			id: '',
			name: '',
			email:'',
			entries: 0,
			joined: ''
		}
	}
}


loadUser=(data)=>{
	this.setState({user:{
		id: data.id,
		name: data.name,
		email:data.email,
		entries: data.entries,
		joined: data.joined
	}})
}



calculateFaceLocation= (data)=> {
	const calculateFace = data.outputs[0].data.regions[0].region_info.bounding_box;
	const image =document.getElementById('inputimage');
	const width =Number(image.width);
	const height= Number(image.height);
	return{

		leftCol: calculateFace.left_col*width,
		topRow: calculateFace.top_row*height,
		rightCol: width-(calculateFace.right_col*width),
		bottomRow: height-(calculateFace.bottom_row*height)
	}



}

displayFaceBox=(box)=>{
	this.setState({box: box});
}

onInputChange = (event) => {
	this.setState({input: event.target.value});
	
}


onButtonSubmit = () => {
	
	this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => {
        if (response) {
          fetch('https://salty-anchorage-26214.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
    .catch(err=> console.log(err));
}


onRouteChange =(route)=>{
	if(route==='signout'){
		this.setState({isSignedIn: false})
	}else if (route==='home'){
		this.setState({isSignedIn: true})
	}
	this.setState({route: route})
}

render(){

	const {isSignedIn,imageUrl,route,box}=this.state;
  return (
    <div className="App">
    <Particles className='particles' params={partcilesOptions} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      {route==='home'
      ?<div>
	      <Logo />  
	      <Rank name={this.state.user.name}
                entries={this.state.user.entries}/>
	      <ImageLinkForm 
	      onInputChange={this.onInputChange} 
	      onButtonSubmit={this.onButtonSubmit}
	      />

	      <FaceRecognition box={box} imageUrl={imageUrl}/>
	    </div>
	    : (
	    	route==='signin'
	    	?<Signin  loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
	    	:<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
	    	)

      

	    }
	   </div>
	 );
}
}

export default App;
