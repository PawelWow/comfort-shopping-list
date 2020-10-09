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
            onStartShouldSetPanResponder : () => true,
            onPanResponderGrant: () => {
                pan.setOffset({
                  x: pan.x._value,
                  y: pan.y._value
                });
              },              
            onPanResponderMove : Animated.event( 
                [null, { dx : pan.x, dy: 0 }], 
                { useNativeDriver: false }
            ),
            onPanResponderRelease : (e, gesture) => {
                Animated.spring(pan, { toValue:{x:0,y:0}, useNativeDriver: false } ).start();
            }            
        })
    ).current;


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
            <Text style={getItemTextStyle()} onPress={props.onTextPress}>{props.content}</Text>
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