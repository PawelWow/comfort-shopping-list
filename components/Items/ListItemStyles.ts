import { StyleSheet } from "react-native";

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