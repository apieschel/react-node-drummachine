// Sources 
// https://www.codeproject.com/Articles/1202580/Build-a-Metronome-in-React

import React, { Component } from 'react';
import './App.css';
import Recorder from './recorder.js';

class App extends Component {
    constructor(props) {
    super(props);
      
    const ac = new AudioContext();
    const recorderNode = ac.createGain();
    
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
      rec: null,
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
    
	  this.handleClick = this.handleClick.bind(this);
    this.drawTracks = this.drawTracks.bind(this);
    this.drawButton = this.drawButton.bind(this);
    this.timer = this.timer.bind(this);
    this.record = this.record.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.exportWav = this.exportWav.bind(this);
  }
	
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
    
    const rec = new Recorder(this.state.recorderNode, [{workerPath: 'js/recorderjs/recorderWorker.js'}]);
    const intervalId = setInterval(this.timer, 120);
    
    // store intervalId in the state so it can be accessed later:
    this.setState({intervalId: intervalId, rec: rec});
  }
	
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
    
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }
  
  handleClick(e) {
    let data = this.state.data;
    let track = parseInt(e.target.id.substring(0,1));
    let step = parseInt(e.target.id.substring(2,));
    let isActive = data.tracks[track].steps[step];
    
    // toggle "play" for this step on or off
    isActive ? data.tracks[track].steps[step] = false : data.tracks[track].steps[step] = true;
    
    // toggle the background color of the step to indicate on or off
    isActive ? e.target.className = "white" : e.target.className = "green";
    
    this.setState({ data: data });
    console.log(data.tracks);
  }
  
  drawTracks() {
    let sounds = this.state.data.tracks;
    let tracks = [];
    for(let i = 0; i < sounds.length; i++) {
      tracks.push(
      <div key={i} className={sounds[i].name}>
        <div id={i + "_0"} className="white" onClick={this.handleClick}></div>
        <div id={i + "_1"} className="white" onClick={this.handleClick}></div>
        <div id={i + "_2"} className="white" onClick={this.handleClick}></div>
        <div id={i + "_3"} className="white" onClick={this.handleClick}></div>
        <div id={i + "_4"} className="white" onClick={this.handleClick}></div>
        <div id={i + "_5"} className="white" onClick={this.handleClick}></div>
        <div id={i + "_6"} className="white" onClick={this.handleClick}></div>
        <div id={i + "_7"} className="white" onClick={this.handleClick}></div>
        <div id={i + "_8"} className="white" onClick={this.handleClick}></div>
        <div id={i + "_9"} className="white" onClick={this.handleClick}></div>
        <div id={i + "_10"} className="white" onClick={this.handleClick}></div>
        <div id={i + "_11"} className="white" onClick={this.handleClick}></div>
        <div id={i + "_12"} className="white" onClick={this.handleClick}></div>
        <div id={i + "_13"} className="white" onClick={this.handleClick}></div>
        <div id={i + "_14"} className="white" onClick={this.handleClick}></div>
        <div id={i + "_15"} className="white" onClick={this.handleClick}></div>
      </div>);
    }
    return tracks;
  }
  
  drawButton() {
    let position = 0;
    if(this.state.currentCount !== 0) {
      position = (39 * this.state.currentCount);
    }
    return <div className="count" style={{left: position}}></div>;  
  }
  
  record() {
    let rec = this.state.rec;
    rec.record();
    console.log(rec);
    this.setState({ rec: rec });
    document.getElementById("record").className = "hidden";
    document.getElementById("stop").className = "";  
  }
  
  stopRecord() {
    let rec = this.state.rec;
    rec.stop();
    console.log(rec);
    this.setState({ rec: rec });
    document.getElementById("stop").className = "hidden";
    document.getElementById("wav").className = "";
  }
  
  exportWav() {
    let rec = this.state.rec;
    rec.exportWAV(function(blob) {
      const audio = document.createElement("audio");
      const url = URL.createObjectURL(blob);
      console.log(url);
      audio.src = url;
      audio.controls = "true";
      const flex = document.createElement("div");
      flex.className = "flex-container";
      flex.append(audio);
      document.querySelector(".recordContainer").append(flex);    
      document.getElementById("wav").className = "hidden";
      document.getElementById("record").className = "";
    });
    
    this.setState({rec: rec});
    console.log(rec);
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
        <h1>Javascript Drum Machine</h1>
        <h2> Set tempo with external MIDI device, upload your own samples, and record your own drum loops in the web browser.</h2>
        
        <div className="flex-container outer">
          <div className="view">    
            <form encType="multipart/form-data" method="POST" action="/api/fileanalyse" id="upload">
              <div className="flex-container">
                <input id="inputfield" type="file" className="upfile" multiple required></input>
                <input id="button" type="submit" value="UPLOAD"></input>
              </div>
            </form>
            <form method="GET" action="/music/directory" id="currentFiles" className="hidden">
              <div className="flex-container" id="wavContainer">
                <input id="getFiles" type="submit" value="LOAD .WAV FILES"></input>
              </div>
            </form>
            <form action="/music/delete" id="clearDirectory" className="hidden">
              <div className="flex-container">
                <input type="submit" value="CLEAR DIRECTORY" id="clear"></input>
              </div>
            </form>

            <div className="instructions">
              <h3>Instructions</h3>
              <ul>
                <li><strong><u>DRUM MACHINE</u></strong>: Click on the white squares to play different sounds on the default drum machine.
                <a href="http://drum-machine.maryrosecook.com/" target="blank">Based on this drum machine by Mary Rose Cook.</a></li>
                <li><strong><u>RECORD</u></strong>: Click "RECORD" to start recording your drum loop. 
                Click again to stop recording. Then click again to turn your drum loop 
                into an HTML audio element that you can download as a .wav file (click the three dots on the right side of the audio element, then click "Download").</li>
                <li><strong><u>CLEAR TRACKS</u></strong>: Press "C" on your keyboard to clear the tracks.</li>
                <li><strong><u>UPLOAD</u></strong>: You can upload your own sample packs to play with this drum machine.
                Click "Choose Files." Hold "Shift" and click to select a group of audio files to upload from your computer, 
                or hold "Ctrl" and click to select multiple files one by one. For now, only .wav files are accepted.
                Click "Upload" once you've selected the files you want. A directory will be created on this server based on your IP address.
                This directory will be deleted periodically in order to stay within storage limits.<strong> Please wait 2 minutes between uploads to ensure files are properly indexed!</strong></li>     
                <li><strong><u>LOAD .WAV FILES</u></strong>: Use the dropdown to choose from different sample packs you have uploaded.
                Then, click "LOAD .WAV FILES" to load your samples into the drum machine. If you want to go back to the default drum machine (Casio SA-10 Samples),
                just refresh the page.</li>
                <li><strong><u>CLEAR DIRECTORY</u></strong>: This will delete your personal directory along with all of the files you have uploaded.</li>
                <li><strong><u>MIDI</u></strong>: Web browsers aren't great at keeping accurate time. If you want a more accurate BPM, 
                then you can hook up an external sampler or drum machine to your computer (via MIDI interface) to keep time. 
                Tell the drum machine to play 16 straight sixteenth notes, 
                and this machine in the browser will update its count every time your external 
                drum machine plays a note. Click the "MIDI" button, and try it out! 
                While MIDI is off, the browser will do its best to keep time on its own. </li>
              </ul>
            </div>
          </div>

          <div className="container">
            <div className="recordContainer">
              <div className="flex-container">
                <button id="record" onClick={this.record}>RECORD</button>
                <button id="stop" className="hidden" onClick={this.stopRecord}>Stop</button>
                <button id="wav" className="hidden" onClick={this.exportWav}>Export Wav</button>
                <button id="midi">MIDI OFF</button>
              </div>
            </div>

            <div className="pad-container col-12">
                {this.drawTracks()}
            </div>

            <div className="count-container">
                {this.drawButton()}
            </div>
          </div>
        </div>  
      </div>
    );
  }
}

export default App;