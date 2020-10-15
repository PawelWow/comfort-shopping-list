import React from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import IconsNames from '../../defs/IconsNames';

interface IProps {
    content: string;
    isDone: boolean;
    isDeleted?: boolean;
    order: number;
    // TODO temp /!\
    style: {};
}

const ListItemView: React.FC<IProps> = ({content, order, style, isDone, isDeleted = false}) => {

    const  getItemStyle = () => {
        if(isDeleted){
            return {...styles.container, ...style, ...styles.listItemDeleted};
        }
    
        return {...styles.container, ...style};
    }

        // get text style accorrding to input state
        const getItemTextStyle = () => {
            if(isDeleted) {
                return styles.listItemTextDeleted;
            }
        
            if(isDone) {
                return styles.listItemTextDone;
            }
        
            return {};
        };

    return (
        <View style={getItemStyle()}>
            { isDone && <Ionicons name={IconsNames.done} size={18} style={styles.isDoneIcon} /> }
            <Text style={getItemTextStyle()}>{order +1}. {content}</Text>
            { isDeleted && <Text style={styles.listItemTextDeletedMarkup}>  (deleted)</Text>}
        </View>
    );
};

// TODO clean?
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

export default ListItemView;