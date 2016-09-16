// Form component
class Form extends React.Component {
  constructor (props) {
    super();

    this.state = {
      includeAsMember: props.includeAsMember,
      user: props.user
    };
  }

  handleSubmit (event) {
    event.preventDefault();

    this.props.onSearch({
      user: this.state.user,
      includeAsMember: this.state.includeAsMember
    });
  }

  handleUser (event) {
    this.setState({user: event.target.value});
  }

  handleIncludeAsMember (event) {
    this.setState({includeAsMember: event.target.checked});
  }

  render () {
    return <form onSubmit={this.handleSubmit.bind(this)}>
      <div>
        <input type="text" value={this.state.user} onChange={this.handleUser.bind(this)}/>
        <button type="submit">Search</button>
      </div>
      <input type="checkbox" checked={this.state.includeAsMember} onChange={this.handleIncludeAsMember.bind(this)}/>
      <label>Include repositories that user is member</label>
    </form>;
  }
}

// Result component
class Result extends React.Component {
  render () {
    var result = this.props.result;

    return <li>
      <h3>
        <a href={result.html_url} target="_blank">
          {result.name}
        </a>
      </h3>

      <p>{result.fork}</p>
      <p>{result.description}</p>
      <p>{moment(result.updated_at).fromNow()}</p>

      <div>
        <div>
          <span>{result.language}</span>
        </div>
        <div>
          <i className="fa fa-code-fork"></i>
          <span>{result.forks_count}</span>
        </div>
        <div>
          <i className="fa fa-star"></i>
          <span>{result.stargazers_count}</span>
        </div>
        <div>
          <i className="fa fa-eye"></i>
          <span>{result.watchers_count}</span>
        </div>
      </div>
    </li>;
  }
}

// Results component
class Results extends React.Component {
  render () {

    return <ul className="result-list">
      {
        this.props.results.map(function(result){
          return <Result key={result.id} result={result} />
        })
      }
    </ul>;
  }
}

// App component
class App extends React.Component {
  constructor () {
    super();

    this.state = {
      includeAsMember: false,
      user: 'fabianVeliz',
      results: []
    };
  }

  // Get results first time
  componentDidMount() {
    this.searchResults(this.state);
  }

  searchResults (params) {
    var url = 'https://api.github.com/users/' + params.user + '/repos?sort=updated' ;

    if (params.includeAsMember) url+= '&type=all';

    fetch(url).then(function(response){
      if (response.ok) {
        response.json().then(function(results){
          this.setState({results: results})
        }.bind(this));
      } else {
        this.setState({results: []});
      }
    }.bind(this));
  }

  changeTerm (state) {
    this.setState(state);
    this.searchResults(state);
  }

  render () {
    return <div className="app">
      <Form
        user={this.state.user}
        includeAsMember={this.state.includeAsMember}
        onSearch={this.changeTerm.bind(this)}
      />
      <Results results={this.state.results}/>
    </div>;
  }
}

// Render app
ReactDOM.render(<App />, document.getElementById('content'));