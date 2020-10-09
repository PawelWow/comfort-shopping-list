import React, { useRef, useState } from 'react';

import {
    Text,
    StyleSheet,
    Animated,
    PanResponder
 } from 'react-native';

const ListItem = props => {
    const [isDone, setIsDone] = useState(props.isDone);
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
            onPanResponderGrant: () => {
                pan.setOffset({
                  x: pan.x._value,
                  y: pan.y._value
                });
              },
              
            onMoveShouldSetPanResponder : (e, gesture) => {
                // TODO gesture.vx > 0 - ruch tylko w prawo, gesture.vx < 0 - ruch tylko w lewo
                return true;
            },
            onPanResponderMove : Animated.event( 
                [null, { dx : pan.x, dy: 0 }], 
                { useNativeDriver: false }
            ),
            onPanResponderRelease : (e, gesture) => {
                if(props.onItemPress && itemPressed(gesture))
                {
                    props.onItemPress();
                }
                console.log(pan.x);
                Animated.spring(pan, { toValue:{x:0,y:0}, useNativeDriver: false } ).start();
            }         
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
    }


    return (
        <Animated.View {...panResponder.panHandlers} style={[pan.getLayout(), getItemStyle()]}>
            <Text style={getItemTextStyle()}>{props.content}</Text>
            { props.isDeleted && <Text style={styles.listItemTextDeletedMarkup}>  (deleted)</Text>}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        
    },
    listItemDeleted: {
        backgroundColor: '#eee',
    },

    listItemTextDone: {
        textDecorationLine: 'line-through'
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
    }
});

export default ListItem;