
import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';

import { createBottomTabNavigator, createAppContainer, NavigationEvents } from 'react-navigation';
import { getLocalData, setLocalData } from './apis/localStorage';
import { keyNames } from './apis/keyNames';
import { TotalMovieListContext } from './apis/contexts';
import StatusBarControl from './components/StatusBarControl';
import MoviesWatchedList from './components/MoviesWatchedList';
import MovieSearchContainer from './components/MovieSearchContainer';
import firebase from 'react-native-firebase';
import Keys from '../key/Keys';

class ListScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const Banner = firebase.admob.Banner;
    const AdRequest = firebase.admob.AdRequest;
    const request = new AdRequest();

    const unitId = Keys.admob_unitID_ios;

    return (
      <View>
        <StatusBarControl />
        <Banner
          unitId={unitId}
          size={'SMART_BANNER'}
          request={request.build()}
          onAdLoaded={() => {
            //console.log('Advert loaded');
          }}
        />
        <MoviesWatchedList />
        <NavigationEvents />
      </View>
    );
  }
}

class SearchScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <StatusBarControl />
        <MovieSearchContainer />
      </View>
    );
  }
}

const TabNavigator = createBottomTabNavigator(
  {
    List: ListScreen,
    Search: SearchScreen
  },
  {
    tabBarOptions: {
      activeTintColor: '#e91e63',
      labelStyle: {
        fontSize: 16,
        fontWeight: "600"
      },
      style: {
        backgroundColor: 'white'
      },
    }
  }
);

const AppContainer = createAppContainer(TabNavigator);

export default class App extends Component {
  //const contextValue = useContext(TotalMovieListContext);

  constructor(props) {
    super(props);

    // https://stackoverflow.com/questions/41030361/how-to-update-react-context-from-inside-a-child-component
    // https://stackoverflow.com/questions/50502664/how-to-update-the-context-value-in-provider-from-the-consumer
    this.setTotalMovieDataFnc = (updatedTotalMovieData) => {
      this.setState({
        totalMovieData: [...updatedTotalMovieData]
      });
      console.log('Set Movie done!! ');
    };

    this.state = {
      totalMovieData: [],
      setTotalMovieDataFnc: this.setTotalMovieDataFnc
    };

    this.loadData = this.loadData.bind(this);

  }

  async loadData() {

    const watchedMovieList = await getLocalData(keyNames.watchedMovieList);

    if(watchedMovieList) {
      const movieListArray = JSON.parse(watchedMovieList);
      this.setState({ totalMovieData: [...movieListArray] });
    }

  }

  componentDidMount() {
    this.loadData();
  }

  render() {

    return (
      <TotalMovieListContext.Provider value={this.state}>
        <AppContainer />
      </TotalMovieListContext.Provider>
    );
  }
}
