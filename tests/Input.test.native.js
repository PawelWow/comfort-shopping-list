/**
 * @jest-environment jsdom
 */


import React, { Children } from 'react';

import { render } from 'react-native-testing-library';
import Input from '../components/Input';

const label = "test_label";

describe('<Input /> instance', () => {   

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