
import React from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import { AirbnbRating, Button } from 'react-native-elements';
import MoviesWatchedItemModalUpper from './MoviesWatchedItemModalUpper';
import MoviesWatchedItemModalLower from './MoviesWatchedItemModalLower';

class MoviesWatchedItemModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>

        <MoviesWatchedItemModalUpper
          pickedDate={this.props.movieDetail.watched}
          myRating={this.props.movieDetail.myRating}
          handleOnFinishRating={this.props.handleOnFinishRating}
          handleOnDateSelected={this.props.handleOnDateSelected}
        />

        <MoviesWatchedItemModalLower
          movieDetail={this.props.movieDetail}
          handleOnRemoveFromList={this.props.handleOnRemoveFromList}
        />

      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});


export default MoviesWatchedItemModal;
