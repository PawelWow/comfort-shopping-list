/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import EditListItem from '../components/EditListItem';

describe('<EditListItem />', () => {  
    const value = "test_value";
    const valueTestMatch = new RegExp(`\\s*${value}\\s*`);

    let result;
    beforeEach(() => {
        result = render(<EditListItem id="test_value" value={value} onChange={() => {}} onInputBlur={() => {}} />);
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

    it('should view Text back if Input is blurred', async () => {

        // show input
        let element = result.getByText(valueTestMatch);
        fireEvent.press(element);

        // blur input
        element = result.queryByDisplayValue(valueTestMatch);    
        fireEvent(element, 'onBlur');         

        expect(result.queryByText(valueTestMatch)).not.toBeNull();
        expect(result.queryByDisplayValue(valueTestMatch)).toBeNull();   
    });    


});

