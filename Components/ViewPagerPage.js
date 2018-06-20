import {StyleSheet, View, Text,Image, TouchableOpacity,Alert,DeviceEventEmitter,Button,ListView,Slider, Dimensions} from 'react-native';
import React, {Component} from 'react';
import {PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';
import SoundPage from '../Components/SoundPage';
import EventEmitter from 'EventEmitter';
import { EventRegister } from 'react-native-event-listeners'
import SystemSetting from 'react-native-system-setting'
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';

var listSoundPlay = [];

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
  FadeAnimation,
} from 'react-native-popup-dialog';

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const fadeAnimation = new FadeAnimation({ animationDuration: 150 });

const styles = StyleSheet.create({
  dialogContentView: {
    backgroundColor:'black',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogTimerContentView: {
    backgroundColor:'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:10,
  },
});


const items1 = [
  { index : 0, name: 'Rain', code: '#1abc9c', img:require('./imgs/ic_rain.png'),music:'rain.mp3',volume:50,isPlaying:false},
  { index : 1,name: 'Thunderstorm', code: '#2ecc71' , img:require('./imgs/ic_thunders.png',),music:'thunders.mp3',volume:50,isPlaying:false},
  { index : 2,name: 'Rain on Window', code: '#3498db',img:require('./imgs/ic_rain_on_window.png'),music:'rain_on_window.mp3',volume:50,isPlaying:false},
  { index : 3,name: 'Car', code: '#9b59b6' , img:require('./imgs/ic_car.png'),music:'car.mp3',volume:50,isPlaying:false},
  { index : 4,name: 'Wind', code: '#34495e' , img:require('./imgs/ic_wind.png'),music:'wind.mp3',volume:50,isPlaying:false},
  { index : 5,name: 'Forest', code: '#16a085' , img:require('./imgs/ic_forest.png'),music:'forest.mp3',volume:50,isPlaying:false},
  { index : 6,name: 'Creek', code: '#27ae60' , img:require('./imgs/ic_creek.png'),music:'creek.mp3',volume:50,isPlaying:false},
  { index : 7,name: 'Leaves', code: '#2980b9' , img:require('./imgs/ic_leaves.png'),music:'leaves.mp3',volume:50,isPlaying:false},
];


const items2 = [
  { index : 0,name: 'Fire', code: '#16a085' , img:require('./imgs/ic_fire.png'),music:'fire.mp3',volume:50,isPlaying:false},
  { index : 1,name: 'Ocean', code: '#2ecc71' , img:require('./imgs/ic_ocean.png',),music:'ocean.mp3',volume:50,isPlaying:false},
  { index : 2,name: 'Train', code: '#3498db',img:require('./imgs/ic_train.png'),music:'train.mp3',volume:50,isPlaying:false},
  { index : 3,name: 'Night', code: '#9b59b6' , img:require('./imgs/ic_night.png'),music:'night.mp3',volume:50,isPlaying:false},
  { index : 4,name: 'Brown Noise', code: '#27ae60' , img:require('./imgs/ic_brown_noise.png'),music:'brown_noise.mp3',volume:50,isPlaying:false},
  { index : 5,name: 'White Noise', code: '#2980b9' , img:require('./imgs/ic_whitenoise.png'),music:'whitenoise.mp3',volume:50,isPlaying:false},
  { index : 6,name: 'Cafe', code: '#34495e' , img:require('./imgs/ic_cafe.png'),music:'cafe.mp3',volume:50,isPlaying:false},
  { index : 7, name: 'Fan', code: '#1abc9c', img:require('./imgs/ic_fan.png'),music:'fan.mp3',volume:50,isPlaying:false},
];

const TimerList = [
  'No Timer',
  'Custom Duration',
  '5 minutes',
  '10 minutes',
  '15 minutes',
  '20 minutes',
  '30 minutes',
  '40 minutes',
  '1 hour',
  '2 hour',
  '4 hour',
  '8 hour',
];
export default class ViewPagerPage extends Component {
  _onPressButtonVolume=()=> {
      this.slideAnimationDialog.show();
   };

   _onPressButtonTimer=()=>{
     this.timerDialog.show();
   }
   constructor(props) {
       super(props)
       var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => { r1 !== r2 }});
       this.state = {
                      play_image:require('./imgs/ic_play.png'),
                      isPlaying: false,
                      isSettingTimer:false,
                      isAddedFavorite:false,
                      dataSource : new ListView.DataSource({rowHasChanged : (r1,r2) => r1!==r2}),
                      dataSourceTimer :  ds.cloneWithRows(TimerList),
                      systemVolume:50,
                      numberPlaying:0,
        }
     }

     componentWillMount(){
       this.listener = EventRegister.addEventListener('Play_Pause1', (data) => {
           this.setState({
             isPlaying:data.playing,
             play_image:!data.playing ? require('./imgs/ic_play.png') : require('./imgs/ic_pause.png'),
           })
       })

       this.listener = EventRegister.addEventListener('LIST_PLAYING', (data) => {
          if(data.value == null) return;
          if(data.playing){
              var isAdd = true;
              for(let i =0;i<listSoundPlay.length;i++){
                if(data.value.name == listSoundPlay[i].name){
                    isAdd = false;
                    break;
                }
              }
              if(isAdd){
                listSoundPlay.push(data.value);
              }
          }else {
            for(let i =0;i<listSoundPlay.length;i++){
              if(data.value.index == listSoundPlay[i].index){
                listSoundPlay.splice(i,1);
              }
            }
          }
          var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => { r1 !== r2 }});
           // update the DataSource in the component state
           this.setState({
               dataSource : ds.cloneWithRows(listSoundPlay),
               dataSourceTimer : ds.cloneWithRows(TimerList),
           });
          console.log('AAAAAA : '+listSoundPlay.length);
          this.setState({
            numberPlaying:listSoundPlay.length,
          })

       })

       const volumeListener = SystemSetting.addVolumeListener((data) => {
          const volume = data.value;
          console.log('change volume is ' + volume);
          this.setState({
            systemVolume:volume,
          })
      });

      SystemSetting.getVolume().then((volume)=>{
          console.log('Current volume is ' + volume);
      });

     }
    render() {
        return (
            <View style={{flex:1}}>
                <IndicatorViewPager
                    style={{flex:9}}
                    >

                    <View style={{backgroundColor:'cadetblue'}}>
                        <SoundPage list={items1} tab= {0} />
                    </View>
                    <View style={{backgroundColor:'cornflowerblue'}}>
                      <SoundPage list={items2} tab= {1}/>
                    </View>

                </IndicatorViewPager>

                <View style={{flex: 1,backgroundColor:'white', flexDirection:'row',alignItems:'center'}
                              }>
                  <TouchableOpacity style = {{flex:1}}
                        onPress={()=>{
                          if(this.state.isPlaying == false){
                            this.setState({
                    					isPlaying: true,
                              play_image:require('./imgs/ic_pause.png')
                    				});
                            EventRegister.emit('Play_Pause', {playing:true})
                          }else {
                            this.setState({
                    					isPlaying: false,
                              play_image:require('./imgs/ic_play.png')
                    				});
                              EventRegister.emit('Play_Pause', {playing:false})
                          }
                        }}
                  >
                    <Image
                      style={{flex:1}}
                      source={this.state.play_image}
                      resizeMode='center'
                      alignItems='center'
                    />
                    </TouchableOpacity>

                    <View style={{width:0.5, height:50,backgroundColor:'black'}}></View>
                    <TouchableOpacity style = {{flex:1}}
                          onPress={this._onPressButtonTimer}
                    >
                    <Image
                      style={{flex:1}}
                      source={require('./imgs/ic_timer.png')}
                      resizeMode='center'
                      alignItems='center'
                    />
                    </TouchableOpacity>
                    <View style={{width:0.5, height:50,backgroundColor:'black'}}></View>
                    <TouchableOpacity style = {{flex:1}}
                          onPress={this._onPressButtonVolume}
                    >
                    <Image
                      style={{flex:1}}
                      source={require('./imgs/ic_heart.png')}
                      resizeMode='center'
                      alignItems='center'
                    />
                    </TouchableOpacity>
                    <View style={{width:0.5, height:50,backgroundColor:'black'}}></View>
                    <TouchableOpacity style = {{flex:1,flexDirection:'row', alignItems:'center'}}
                          onPress={this._onPressButtonVolume}
                    >
                      <Image
                        style={{flex:3}}
                        source={require('./imgs/ic_volume_muted.png')}
                        resizeMode='center'
                        alignItems='center'
                      />
                      { this.state.numberPlaying != 0?
                        <Text style={{flex:1, fontSize:15, color:'black'}}>{this.state.numberPlaying}</Text>
                        :null
                      }
                      </TouchableOpacity>

                </View>


                <PopupDialog
                  dialogTitle={<DialogTitle title="Setting Volume"/>, haveTitleBar=false}
                  width={0.9}
                  height={0.75}
                  ref={(popupDialog) => {
                    this.slideAnimationDialog = popupDialog;
                  }}
                  dialogAnimation={slideAnimation}>
                  <View style={styles.dialogContentView}>
                   <Text style={{fontSize:18,color:'white', paddingTop:10}}>System volume</Text>
                   <View style={{flexDirection:'row',alignItems:'center',paddingTop:10}}>
                      <Image
                        style={{width:40, height:40}}
                        source={require('./imgs/ic_volume_muted.png')}
                        resizeMode='center'
                        alignItems='center'
                      />
                      <Slider
                          style={{width: 200}}
                          step={1}
                          maximumValue={100}
                          value={this.state.systemVolume*100.0}
                          minimumtracktintcolor="white"
                          maximumTrackTintColor="white"
                          thumbTintColor="white"
                          onValueChange={(progress) => {
                              SystemSetting.setVolume(progress/100);
                          }}
                          />
                   </View>
                    <ListView
                         enableEmptySections={true}
                         dataSource={this.state.dataSource}
                         renderRow={(item,sectionID,rowID) =>
                          <View style={{flexDirection:'row',alignItems:'center',paddingTop:10, paddingBottom:10}}>
                             <Image
                               style={{width:40, height:40}}
                               source={item.img}
                               resizeMode='center'
                               alignItems='center'
                             />
                             <Slider
                                 style={{width: 150}}
                                 step={1}
                                 maximumValue={100}
                                 value={item.volume}
                                 minimumtracktintcolor="white"
                                 maximumTrackTintColor="white"
                                 thumbTintColor="white"
                                 onValueChange={(progress) => {
                                   item.volume = progress;
                                   EventRegister.emit('UPDATE_VOLUME', {value: item})
                                 }}
                                 />
                                 <TouchableOpacity key={rowID}
                                       onPress={()=>{
                                         EventRegister.emit('RemoveSoundPlay', {value: item})
                                         console.log('Row ID' + rowID);
                                         listSoundPlay.splice(rowID,1);
                                         var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => { r1 !== r2 }});
                                          // update the DataSource in the component state
                                          this.setState({
                                              dataSource : ds.cloneWithRows(listSoundPlay),
                                          });
                                          this.setState({
                                            numberPlaying:listSoundPlay.length,
                                          })
                                       }}
                                       >
                                   <Image
                                     style={{width:50, height:50}}
                                     source={require('./imgs/ic_delete_favorite.png')}
                                     resizeMode='center'
                                     alignItems='center'
                                   />
                                 </TouchableOpacity>
                          </View>
                         }
                       />
                  </View>
                </PopupDialog>



                <PopupDialog
                  dialogTitle={<DialogTitle title="Setting Timer Duration"/>}
                  width={0.9}
                  height={0.8}
                  ref={(popupDialog) => {
                    this.timerDialog = popupDialog;
                  }}
                  dialogAnimation={slideAnimation}>
                  <View style={styles.dialogTimerContentView}>
                  <ListView
                       enableEmptySections={true}
                       dataSource={this.state.dataSourceTimer}
                       renderRow={(item,sectionID,rowID) =>
                        <View style={{flexDirection:'row',alignItems:'center',paddingTop:10, paddingBottom:10, justifyContent:'center'}}>

                            <Text style = {{flexDirection:'row', fontSize:20, color:'black',textAlign: 'center',
                              width:width,
                              fontWeight: 'bold'}}>{item}</Text>
                        </View>
                       }
                     />

                  </View>
                </PopupDialog>

            </View>
        );
    }

    _renderDotIndicator() {
        return <PagerDotIndicator pageCount={2} />;
    }

}
