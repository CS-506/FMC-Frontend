import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TextField from '@material-ui/core/TextField';
import Reg from "./Registration"; 

Enzyme.configure({ adapter: new Adapter() });

describe('Testing Registration Page', () => {
    test('Render Registration Page', () => {
        const wrapper = shallow(<Reg />);
        expect(wrapper.exists()).toBe(true);
    });
/*
    test('Email alert test 1', () => {      
        const wrapper = shallow(<Reg />);
        //expect(wrapper.find('LoginForm').prop('emailHandler')).toHaveLength(0);
        
        wrapper.find('LoginForm').prop('emailHandler').simulate("change", {
            target: { value: "testemail@gmail.com"}
        });
        
        expect(wrapper.find('TestAlertText').prop('value')).toBe("Please use a UW-Madison email address.");
    }); 
*/
}); 