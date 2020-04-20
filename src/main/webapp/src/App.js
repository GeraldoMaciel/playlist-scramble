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
         initialList: null,
         selectedList: [],
        };

        this.setFetchedInitialList = this.setFetchedInitialList.bind(this);
        this.fetchInitialList = this.fetchInitialList.bind(this);
        this.onChange = this.onChange.bind(this);
        this.generateRandomizedPlaylist = this.generateRandomizedPlaylist.bind(this);
        this.setRandomizedPlayList = this.setRandomizedPlayList.bind(this);
    }

    onChange = (selectedList) => {
            this.setState({ selectedList });
        };

     componentDidMount() {
         this.fetchInitialList();
     }

     fetchInitialList() {
         axios(`${PATH_BASE}${PATH_FETCH_PLAY_LIST}?${PARAM_TOKEN}${this.props.token}`)
         .then(result =>  this.setFetchedInitialList(result.data))
         .catch(error => error);
     }

      setFetchedInitialList(data){
       let initialList = data.map(({id,name}) =>  ({value: id, label: name}));
       this.setState({initialList});
      }

      setRandomizedPlayList(data){
        this.setState({randomizedPlayList: data});
     }

      generateRandomizedPlaylist(){
        axios(`${PATH_BASE}${PATH_GENERATE_RANDOMIZED_PLAYLIST}?${PARAM_TOKEN}${this.props.token}&${PARAM_PLAYLISTARRAY}${this.state.selectedList}`)
                 .then(result =>  this.setRandomizedPlayList(result.data))
                 .catch(error => error);
      }




    render() {
        if (!this.state.initialList){
            return null;
        }

         return (

         <div className="App"><Title/>
         <div className="container"> <DualListBox options={this.state.initialList} selected={this.state.selectedList} onChange={this.onChange}/>
         <button type="button" disabled={this.state.selectedList.length == 0} onClick={() => this.generateRandomizedPlaylist()}> Generate randomized playlist </button>
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
