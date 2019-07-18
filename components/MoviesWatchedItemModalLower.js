
import React from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import { Button, Card } from 'react-native-elements';


class MoviesWatchedItemModalLower extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieDetail: props.movieDetail
    }
  }

  render() {

    const movie = this.state.movieDetail;
    //const ratings = 
    return (
      <View>

        <Card
          title={movie.Title + ' ('+ movie.Year +')'}
          image={{uri: movie.Poster}}
        >
          <Text style={{marginBottom: 5}}>
            {movie.Rated + ' | ' + movie.Runtime + '\n' + movie.Genre}
          </Text>

          <Text style={{fontWeight: "600"}}>Director:</Text>
          <Text style={{marginBottom: 5}}>{movie.Director}</Text>

          <Text style={{fontWeight: "600"}}>Casting:</Text>
          <Text style={{marginBottom: 5}}>{movie.Actors}</Text>

          <Button
            style={{marginTop: 20}}
            title="Remove from list"
            type="outline"
            onPress={this.props.handleOnRemoveFromList}
          />
        </Card>

      </View>
    );
  }
};



export default MoviesWatchedItemModalLower;
