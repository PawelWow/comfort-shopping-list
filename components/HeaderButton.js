import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../defs/Colors';
import Platform from '../defs/Platform';

const CustomHeaderButton = props => {
    return <HeaderButton {...props} IconComponent={Ionicons} iconSize={23} color={Platform.isAndroid ? 'black' : Colors.primary} />
};

export default CustomHeaderButton;