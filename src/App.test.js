import React from 'react';
import ReactDOM from 'react-dom';
import App, { searchURL } from './App';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

configure({ adapter: new Adapter() });

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

describe('Header', () => {
  it('should show render a header', () => {
    const wrapper = shallow(<App />)
      .find('Header').childAt(0);
    expect(wrapper.text()).to.equal('WikiMedia Search');
  });
});
