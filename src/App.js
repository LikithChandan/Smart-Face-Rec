import React, {Component} from 'react';
import Navigation from './components/navigation/Navigation';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Logo from './components/logo/Logo';
import Clarifai from 'clarifai';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import Particles from 'react-particles-js';
import './App.css';

const app = new Clarifai.App({
 apiKey: 'abff6b0d6bc8424cbd979f84d7742250'
});

const particlesOptions=
{
  
    particles: 
    {
      number: 
      {
        value: 80,
        density:
        {
          enable: true,
          value_area: 700
        }
      }
    }
  
}
class App extends Component
{
  constructor()
  {
    super();
    this.state=
    {
      input:'',
      imageUrl:'',
      box: {}
    }
  }

  calculateFaceLocation=(data)=>
  {
    const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box;
    const image= document.getElementById('inputimage');
    const width= Number(image.width);
    const height= Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height -(clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox=(box)=>
  {
    this.setState({box: box});
  }
  
  onInputChange=(event)=>
  {
    this.setState({input: event.target.value});
  }

  onSubmit=()=>
  {
    this.setState({imageUrl: this.state.input});
      app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response=> this.displayFaceBox(this.calculateFaceLocation(response))) 
      .catch(err=>console.log(err));
  }

  render()
  {
    return(
      <div className="App">
        <Particles className='particles'
                params={particlesOptions}         
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
                    
      </div>
    );
  }
}


export default App;

