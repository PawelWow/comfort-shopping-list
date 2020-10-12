import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    PanResponder
 } from 'react-native';
 import { Ionicons } from '@expo/vector-icons';

 import IconsNames from '../defs/IconsNames';

const ListItem = props => {
 
    const [isDone, setIsDone] = useState(props.isDone);  
    const isDoneRef = useRef(isDone);
    const setIsDoneRef = done => {
        isDoneRef.current = done;
        setIsDone(done);
    };

    useEffect(() => {
        setIsDoneRef(props.isDone);
    }, [props.isDone]);


    
    const underItemCompWidth = useRef(0);
    const setUnderItemCompWidth = data => {
        underItemCompWidth.current = data;
    }

    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
            onPanResponderGrant: () => {
                pan.setOffset({
                  x: pan.x._value,
                  y: pan.y._value
                });
              },
            onStartShouldSetPanResponder: ( )=> true,
            onMoveShouldSetPanResponder : (e, gesture) => {

                if(isDone) {
                    return gesture.vx < 0;
                }
                return gesture.vx > 0;
            },
            onPanResponderMove : (e, gesture) =>  {
                const isMovedMax = Math.abs(gesture.dx) > underItemCompWidth.current;
                if(isMovedMax)
                {
                    return;
                }

                Animated.event( 
                    [null, { dx : pan.x, dy: 0 }], 
                    { useNativeDriver: false }
                )(e, gesture);
           
            },
            onPanResponderRelease : (e, gesture) => {
                if(props.onItemPress && itemPressed(gesture))
                {
                    props.onItemPress();
                }

                const isMovedEnough = Math.abs(gesture.dx) >= underItemCompWidth.current;
                if(!isMovedEnough){
                    return;
                }

                const newIsDoneValue = !isDoneRef.current;
                if(props.listId){
                    props.onIsDoneChange(props.listId, props.id, newIsDoneValue);
                }
                else {
                    props.onIsDoneChange(props.id, newIsDoneValue);
                }

                setIsDoneRef(!isDoneRef.current)

                Animated.spring(pan, { toValue:{x:0,y:0}, useNativeDriver: false } ).start();
            },
     
        })
    ).current;

    // it's pressed if didn't move
    const itemPressed = gesture => {
        return gesture.moveY === 0 && gesture.moveX === 0;
    }

    const  getItemStyle = () => {
        if(props.isDeleted){
            return {...styles.container, ...props.style, ...styles.listItemDeleted};
        }
    
        return {...styles.container, ...props.style};
    }
    
    // get text style accorrding to input state
    const getItemTextStyle = () => {
        if(props.isDeleted) {
            return styles.listItemTextDeleted;
        }
    
        if(isDone) {
            return styles.listItemTextDone;
        }
    
        return {};
    };

    const getUnderItemElement = () => {
        if( isDone ){
            return (
                <View 
                    style={[getItemStyle(), styles.underListItemMarkNotDone]}
                    onLayout={e => setUnderItemCompWidth(e.nativeEvent.layout.width)}
                >
                    <Text style={{color: 'white'}}>UNDONE!</Text>
                </View>
            );
        }

        return (
            <View 
                style={[getItemStyle(), styles.underListItemMarkDone]} 
                onLayout={e => setUnderItemCompWidth(e.nativeEvent.layout.width)}
            >
                <Text style={{color: 'white'}} >DONE!</Text>
            </View>
        );
    }

    return (
        <View style={{flex: 1}}>
            {getUnderItemElement()}
            <Animated.View {...panResponder.panHandlers} style={[pan.getLayout(), getItemStyle()]}>
                { isDone && <Ionicons name={IconsNames.done} size={18} style={styles.isDoneIcon} /> }
                <Text style={getItemTextStyle()}>{props.content} {isDone.toString()}</Text>
                { props.isDeleted && <Text style={styles.listItemTextDeletedMarkup}>  (deleted)</Text>}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems: 'baseline',
        
    },
    listItemDeleted: {
        backgroundColor: '#eee',
    },

    listItemTextDone: {
        textDecorationLine: 'line-through',
        fontStyle: 'italic'

    }, 
    listItemTextDeleted: {
        textDecorationLine: 'line-through',
        borderColor: '#ccc',
        color: 'red',
        fontStyle: 'italic',
    },
    listItemTextDeletedMarkup: {
        color: 'red',
        fontStyle: 'italic',        
        flex: 1
    },
    underListItemMarkDone: {
        position: 'absolute',
        left: 0,
        backgroundColor: '#0F0',
        color: 'white',        
    },
    underListItemMarkNotDone: {
        position: 'absolute',
        right: 0,
        backgroundColor: '#F00',
        color: 'white',             
    },
    isDoneIcon: {
        marginRight: 5
    }
});

export default ListItem;