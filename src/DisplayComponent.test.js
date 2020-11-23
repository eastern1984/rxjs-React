import React from 'react';

import {configure, shallow, find} from 'enzyme';
import Adaptor from 'enzyme-adapter-react-16';
import DisplayComponent from './DisplayComponent';

configure ({adapter: new Adaptor()});

describe('<DisplayComponent />', () => {
    it('should display Temperature, Air pressure and Humidity', () => {
        const wrapper = shallow(<DisplayComponent />);
        expect(wrapper.find('div')).toHaveLength(4);
    });
});
