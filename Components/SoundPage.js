import React, { Component } from 'react';
import { Platform,StyleSheet, View, Text ,Slider, Image, TouchableOpacity ,DeviceEventEmitter} from 'react-native';
import GridView from 'react-native-super-grid';
var SoundPlayer = require('react-native-sound');
import EventEmitter from 'EventEmitter';
import { EventRegister } from 'react-native-event-listeners'

// const items = [
//   { index : 0, name: 'Rain', code: '#1abc9c', img:require('./imgs/ic_rain.png'),music:'rain.ogg',volume:50},
//   { index : 1,name: 'Thunderstorm', code: '#2ecc71' , img:require('./imgs/ic_thunders.png',),music:'thunders.ogg',volume:50},
//   { index : 2,name: 'Rain on Window', code: '#3498db',img:require('./imgs/ic_rain_on_window.png'),music:'rain_on_window.ogg',volume:50},
//   { index : 3,name: 'Car', code: '#9b59b6' , img:require('./imgs/ic_car.png'),music:'car.ogg',volume:50},
//   { index : 4,name: 'Wind', code: '#34495e' , img:require('./imgs/ic_wind.png'),music:'wind.ogg',volume:50},
//   { index : 5,name: 'Forest', code: '#16a085' , img:require('./imgs/ic_forest.png'),music:'forest.ogg',volume:50},
//   { index : 6,name: 'Creek', code: '#27ae60' , img:require('./imgs/ic_creek.png'),music:'creek.ogg',volume:50},
//   { index : 7,name: 'Leaves', code: '#2980b9' , img:require('./imgs/ic_leaves.png'),music:'leaves.ogg',volume:50},
// ];
const items = [];

var songsTab1=[];
var songsTab2=[];


export default class SoundPage extends Component {
  constructor(props) {
      super(props)
      items = props.list;
      this.state = {
                  values:
                  [{volume:50, hidden:true}, {volume:50,hidden:true},{volume:50,hidden:true},{volume:50,hidden:true},
                  {volume:50,hidden:true},{volume:50,hidden:true},{volume:50,hidden:true},{volume:50, hidden:true}]
    }
  }
  componentWillMount() {

    }
  componentDidMount(){
    var tab = this.props.tab;
    for(let i = 0; i< this.props.list.length; i++){
      var item = this.props.list[i];
      var song = new SoundPlayer(item.music,SoundPlayer.MAIN_BUNDLE,(error)=>{
        if(error){

        }else {
          song.setNumberOfLoops(-1);
        }
      });
      if(this.props.tab == 0){
        songsTab1.push({music:song, isPlaying:item.isPlaying, item:item});
      }else {
        songsTab2.push({music:song, isPlaying:item.isPlaying, item:item});
      }

    //  console.log(''+item.music);

    }
  }

  componentWillUnmount() {
        EventRegister.removeEventListener(this.listener)
    }
  render() {

    // Taken from https://flatuicolors.com/
    var tab = this.props.tab;
    var songs=[];
    if(tab == 0){
      songs = songsTab1;
    }else {
      songs = songsTab2;
    }

    this.listener = EventRegister.addEventListener('Play_Pause', (data) => {
        if(data.playing){
            // TODO:
            for(let i = 0; i < songs.length ; i++){
              var song = songs[i];
              if(song.isPlaying == true){
                song.music.play();
              }
            }
        }else {
          for(let i = 0; i < songs.length ; i++){
            var song = songs[i].music;
            song.pause();
          }

        }
    })

    this.listener = EventRegister.addEventListener('RemoveSoundPlay', (data) => {
        for(let i = 0; i < songs.length ; i++){
          var song = songs[i].music;
          console.log('Remove '+songs[i].item.name);
          if(songs[i].item.name == data.value.name){
            song.stop();
            console.log('INDEX First: '+this.state.values[data.value.index].hidden);
            this.state.values[data.value.index].hidden = true;
            this.setState({
                value:this.state.values
            });
            break;
          }

        }
    })

    this.listener = EventRegister.addEventListener('UPDATE_VOLUME', (data) => {
        for(let i = 0; i < songs.length ; i++){
          var song = songs[i].music;
          if(songs[i].item.name == data.value.name){
            console.log('VOLUME '+data.value.name);
            song.setVolume(data.value.volume/100.0);
            this.state.values[data.value.index].volume = data.value.volume;
            this.setState({
                value:this.state.values
            });
            break;
          }

        }
    })




    return (
      <GridView
        //itemDimension={100}
        items={this.props.list}
        style={styles.gridView}
        renderItem={item => (
          <TouchableOpacity
          onPress={()=>{
              this.state.values[item.index].hidden = !this.state.values[item.index].hidden;
              this.setState({
                  value:this.state.values
              });

              var song = songs[item.index].music;

              if(!this.state.values[item.index].hidden){
                if(song != null){
                  song.setNumberOfLoops(-1);
                  EventRegister.emit('Play_Pause1', {playing:true,value:item})
                  EventRegister.emit('LIST_PLAYING', {playing:true, value: item})
                  songs[item.index].isPlaying = true;
                  song.play();
                }
              }else {
                if(song!=null){
                  song.stop(()=>{
                    songs[item.index].isPlaying = false;
                    if(this.props.tab == 0){
                      songsTab1[item.index].isPlaying = false;
                    }else {
                      songsTab2[item.index].isPlaying = false;
                    }
                    EventRegister.emit('LIST_PLAYING', {playing:false, value: item})
                    var hasPlaying = false;
                    var hasPlaying1 = false;
                    var hasPlaying2 = false;

                    for(let i = 0 ; i < songs.length ; i++){
                        if(songs[i].isPlaying == true){
                          //console.log('Songs '+i);
                          hasPlaying = true;
                          EventRegister.emit('Play_Pause1', {playing:true})
                          break;
                        }
                    }
                    for(let i = 0 ; i < songsTab1.length ; i++){
                        if(songsTab1[i].isPlaying == true){
                          //console.log('SongsTab1 '+i);
                          hasPlaying1 = true;
                          EventRegister.emit('Play_Pause1', {playing:true})
                          break;
                        }
                    }
                    for(let i = 0 ; i < songsTab2.length ; i++){
                        if(songsTab2[i].isPlaying == true){
                          //console.log('Songs Tab2 '+i);
                          hasPlaying2 = true;
                          EventRegister.emit('Play_Pause1', {playing:true})
                          break;
                        }
                    }
                    if(hasPlaying == false && hasPlaying1 == false && hasPlaying2 == false){
                        EventRegister.emit('Play_Pause1', {playing:false, value: item})

                    }

                  })
                }
              }


          }}>
          <View style={[styles.itemContainer, {backgroundColor: item.code }]}>
            <Image
              style={styles.stretch}
              source={item.img}
            />
        {!this.state.values[item.index].hidden ?
          <Slider
              style={{ width: 100, paddingTop:15 }}
              step={1}
              maximumValue={100}
              value={this.state.values[item.index].volume}
              minimumtracktintcolor="white"
              maximumTrackTintColor="white"
              thumbTintColor="white"
              onValueChange={(progress) => {
                //items[item.index].volume = progress;
                this.state.values[item.index].volume = progress;
                this.setState({
                    value:this.state.values
                });
                console.log('NAME : '+songs[item.index].item.name);
                songs[item.index].music.setVolume(progress/100.0);
                songs[item.index].item.volume = progress;
                //console.log('VACACACACAAC ' +songs[item.index].item.volume);
                item.volume = progress;
              }}
              />
              : null}
          </View>
        </TouchableOpacity>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  gridView: {
    paddingTop: 25,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    height: Platform.OS === 'ios' ? 130 : 110,
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    justifyContent:'center'
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  stretch: {
    width: 60,
    height: 60,
    justifyContent:'center',
  },
  hidden:{
    width:0,
    height:0
  }
});
