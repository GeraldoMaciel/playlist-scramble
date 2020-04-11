import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'http://localhost:8080/';
const PATH_FETCH_PLAY_LIST = '/fetchPlaylist';
const PARAM_TOKEN = 'token=';



class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
         result: null,
        };

        this.setFetchedResult = this.setFetchedResult.bind(this);
        this.fetchPlaylists = this.fetchPlaylists.bind(this);
    }

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



    render() {
        if (!this.state.result){
            return null;
        }
        return (<div className="App"> <Table list={this.state.result.items}  />  </div>)
    }
}






class Table extends Component {
    render() {
        const { list } = this.props;
        return (
            <div>
                {list.map(item =>
                    <div key={item.id}>
                        <span>{item.name}</span>
                        <span>{item.isCollaborative}</span>
                        <span>{item.isPublicAccess}</span>
                    </div>
                )}
            </div>
        );
    }
}

export default App;
