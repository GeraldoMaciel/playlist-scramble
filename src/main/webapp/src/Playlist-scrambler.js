import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
         result: null,
         searchTerm: DEFAULT_QUERY,
        };

        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    }

    onDismiss(id) {
        const isNotId = item => item.objectID !== id;
       const updatedHits = this.state.result.hits.filter(isNotId);
        this.setState({
            result: Object.assign({}, this.state.result, { hits: updatedHits })
        });
    }

    onSearchChange(event) {
        this.setState({ searchTerm: event.target.value });
     }

    onSearchSubmit(event) {
        const { searchTerm } = this.state;
        this.fetchSearchTopStories(searchTerm);
        event.preventDefault();
     }



     componentDidMount() {
         const { searchTerm } = this.state;
         this.fetchSearchTopStories(searchTerm);
     }

     fetchSearchTopStories(searchTerm, page = 0) {
         axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
         .then(result => this.setSearchTopStories(result.data))
         .catch(error => error);
     }

       setSearchTopStories(result) {
           const { hits, page } = result;
           const oldHits = page !== 0
            ? this.state.result.hits
            : [];
           const updatedHits = [
            ...oldHits,
            ...hits
           ];
           this.setState({
                          result: { hits: updatedHits, page }
                         });
       }


    render() {
        const { searchTerm, result } = this.state;
        const page = (result && result.page) || 0;
        if (!result) { return null; }
        console.log(this.state);
        return (
            <div className="App">
               <Search
                 value={searchTerm}
                  onChange={this.onSearchChange}
                  onSubmit={this.onSearchSubmit}>
               Search
               </Search>
               <Table
                list={result.hits}
                onDismiss={this.onDismiss}/>
                <div className="interactions">
                    <button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
                    More
                    </button>
                </div>
            </div>
        );
    }
}



const Search = ({
    value,
    onChange,
    onSubmit,
    children
    }) =>
        <form onSubmit={onSubmit}>
            <input
                type="text"
                value={value}
                onChange={onChange}
            />
            <button type="submit">
                {children}
            </button>
        </form>


class Table extends Component {
    render() {
        const { list, onDismiss } = this.props;
        return (
            <div>
            {list.map(item =>
            <div key={item.objectID}>
            <span>
            <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
            <button
            onClick={() => onDismiss(item.objectID)}
            type="button"
            >
            Dismiss
            </button>
            </span>
            </div>
            )}
            </div>
        );
    }
}

export default App;
