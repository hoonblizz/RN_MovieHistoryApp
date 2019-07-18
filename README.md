# React Native Sample Project
## Movie History App

## Intro
Project that tracks my personal movie history.  <br>
Search for the movie you have watched and add it to your list. <br>
In the list, you may rate the movie or change the date you've watched. <br>

## Main Structure
**App.js** <br>
contains Tab Views divided into `<MoviesWatchedList />` and `<MovieSearchContainer />`. <br>
<br>
**MoviesWatchedList.js** <br>
displays the list of movies that user added. Also, when user clicks on it, it shows details about the movie with various options such as rating and changing date. It's also possible to remove the movie from the list. <br>
<br>
**MovieSearchContainer.js** <br>
contains a searchbar that searches the movie by title. User can add them into the list. <br>
<br>

## Installation
Clone This project and go to project folder. <br>
`git clone https://github.com/hoonblizz/RN_MovieHistoryApp.git` <br>
`cd ./RN_MovieHistoryApp` <br>
<br>
Download **key** folder and place it in the project folder. <br>
(At the same level as **components** folder) <br>
<br>
Install modules <br>
`npm install` <br>
<br>
Start React Native <br>
`react-native run-ios` <br>
<br>
## Troubleshoot
### Build error 65
In some cases, it's because of 'manually linked' dependencies such as 'async storage' and 'vector-icon'. <br>
Try [Autolinking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md). <br>

```
cd ios && pod install && cd ..
react-native run-ios
```
<br>
If none of the above works but still getting Build error 65, <br>
Please try the following steps: <br>
<br>
1. Delete 'build' folder in 'ios' folder. <br>
2. Delete 'node_module' folder and reinstall using `npm install`<br>
3. killall -9 node
4. react-native start --reset-cache <br>






