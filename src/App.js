import React, { PureComponent } from 'react';
import axios from 'axios';
import { Map, fromJS } from 'immutable';
import { Segment, Input, Header, Divider, Form } from 'semantic-ui-react';
import './App.css';

const searchURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=';

const containerStyle = { height: '100vh', backgroundColor: '#f9f9f9'};

const segmentStyle = { cursor: 'pointer', marginBottom: 24 };

const bold = { fontWeight: 600 };

const listStyle = { listStyle: 'none', padding: '0 10px 0 10px' };

class App extends PureComponent {
  state = { search: '', resultsMap: '' }

  handleSubmit = (e) => {
    e.preventDefault();
    axios.get(`${searchURL}${this.state.search}`)
    .then(res => {
      const searchInput = res.data[0];
      const topTenResult = fromJS(res.data[1]);
      const topTenDesc = fromJS(res.data[2]);
      const topTenLinks = fromJS(res.data[3]);
      const resultsMap = new Map({
        searchInput, topTenResult, topTenDesc, topTenLinks,
      });
      this.setState({ resultsMap });
      // console.groupCollapsed('topTenResult');
      // console.log(searchInput);
      // console.log(topTenResult);
      // console.log(topTenDesc);
      // console.log(topTenLinks);
      // console.groupEnd();
    })
    .catch(err => console.log(err));

    this.setState({ search: '' });
  }

  getFormattedResults = () => {
    const { resultsMap } = this.state;
    const topTenResult = resultsMap.get('topTenResult');
    const topTenDesc = resultsMap.get('topTenDesc');
    const topTenLinks = resultsMap.get('topTenLinks');
    // const resultSize = topTenResult.size;
    const formattedResultArr = [];
    topTenResult.forEach((result, i) => {
      const formattedObject = {
        result,
        desc: topTenDesc.get(i),
        link: topTenLinks.get(i),
      };
      formattedResultArr.push(formattedObject);
    });
    const formattedResultList = fromJS(formattedResultArr)
    return formattedResultList.map((resultMap, i) => {
      return (
        <Segment key={i} style={segmentStyle}>
          <a onClick={() => window.open(resultMap.get('link')) }>
            <li>
              <h3 style={bold}>{resultMap.get('result')}</h3>
              <div>{resultMap.get('desc')}</div>
            </li>
          </a>
        </Segment>
      );
    });
    // console.groupCollapsed('topTenResult', resultsMap)
    // console.log(topTenResult.size);
    // console.log(topTenDesc);
    // console.log(topTenLinks);
    // console.groupEnd();
  }
  render() {
    // console.log(this.state.resultsMap)
    return (
      <div className="App" style={containerStyle}>
        <div className="App-header">
          <Header as='h2'>WikiMedia Search</Header>
          <Divider />
          <Form onSubmit={this.handleSubmit}>
            <Input type='text' value={this.state.search} onChange={(e) => this.setState({ search: e.target.value })}/>
          </Form>
        </div>
        <div className="result-container">
          {
            this.state.resultsMap
            &&
            <ul style={listStyle}>{this.getFormattedResults()}</ul>
          }
        </div>
      </div>
    );
  }
}

export default App;
