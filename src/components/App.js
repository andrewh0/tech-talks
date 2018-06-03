// @flow

import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import Navigation from './Navigation';
import '../index.css';
import About from './About';
import Explore from './Explore';
import VideoPage from './VideoPage';
import { InstantSearch } from 'react-instantsearch/dom';
import 'instantsearch.css/themes/reset.css';

const AppWrapper = styled.div`
  height: 100%;
  min-height: 100%;
`;

class App extends Component<
  {| user: null | Object |},
  {| user: null | Object |}
> {
  state = {
    user: this.props.user || null
  };
  componentDidMount() {
    if (window.TECH_TALKS) {
      this.setState({
        user: window.TECH_TALKS
      });
    }
  }
  render() {
    const { user } = this.state;
    return (
      <AppWrapper>
        <InstantSearch
          appId="D96IC0V8A1"
          apiKey="09658216dd40556f136770d5e7c643fe"
          indexName="dev_SAMPLE_VIDEOS"
        >
          <Navigation user={user} />
          <Route exact path="/" component={Explore} />
          <Route exact path="/about" component={About} />
          <Route
            exact
            path="/videos/:id"
            render={({ match: { params: { id } } }) => (
              <VideoPage videoId={id} />
            )}
          />
        </InstantSearch>
      </AppWrapper>
    );
  }
}

export default App;
