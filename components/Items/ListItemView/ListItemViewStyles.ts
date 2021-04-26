import { StyleProp, StyleSheet, ViewStyle } from "react-native";

export const getItemStyle = (isDeleted: boolean, style: {}) => {
    if(isDeleted){
        return {...styles.container, ...style, ...styles.listItemDeleted};
    }

    return {...styles.container, ...style};
}

// get text style accorrding to input state
export const getItemTextStyle = (isDeleted: boolean, isDone: boolean) => {
    if(isDeleted) {
        return styles.listItemTextDeleted;
    }

    if(isDone) {
        return styles.listItemTextDone;
    }

    return {};
};

// TODO clean?
export const styles = StyleSheet.create({
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

