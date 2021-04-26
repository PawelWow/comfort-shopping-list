import React from 'react';
import {
    View,
    Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import IconsNames from '../../../defs/IconsNames';
import { getItemStyle, getItemTextStyle, styles } from './ListItemViewStyles';
import { IProps } from './ListItemViewProps';

const ListItemView: React.FC<IProps> = ({content, order, style, isDone, isDeleted = false}) => {
    return (
        <View style={getItemStyle(isDeleted, style)}>
            { isDone && <Ionicons name={IconsNames.done} size={18} style={styles.isDoneIcon} /> }
            <Text style={getItemTextStyle(isDeleted, isDone)}>{order +1}. {content}</Text>
            { isDeleted && <Text style={styles.listItemTextDeletedMarkup}>  (deleted)</Text>}
        </View>
    );
};

export default ListItemView;