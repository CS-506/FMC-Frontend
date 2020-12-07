
import React from 'react';
import Profile from './Profile';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Link, MemoryRouter } from 'react-router-dom';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';

Enzyme.configure({ adapter: new Adapter() });

describe('Testing Profile Page', () => {
    test('Render Profile', () => {
        const wrapper = shallow(<Profile />);
        expect(wrapper.exists()).toBe(true);
    });

    test('Comment display', () => {
        const context = (
            <MemoryRouter>
                <Profile loginStat={"LOGGED_IN"} user={{userId:3}} />
            </MemoryRouter>  
        );
        const wrapper = shallow(context);
        //expect(wrapper.find('CommentSection').prop('comments')).toHaveLength(0);
    });

    test('Deregistration', () => {
        const context = (
            <MemoryRouter>
                <Profile loginStat={"LOGGED_IN"} user={{userId:3}} />
            </MemoryRouter>  
        );
        const wrapper = mount(context);
        //expect(wrapper.find(Button).at(0)).toEqual('DeleteIcon');

    });


}); 