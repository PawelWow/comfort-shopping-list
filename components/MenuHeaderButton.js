import React from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from './HeaderButton';
import IconsNames from '../defs/IconsNames';

const MenuHeaderButton = props => {
    return(
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
            title='Menu'
            iconName={IconsNames.menu}
            onPress={props.onPress}
        />
    </HeaderButtons>
    );
};

export default MenuHeaderButton;