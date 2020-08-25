import React from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from './HeaderButton';
import IconsNames from '../defs/IconsNames';

const SaveHeaderButton = props => {
    return(
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
            title='Save'
            iconName={IconsNames.checkmark}
            onPress={props.onPress}
        />
    </HeaderButtons>
    );
};

export default SaveHeaderButton;