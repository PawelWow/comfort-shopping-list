/**
 * @jest-environment jsdom
 */


import React from 'react';

import { render } from 'react-native-testing-library';
import Input from '../components/Input';

describe('<Input />', () => {

    it('Input should set label text', async () => {
        const label = "test_label";
        const { queryByText } = render(<Input label={label} />);

        expect(queryByText(label)).not.toBeNull();
    });
});