import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Home from './Home';
import LogoDisplay from './Home'
Enzyme.configure({ adapter: new Adapter() });

describe('Testing Home Page', () => {
    test('Render HomePage', () => {
        const wrapper = shallow(<Home />);
        expect(wrapper.exists()).toBe(true);
    });

    test('Return keyWord typed in search box upon clicking search button', () => {      
        const wrapper = shallow(<Home />);
        wrapper.find(TextField).at(0).simulate("change", {
            target: { value: "KeyWord for testing"}
        });
        wrapper.find(Button).at(0).simulate("click");
        expect(wrapper.find('TestKeyWord').prop('value')).toBe("KeyWord for testing");
    });

    test('Check logo image used', () => {      
        const wrapper = shallow(<LogoDisplay />);
        wrapper.find(Button).at(0).simulate("click");
        expect(wrapper.exists()).toBe(true);
    });
}); 