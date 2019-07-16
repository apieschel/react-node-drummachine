// Sources 
// https://www.codeproject.com/Articles/1202580/Build-a-Metronome-in-React

import React, { Component } from 'react';
import './App.css';
import Recorder from 'recorder-js';

class App extends Component {
    constructor(props) {
    super(props);
      
    const ac = new AudioContext();
    const recorderNode = ac.createGain();
    const rec = new Recorder(recorderNode);
    
    const kick = new Audio('https://cdn.glitch.com/17f54245-b142-4cf8-a81b-65e0b36f6b8f%2FMT52_bassdrum.wav?1551990664247');
    const snare = new Audio('https://cdn.glitch.com/17f54245-b142-4cf8-a81b-65e0b36f6b8f%2FMT52_snare.wav?1551990663373');
    const snareSide = new Audio('https://cdn.glitch.com/17f54245-b142-4cf8-a81b-65e0b36f6b8f%2FMT52_snare_sidestick.wav?1551990663860');
    const conga = new Audio('https://cdn.glitch.com/17f54245-b142-4cf8-a81b-65e0b36f6b8f%2FMT52_conga.wav?1551990662263');
    const congaHigh = new Audio('https://cdn.glitch.com/cc093c8e-9559-4f24-a71e-df60d5b1502c%2FMT52_conga_high.wav?1550690555911');
    const highHat = new Audio('https://cdn.glitch.com/17f54245-b142-4cf8-a81b-65e0b36f6b8f%2FMT52_hihat.wav?1551990662668');
    const openHat = new Audio('https://cdn.glitch.com/17f54245-b142-4cf8-a81b-65e0b36f6b8f%2FMT52_openhat.wav?1551990662961');
    
    const DATA = {
      step: 0,
      tracks: [ 
           { steps: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], 
                 playSound: kick, name: "kick" },
           { steps: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], 
                 playSound: snare, name: "snare" },
           { steps: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], 
                 playSound: snareSide, name: "snareSide" },
           { steps: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], 
                 playSound: conga, name: "conga" },
           { steps: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], 
                 playSound: congaHigh, name: "congaHigh" },
           { steps: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], 
                 playSound: highHat, name: "highHat" },
           { steps: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], 
                 playSound: openHat, name: "openHat" }
      ]
    };
      
    this.state = {
      ac: ac,
      recorderNode: recorderNode,
      rec: rec,
      data: DATA,
      play: false,
	    loop: false,
      playing: false,
      step: 0,
      bpm: 100,
      beatsPerMeasure: 4,
      intervalId: 0,
      currentCount: 10
    }
    
    this.clickPlay = this.clickPlay.bind(this);
	  this.handleKeyPress = this.handleKeyPress.bind(this);
	  this.handleClick = this.handleClick.bind(this);
    this.handleBpmChange = this.handleBpmChange.bind(this);
    this.handleStartStop = this.handleStartStop.bind(this);
    this.playClick = this.playClick.bind(this);
    this.drawTracks = this.drawTracks.bind(this);
    this.drawButton = this.drawButton.bind(this);
    this.timer = this.timer.bind(this);
  }
	
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
    
    let intervalId = setInterval(this.timer, 120);
    // store intervalId in the state so it can be accessed later:
    this.setState({intervalId: intervalId});
    console.log(this.state);
  }
	
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
    
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }
    
  handleStartStop(e) {
    if(this.state.playing) {
    // Stop the timer
    clearInterval(this.timer);
    this.setState({
      playing: false
    });
    } else {
      // Start a timer with the current BPM
      this.timer = setInterval(this.playClick, (60 / this.state.bpm) * 1000);
      this.setState({
        count: 0,
        playing: true
        // Play a click "immediately" (after setState finishes)
      }, this.playClick);
    }
  }
  
  playClick() {
    const count = this.state.count; 
    const beatsPerMeasure = this.state.beatsPerMeasure;

    // The first beat will have a different sound than the others
    if(count % beatsPerMeasure === 0) {
      this.kick.play();
    } else {
      this.snare.play();
    }

    // Keep track of which beat we're on
    this.setState(state => ({
      count: (state.count + 1) % state.beatsPerMeasure
    }));
  }
	
  handleKeyPress(e) {
    if(document.getElementById(e.key.toUpperCase())) {
      document.getElementById(e.key.toUpperCase()).play();
      //document.getElementById(e.key.toUpperCase()).parentElement.style.background = "green";
      document.getElementById("display").firstChild.innerText = document.getElementById(e.key.toUpperCase()).parentElement.id;
    }
  }
  
  handleBpmChange(e) {
    const bpm = e.target.value;
    if(this.state.playing) {
      // Stop the old timer and start a new one
      clearInterval(this.timer);
      this.timer = setInterval(this.playClick, (60 / bpm) * 1000);

      // Set the new BPM, and reset the beat counter
      this.setState({
        count: 0,
        bpm: bpm
      });
    } else {
      // Otherwise just update the BPM
      this.setState({ bpm: bpm });
    }
  }
  
  clickPlay(event) {
    this.setState({
      play: true
    });
    event.target.firstChild.play();
    document.getElementById("display").firstChild.innerText = event.target.id;
  }
  
  handleClick(e) {
    let data = this.state.data;
    let track = parseInt(e.target.id.substring(0,1));
    let step = parseInt(e.target.id.substring(2,));
    let isActive = data.tracks[track].steps[step];
    
    // toggle "play" for this step on or off
    isActive ? data.tracks[track].steps[step] = false : data.tracks[track].steps[step] = true;
    
    // toggle the background color of the step to indicate on or off
    isActive ? e.target.className = "grey" : e.target.className = "red";
    
    this.setState({ data: data });
    console.log(data.tracks);
  }
  
  drawTracks() {
    let sounds = this.state.data.tracks;
    let tracks = [];
    for(let i = 0; i < sounds.length; i++) {
      tracks.push(
      <div key={i} className={sounds[i].name}>
        <div id={i + "_0"} className="grey" onClick={this.handleClick}></div>
        <div id={i + "_1"} className="grey" onClick={this.handleClick}></div>
        <div id={i + "_2"} className="grey" onClick={this.handleClick}></div>
        <div id={i + "_3"} className="grey" onClick={this.handleClick}></div>
        <div id={i + "_4"} className="grey" onClick={this.handleClick}></div>
        <div id={i + "_5"} className="grey" onClick={this.handleClick}></div>
        <div id={i + "_6"} className="grey" onClick={this.handleClick}></div>
        <div id={i + "_7"} className="grey" onClick={this.handleClick}></div>
        <div id={i + "_8"} className="grey" onClick={this.handleClick}></div>
        <div id={i + "_9"} className="grey" onClick={this.handleClick}></div>
        <div id={i + "_10"} className="grey" onClick={this.handleClick}></div>
        <div id={i + "_11"} className="grey" onClick={this.handleClick}></div>
        <div id={i + "_12"} className="grey" onClick={this.handleClick}></div>
        <div id={i + "_13"} className="grey" onClick={this.handleClick}></div>
        <div id={i + "_14"} className="grey" onClick={this.handleClick}></div>
        <div id={i + "_15"} className="grey" onClick={this.handleClick}></div>
      </div>);
    }
    return tracks;
  }
  
  drawButton() {
    let position = 0;
    if(this.state.currentCount !== 0) {
      position = (70 * this.state.currentCount);
    }
    return <div className="count" style={{left: position}}></div>;  
  }
  
  timer() {
    let data = this.state.data;
    let state = this.state;
    if(this.state.currentCount < 15) {
      data.step = data.step + 1;
      this.setState({ currentCount: this.state.currentCount + 1 , data: data});
    } else {
      data.step = 0;
      this.setState({ currentCount: 0, data: data });
    }
    
    data.tracks
    .filter(function(track) { return track.steps[data.step]; })
    .forEach(function(track) {
      let clone = track.playSound.cloneNode(true);
      let buffer;
      
      const request = new XMLHttpRequest();
      request.open('GET', track.playSound.src, true);
      request.responseType = 'arraybuffer';
      request.onload = function() {
        state.ac.decodeAudioData(request.response, function(buffer) {
          buffer = buffer;
        
          const gain = state.ac.createGain();
          const playSound = state.ac.createBufferSource();
          playSound.buffer = buffer;
          playSound.connect(gain);
          gain.connect(state.recorderNode);
          gain.connect(state.ac.destination);
          playSound.start(0);

          clone.remove();
        });     
      }
      
      request.send();
    });
  }
	
  render() {
    return (
      <div id="display">
        <div className="pad-container col-12">
	  				{this.drawTracks()}
        </div> 
        <div className="count-container">
            {this.drawButton()}
        </div>  
      </div>
    );
  }
}

/*
document.onkeypress = function (e) {
    e = e || window.event;
	if(document.getElementById(e.key.toUpperCase())) {
		for (let i = 0; i < document.querySelectorAll(".drum-pad").length; i++) {
			if(document.querySelectorAll(".drum-pad")[i].innerText === e.key.toUpperCase()) {
				document.querySelectorAll(".drum-pad")[i].firstChild.play();
			}
		}
	}
};
*/

export default App;