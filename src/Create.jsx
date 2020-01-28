import React, { Component } from 'react';
import axios from 'axios';
import { Form, Checkbox, Input, Button } from 'semantic-ui-react';
import soundfileON from './audio/on.mp3';
import soundfileOFF from './audio/off.mp3';
import './Create.css';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interval: 0,
      selectedTime: 'min',
      status: 'on',
      background: '#0a7617'
    };
    this.audioON = new Audio(soundfileON);
    this.audioOFF = new Audio(soundfileOFF);
  }

  calcTime = () => {
    if (this.state.selectedTime === 'ho') {
      return this.state.interval * 3600000;
    }
    if (this.state.selectedTime === 'min') {
      return this.state.interval * 60000;
    }
    if (this.state.selectedTime === 'sec') {
      return this.state.interval * 1000;
    }
  };

  handleSubmit = status => e => {
    e.preventDefault();
    setTimeout(() => {
      axios
        .post(`http://localhost:3001/${status}`, { ledStatus: status })
        .then(res => {
          status === 'on' ? this.audioON.play() : this.audioOFF.play();
          this.setState({
            status: status === 'on' ? 'off' : 'on',
            background: status === 'on' ? '#ed3330' : '#0a7617'
          });
        })
        .catch(err => {
          console.error(err);
        });
    }, this.calcTime());
  };

  handleChange = event => {
    this.setState({ interval: event.target.value });
  };

  handleOptionChange = event => {
    this.setState({
      selectedTime: event.target.value
    });
  };

  render() {
    return (
      <div className='wrapper'>
        <div className='select-time'>
          <Form>
            <Form.Field>
              <Checkbox
                radio
                label='House'
                name='checkboxRadioGroup'
                value='ho'
                checked={this.state.selectedTime === 'ho'}
                onChange={this.handleOptionChange}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                radio
                label='Minutes'
                name='checkboxRadioGroup'
                value='min'
                checked={this.state.selectedTime === 'min'}
                onChange={this.handleOptionChange}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                radio
                label='Seconds'
                name='checkboxRadioGroup'
                value='sec'
                checked={this.state.selectedTime === 'sec'}
                onChange={this.handleOptionChange}
              />
            </Form.Field>
          </Form>
          <div>
            <Input
              label={{ basic: true, content: this.state.selectedTime }}
              className='enter-time'
              labelPosition='right'
              placeholder='Enter time...'
            />
            <Button
              style={{ background: this.state.background }}
              onClick={this.handleSubmit(this.state.status)}
            >
              {this.state.status}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Create;
