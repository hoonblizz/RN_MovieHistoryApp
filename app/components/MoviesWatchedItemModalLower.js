
import React from 'react';
import {ScrollView, StyleSheet, Text, View, Alert} from 'react-native';
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
      <View style={styles.viewContainer}>

        <Card
          title={movie.Title + ' ('+ movie.Year +')'}
          image={{uri: movie.Poster}}
          imageProps={{resizeMode: "contain"}}
          containerStyle={{margin: "auto"}}
        >
          <ScrollView style={styles.scrollContainer}>
            <Text style={{marginBottom: 5}}>
              {movie.Rated + ' | ' + movie.Runtime + '\n' + movie.Genre}
            </Text>

            <Text style={{fontWeight: "600", marginBottom: 10}}>Average Rating:
            <Text style={{color: "red"}}>{'    ' + movie.imdbRating}</Text>
            </Text>

            <Text style={{fontWeight: "600"}}>Casting:</Text>
            <Text style={{marginBottom: 5}}>{movie.Actors}</Text>

            <Text style={{fontWeight: "600"}}>Director:</Text>
            <Text style={{marginBottom: 5}}>{movie.Director}</Text>

            <Text style={{fontWeight: "600"}}>Writer:</Text>
            <Text style={{marginBottom: 5}}>{movie.Writer}</Text>

            <Text style={{fontWeight: "600"}}>Production:</Text>
            <Text style={{marginBottom: 5}}>{movie.Production}</Text>
          </ScrollView>

        </Card>

        <Button
          style={styles.removeButton}
          title="Remove from list"
          type="outline"
          onPress={this.props.handleOnRemoveFromList}
        />

      </View>
    );
  }
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 5,
    justifyContent: 'center'
  },
  scrollContainer: {
    height: "50%",
  },
  removeButton: {
    position: "absolute", bottom: 10, width: "90%", marginLeft: "5%", borderRadius: 15
  }
});



export default MoviesWatchedItemModalLower;
