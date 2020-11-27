
import React from 'react';
import NavBar from './NavBar';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Link } from 'react-router-dom';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';

Enzyme.configure({ adapter: new Adapter() });

describe('Testing NavBar', () => {
    test('Render NavBar', () => {
        const wrapper = shallow(<NavBar />);
        expect(wrapper.exists()).toBe(true);
    });

    test('Return keyWord typed in search box upon clicking search button', () => {
        //let testKeyWord = "default";
        function testSendKey(key) {
            // testKeyWord = key;
            expect(key).toEqual("KeyWord for testing");
        }
        const wrapper = shallow(<NavBar sendKey={testSendKey}/>);
        wrapper.find(InputBase).at(0).simulate("change", {
            target: { value: "KeyWord for testing"}
        });
        wrapper.find(Button).at(0).simulate("click");
        //expect(wrapper.props()).toEqual("KeyWord for testing");
    });

    test('Return KeySubject typed in search box upon clicking search button', () => {
        //let testKeyWord = "default";
        function testSendKey(key) {
            // testKeyWord = key;
            expect(key).toEqual("KeySubject for testing");
        }
        const wrapper = shallow(<NavBar sendKey={testSendKey}/>);
        wrapper.find(InputBase).at(1).simulate("change", {
            target: { value: "KeySubject for testing"}
        });
        wrapper.find(Button).at(1).simulate("click");
        //expect(wrapper.props()).toEqual("KeyWord for testing");
    });

    test('Return keyInstructor typed in search box upon clicking search button', () => {
        //let testKeyWord = "default";
        function testSendKey(key) {
            // testKeyWord = key;
            expect(key).toEqual("keyInstructor for testing");
        }
        const wrapper = shallow(<NavBar sendKey={testSendKey}/>);
        wrapper.find(InputBase).at(1).simulate("change", {
            target: { value: "keyInstructor for testing"}
        });
        wrapper.find(Button).at(0).simulate("click");
        //expect(wrapper.props()).toEqual("KeyWord for testing");
    });
}); 