
import React from 'react';
import Profile from './Profile';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Link } from 'react-router-dom';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';

Enzyme.configure({ adapter: new Adapter() });

describe('Testing Profile Page', () => {
    test('Render Profile', () => {
        const wrapper = shallow(<Profile />);
        expect(wrapper.exists()).toBe(true);
    });

    test('Check info of user', () => {
        const wrapper = shallow(<Profile loginStat={"LOGGED_IN"} user={{userId:3, email:'Johnj@wisc.edu'}} />);
        expect(wrapper.exists()).toBe(true);
    })
}); 