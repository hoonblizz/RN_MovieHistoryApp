import React from 'react';
import {FlatList, ScrollView, StyleSheet, Text, View, Alert} from 'react-native';
import { ListItem, Overlay, AirbnbRating } from 'react-native-elements';
import MoviesWatchedItemModal from './MoviesWatchedItemModal';
import AsyncStorage from '@react-native-community/async-storage';

// https://facebook.github.io/react-native/docs/using-a-listview
// https://react-native-training.github.io/react-native-elements/docs/listitem.html

class MoviesWatchedList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      totalMovieData: props.totalMovieData,
      selectedMovieData: {}
    };

    this.handleOnSelectMovie = this.handleOnSelectMovie.bind(this);
    this.handleOnFinishRating = this.handleOnFinishRating.bind(this);
    this.handleOnDateSelected = this.handleOnDateSelected.bind(this);
    this.handleOnRemoveFromList = this.handleOnRemoveFromList.bind(this);

  }

  handleOnSelectMovie(selectedMovie) {
    this.setState({
      modalVisible: true,
      selectedMovieData: selectedMovie
    });
  }

  handleOnFinishRating(ratingVal) { // passed as prop to modal
    this.props.handleOnFinishRating(this.state.selectedMovieData, ratingVal);
  }

  handleOnDateSelected(dateString) { // passed as prop to modal
    this.props.handleOnDateSelected(this.state.selectedMovieData, dateString);
  }

  handleOnRemoveFromList() { // passed as prop to modal
    this.props.handleOnRemoveFromList(this.state.selectedMovieData);
    this.setState({ modalVisible: false }); // close modal
  }

  render() {
    let list = this.state.totalMovieData;

    if(list.length > 0) {
      return (
        <View style={{marginBottom: 85}}>
          <ScrollView>
            {
              list.map((el, i) => (
                <ListItem
                  key={el.imdbID}
                  leftAvatar={{ source: { uri: el.Poster } }}
                  title={el.Title}
                  subtitle={el.Genre + '\nWatched: ' + el.watched}
                  badge={{ value: el.myRating, textStyle: { color: 'white' }, containerStyle: { marginTop: -20 } }}
                  chevronColor="black"
                  chevron
                  onPress={() => { this.handleOnSelectMovie(el) }}
                />
              ))
            }
          </ScrollView>

          <Overlay
            isVisible={this.state.modalVisible}
            onBackdropPress={() => this.setState({ modalVisible: false })}
            borderRadius={10}
          >
            <MoviesWatchedItemModal
              movieDetail={this.state.selectedMovieData}
              handleOnFinishRating={this.handleOnFinishRating}
              handleOnDateSelected={this.handleOnDateSelected}
              handleOnRemoveFromList={this.handleOnRemoveFromList}
            />
          </Overlay>

        </View>
      );
    } else {
      return(
        <View style={{top: 200, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontWeight: '600', fontSize: 16}}>Search and Add Movies!</Text>
        </View>
      );
    }

  }
};

export default MoviesWatchedList;
