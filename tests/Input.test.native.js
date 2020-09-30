/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import Input from '../components/Input';

describe('<Input /> instance', () => {   
    const label = "test_label";

    let result;
    beforeEach(() => {
        result = render(<Input label={label} />);
    });

    it('Input should have label text', async () => {
        expect(result.queryAllByText(label)).toHaveLength(1);
    });

    it('Input should have TextInput element', async () => {
        const resultJson = result.toJSON();
        const textInputElements = resultJson.children.filter(f => f.type === 'TextInput');
        expect(textInputElements).toHaveLength(1);
    });
});

describe('<Input /> validation: isRequired', () => {
    const placeholder = 'test_placeholder';
    const errorMessage = 'testerror';

    it('Should fire event on changeText', () => {

        let inputChanged = false;
        let result = render(<Input placeholder={placeholder} onInputChange={() => { inputChanged = true; }} />);       

        const element = result.getByPlaceholder(placeholder);
        fireEvent.changeText(element, '');

        expect(inputChanged).toBeTruthy();
    });

    it('Should show error if isRequired and user do not touch and leave empty field', () => {

        const result = render(<Input placeholder={placeholder} onInputChange={() => { }} errorMessage={errorMessage} isRequired />);
  
        // control: no error message is shown
        expect(hasAnyChildText(result.toJSON(), errorMessage)).toBeFalsy();

        const element = result.getByPlaceholder(placeholder);
        fireEvent(element, 'onBlur');   // user did not touch and leaves

        expect(hasAnyChildText(result.toJSON(), errorMessage)).toBeTruthy();
    });

    it('Should show error when is required and blur with no data entered', () => {

        const result = render(<Input placeholder={placeholder} onInputChange={() => { }} errorMessage={errorMessage} isRequired />);
  
        // control: no error message is shown
        expect(hasAnyChildText(result.toJSON(), errorMessage)).toBeFalsy();

        const element = result.getByPlaceholder(placeholder);
        fireEvent.changeText(element, ''); // isTouched=true expected 
        fireEvent(element, 'onBlur');   // user touched and leaves

        expect(hasAnyChildText(result.toJSON(), errorMessage)).toBeTruthy();
    });

    it('Should not show error if isRequired and valid initial value is set, and user leaves without touching', () => {
        const result = render(<Input
                initialValue='test'
                initiallyValid
                placeholder={placeholder}
                onInputChange={() => { }}
                errorMessage={errorMessage}
                isRequired
            />);
    
        // control: no error message is shown
        expect(hasAnyChildText(result.toJSON(), errorMessage)).toBeFalsy();
    
        const element = result.getByPlaceholder(placeholder);
        fireEvent(element, 'onBlur');   // user did not touch and leaves
    
        expect(hasAnyChildText(result.toJSON(), errorMessage)).toBeFalsy();
    });
    
});

// Helper to find a text in nested children. Simple solution for simple components
// technically looks for an array (children) containing give text
const hasAnyChildText = (resultJson, textToFind) => {

    const children = resultJson.children;

    if(!children) {
        return false;
    }

    if(children.includes(textToFind)) {
        return true;
    }

    for(let index in children){
        const child = children[index];
        if(hasAnyChildText(child, textToFind)){
            return true;
        }
    }

    return false;
}