import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';


const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'http://localhost:8080/';
const PATH_FETCH_PLAY_LIST = '/fetchPlaylist';
const PATH_GENERATE_RANDOMIZED_PLAYLIST = '/generateRandomizedPlaylist';
const PARAM_TOKEN = 'token=';
const PARAM_PLAYLISTARRAY = 'playlistArray=';



class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
         result: null,
         selected: [],
        };

        this.setFetchedResult = this.setFetchedResult.bind(this);
        this.fetchPlaylists = this.fetchPlaylists.bind(this);
        this.onChange = this.onChange.bind(this);
        this.generateRandomizedPlaylist = this.generateRandomizedPlaylist.bind(this);
        this.setRandomizedPlayList = this.setRandomizedPlayList.bind(this);
    }

    onChange = (selected) => {
            this.setState({ selected });
        };

     componentDidMount() {
         this.fetchPlaylists(this.props.token);
     }

     fetchPlaylists(token) {
         axios(`${PATH_BASE}${PATH_FETCH_PLAY_LIST}?${PARAM_TOKEN}${token}`)
         .then(result =>  this.setFetchedResult(result.data))
         .catch(error => error);
     }

      setFetchedResult(data){
       this.setState({result: data});
      }

      setRandomizedPlayList(data){
        console.log(data);
        this.setState({randomizedPlayList: data});
     }

      generateRandomizedPlaylist(){
        axios(`${PATH_BASE}${PATH_GENERATE_RANDOMIZED_PLAYLIST}?${PARAM_TOKEN}${this.props.token}&${PARAM_PLAYLISTARRAY}${this.state.selected}`)
                 .then(result =>  this.setRandomizedPlayList(result.data))
                 .catch(error => error);
      }




    render() {
        if (!this.state.result){
            return null;
        }
        console.log(this.state);
         return (

         <div className="App"><Title/>
         <div className="container"> <DualListBox options={this.state.result} selected={this.state.selected} onChange={this.onChange}/>
         <button type="button" onClick={() => this.generateRandomizedPlaylist()}> Generate randomized playlist </button>
         </div> </div>

         );
    }
}








class Title extends Component {
    render() {
        return (
            <div>
                <h1>PLAYLIST SCRAMBLER</h1>
            </div>
        );
    }
}

export default App;
