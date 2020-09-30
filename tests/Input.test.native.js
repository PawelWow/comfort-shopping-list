/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import Input from '../components/Input';

// constant variables commonly used in tests
const placeholder = 'test_placeholder';
const errorMessage = 'testerror';

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

    it('Should fire event on changeText', () => {
        let inputChanged = false;
        let result = render(<Input placeholder={placeholder} onInputChange={() => { inputChanged = true; }} />);       

        const element = result.getByPlaceholder(placeholder);
        fireEvent.changeText(element, '');

        expect(inputChanged).toBeTruthy();
    });
});

describe('<Input /> validation: isRequired', () => {  
    it('Should show error if isRequired and user do not touch and leave empty field', () => {

        const result = render(<Input
                placeholder={placeholder}
                onInputChange={() => { }}
                errorMessage={errorMessage}
                isRequired
            />);
  
        // control: no error message is shown
        expect(hasAnyChildText(result.toJSON(), errorMessage)).toBeFalsy();

        const element = result.getByPlaceholder(placeholder);
        fireEvent(element, 'onBlur');   // user leaves without filling the field

        expect(hasAnyChildText(result.toJSON(), errorMessage)).toBeTruthy();
    });

    it('Should show error when is required and blur with no data entered', () => {

        const result = render(<Input
                placeholder={placeholder}
                onInputChange={() => { }}
                errorMessage={errorMessage}
                isRequired
            />);
  
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

describe('<Input /> validation: min (minimum text length)', () => {

    it('Should not show error if min value is met', () => {

        let result = render(<Input 
                min={6}
                errorMessage={errorMessage}
                placeholder={placeholder}
                onInputChange={() => { }}
            />);       

            const element = result.getByPlaceholder(placeholder);
            fireEvent.changeText(element, '123456')

        expect(hasAnyChildText(result.toJSON(), errorMessage)).toBeFalsy();
    });
    
    it('Should show error if min value is NOT met', () => {
        let result = render(<Input 
                min={6}
                errorMessage={errorMessage}
                placeholder={placeholder}
                onInputChange={() => { }}
            />);       

        const element = result.getByPlaceholder(placeholder);
        fireEvent.changeText(element, '12345');

        expect(hasAnyChildText(result.toJSON(), errorMessage)).toBeTruthy();
    }); 
    
    it('Should error disappear if min is met', () => {
        let result = render(<Input 
                min={6}
                errorMessage={errorMessage}
                placeholder={placeholder}
                onInputChange={() => { }}
            />);       

        const element = result.getByPlaceholder(placeholder);

        fireEvent.changeText(element, '12345');
        expect(hasAnyChildText(result.toJSON(), errorMessage)).toBeTruthy();

        fireEvent.changeText(element, '123456');
        expect(hasAnyChildText(result.toJSON(), errorMessage)).toBeFalsy();
    });
});

describe('<Input /> validation: max (maximum text length)', () => {

    it('Should not show error if max value is met', () => {

        let result = render(<Input 
                max={6}
                errorMessage={errorMessage}
                placeholder={placeholder}
                onInputChange={() => { }}
            />);       

            const element = result.getByPlaceholder(placeholder);
            fireEvent.changeText(element, '123456')

        expect(hasAnyChildText(result.toJSON(), errorMessage)).toBeFalsy();
    });
    
    it('Should show error if max value is NOT met', () => {
        let result = render(<Input 
                max={6}
                errorMessage={errorMessage}
                placeholder={placeholder}
                onInputChange={() => { }}
            />);       

        const element = result.getByPlaceholder(placeholder);
        fireEvent.changeText(element, '1234567');

        expect(hasAnyChildText(result.toJSON(), errorMessage)).toBeTruthy();
    }); 
    
    it('Should error disappear if max is met', () => {
        let result = render(<Input 
                max={6}
                errorMessage={errorMessage}
                placeholder={placeholder}
                onInputChange={() => { }}
            />);       

        const element = result.getByPlaceholder(placeholder);

        fireEvent.changeText(element, '1234567');
        expect(hasAnyChildText(result.toJSON(), errorMessage)).toBeTruthy();

        fireEvent.changeText(element, '123456');
        expect(hasAnyChildText(result.toJSON(), errorMessage)).toBeFalsy();
    });
});

describe('<Input /> validation: combined', () => {

    it('Should not show error if all conditions are met', () => {

        let result = render(<Input
                min={5} 
                max={6}
                isRequired
                errorMessage={errorMessage}
                placeholder={placeholder}
                onInputChange={() => { }}
            />);       

        const element = result.getByPlaceholder(placeholder);
        fireEvent.changeText(element, '123456')

        expect(hasAnyChildText(result.toJSON(), errorMessage)).toBeFalsy();
    });  
    
    it('Should show error if only min is NOT met', () => {

        let result = render(<Input
                min={5} 
                max={6}
                isRequired
                errorMessage={errorMessage}
                placeholder={placeholder}
                onInputChange={() => { }}
            />);       

        const element = result.getByPlaceholder(placeholder);
        fireEvent.changeText(element, '1234');

        expect(hasAnyChildText(result.toJSON(), errorMessage)).toBeTruthy();
    }); 
    
    it('Should show error if only max is NOT met', () => {

        let result = render(<Input
                min={5} 
                max={6}
                isRequired
                errorMessage={errorMessage}
                placeholder={placeholder}
                onInputChange={() => { }}
            />);       

        const element = result.getByPlaceholder(placeholder);
        fireEvent.changeText(element, '1234567');

        expect(hasAnyChildText(result.toJSON(), errorMessage)).toBeTruthy();
    });  
});

// TODO reset field

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