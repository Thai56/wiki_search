import React, { PureComponent } from 'react';
import axios from 'axios';
import { Map, fromJS } from 'immutable';
import { Segment, Input, Header, Divider, Form } from 'semantic-ui-react';
import styled from 'styled-components';
import './App.css';

export const searchURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=';

const AppWrapper = styled.div.attrs({
  className: 'App',
})`
  height: 100vh;
  background-color: #f9f9f9;
`;

const segmentStyle = { cursor: 'pointer', marginBottom: 24 };

const BoldHeader = styled.h3`
  font-weigth: 600;
`;

const PlainList = styled.ul`
  list-style: none;
  padding: 0 10px 0 10px;
`;

const ResultContainer = styled.div.attrs({
  className: 'result-container',
})``;

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
              <BoldHeader>{resultMap.get('result')}</BoldHeader>
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
      <AppWrapper>
      {/*<div className="App" style={containerStyle}>*/}
        <div className="App-header">
          <Header as='h2'>WikiMedia Search</Header>
          <Divider />
          <Form onSubmit={this.handleSubmit}>
            <Input type='text' value={this.state.search} onChange={(e) => this.setState({ search: e.target.value })}/>
          </Form>
        </div>
        <ResultContainer>
          {
            this.state.resultsMap
            &&
            <PlainList>{this.getFormattedResults()}</PlainList>
          }
        </ResultContainer>
      {/*</div>*/}
      </AppWrapper>
    );
  }
}

export default App;
