import React, { Component } from 'react';
import { timeFormat } from 'd3';
import { LayoutContainer, LayoutContent } from '../components/Layout';
import { Header } from '../components/Header';
import { Pagination } from '../components/Pagination';
import AddForm from '../components/Form';

import './RecordPage.css';

class RecordPage extends Component {

  constructor(props) {
    super(props);

    this.state={
      name: 'Anna',
      emotion: 'Emotion',
      event: 'Event',
      date: '',
      arousal: 3,
      conduciveness: 3,
      controllability: 3,
      intensity: 3,
      valence: 3,
      status: 'Submit',
      disabled: false,
      activeStep: 'Emotion',
      steps: [
        'Emotion',
        'Dimensions',
        'Triggers',
        'Actions',
        'Review'
      ]
    }

    this.onFormChange = this.onFormChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.sendRecord = this.sendRecord.bind(this);
    this.getResponse = this.getResponse.bind(this);

  };

  componentDidMount() {
    this.setState({date: timeFormat("%Y-%m-%d")(new Date())})
  }

  onFormChange(field, event) {
    var stateUpdate = {};
    stateUpdate[field] = event.target.value;
    this.setState(stateUpdate);
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.setState({ status: 'Sending…' }, this.sendRecord);
  }

  sendRecord() {
    var record = {
      date: this.state.date,
      name: this.state.name,
      emotion: this.state.emotion,
      event: this.state.event,
      arousal: this.state.arousal,
      conduciveness: this.state.conduciveness,
      controllability: this.state.controllability,
      intensity: this.state.intensity,
      valence: this.state.valence
    };

    var username = process.env.REACT_APP_FIELDBOOK_USER;
    var password = process.env.REACT_APP_FIELDBOOK_KEY;
    var bookId = process.env.REACT_APP_FIELDBOOK_BOOK;
    var sheetId = process.env.REACT_APP_FIELDBOOK_SHEET;
    var baseUrl = 'https://api.fieldbook.com/v1/';
    var url = baseUrl + bookId + '/' + sheetId;
    var userpass = username + ':' + password;
    var authorization = 'Basic '+ btoa(userpass);

    var headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': authorization
    });

    var request = new Request(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(record)
    })

    fetch(request).then(this.getResponse);

  }

  getResponse(response) {
    this.setState({ status: 'Sent ✔︎', disabled: true });
  }

  render() {
    return (
      <LayoutContainer>
        <Header right={{to:'/', label:'Close'}}>{this.props.route.title}</Header>
        <LayoutContent className="RecordPageContent">
          {/*
            switch (this.state.activeStep) {
              case 'Emotion':

                break;
              case 'Dimensions':

                break;
              case 'Triggers':

                break;
              case 'Actions':

                break;
              case 'Review':

                break;
            }
          */}
        </LayoutContent>
        <Pagination
          forward={{to:'/'}}
          backward={{to:'/'}}
          dots={this.state.steps}
        />
      </LayoutContainer>
    );
  }
}

export default RecordPage;