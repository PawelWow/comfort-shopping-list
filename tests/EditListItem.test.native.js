/**
 * @jest-environment jsdom
 */
import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';

import Input from '../components/Input';
import EditListItem from '../components/EditListItem';

describe('<EditListItem />', () => {  
    const value = "test_value";
    const valueTestMatch = new RegExp(`\\s*${value}\\s*`);

    let result;
    beforeEach(() => {
        result = render(<EditListItem id="test_value" value={value} onChange={() => {}} />);
    });

    it('Should contain Text field with expected value', async () => {
        expect(result.queryByText(valueTestMatch)).not.toBeNull();
        expect(result.queryByDisplayValue(valueTestMatch)).toBeNull();
    });

    it('should change to Input after text is press', async () => {
        let element = result.getByText(valueTestMatch);
        fireEvent.press(element);

        expect(result.queryByText(valueTestMatch)).toBeNull();
        expect(result.queryByDisplayValue(valueTestMatch)).not.toBeNull();
    });
});

