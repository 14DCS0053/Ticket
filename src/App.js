import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
var range_msg = "Input range is 100000 to 999999";
var max_ticket_range_msg = "Max. allowed ticket is 5, delete some tickets to enter the ticket number";

function Invalid({ removeModel, invalid_msg }) {
  return <div className="invalid-box">
    <div className="invalid-area">
      {invalid_msg}
      <button onClick={removeModel}>Ok</button>
    </div>
  </div>
}

class App extends Component {
  state = {
    buttons: [7, 8, 9, 4, 5, 6, 1, 2, 3],
    input_text: "",
    invalid_text: false,
    tickets: [],
    invalid_msg: "",
    rotate_wheel: false
  }
  removeModel = () => {
    this.setState({
      invalid_text: false
    })
  }
  inputChange = value => {
    const { input_text, tickets } = this.state;
    if (tickets.length >= 5) {
      return this.setState({
        invalid_text: true,
        invalid_msg: max_ticket_range_msg
      })
    }
    else if (input_text.length > 5) {
      return this.setState({
        invalid_text: true,
        invalid_msg: range_msg
      })
    }
    else if (input_text || value !== "0") {
      this.setState({
        input_text: input_text + value
      })
    }
  }
  editInput = () => {
    const { input_text } = this.state;
    if (input_text) {
      const new_input_text = input_text.slice(0, input_text.length - 1);
      this.setState({
        input_text: new_input_text
      })
    }
  }
  deleteInput = () => {
    if (this.state.input_text) {
      this.setState({
        input_text: ""
      })
    }
  }
  deleteTicket = ticket_number => {
    const newTicket = [...this.state.tickets];
    newTicket.splice(ticket_number, 1);
    this.setState({
      tickets: newTicket
    })
  }
  addTicket = () => {
    const { input_text, tickets } = this.state;
    if (input_text.length !== 6) {
      this.setState({
        invalid_text: true,
        invalid_msg: range_msg
      })
    }
    else if (tickets.find(t => t == input_text)) {
      const index = tickets.findIndex(t => t == input_text) + 1;
      this.setState({
        invalid_text: true,
        invalid_msg: `You can't add duplicate of a ticket, ticket no. ${index} matches to this ticket.`
      })
    }
    else {
      this.setState({
        tickets: [...tickets, input_text],
        input_text: ""
      })
    }
  }
  randomNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  genrateNoByWheel = () => {
    const { rotate_wheel, tickets } = this.state;
    var random = this.randomNumber(100000, 999999).toString();
    if (!rotate_wheel) {
      if (tickets.length >= 5) {
        return this.setState({
          invalid_text: true,
          invalid_msg: "Max. allowed ticket  is 5, delete some tickets to generate number"
        })
      }
      this.setState({
        rotate_wheel: true
      }, () => {
        setTimeout(() => {
          while (tickets.find(t => t == random)) {
            random = this.randomNumber(100000, 999999).toString();
          }
          this.setState({
            rotate_wheel: false,
            input_text: random
          })
        }, 1000)
      })
    }
  }
  render() {
    const { buttons, input_text, invalid_text, tickets, invalid_msg, rotate_wheel } = this.state;
    return (
      <div className="App">
        {invalid_text && <Invalid removeModel={this.removeModel} invalid_msg={invalid_msg} />}
        <div className="Upper">
          <div className="form-box">
            <div className="input-area">
              <div className="input-text"> {input_text}</div>
              {!input_text && <div className="placeholder">Enter 6 Digits</div>}
            </div>
            <div className="button-box">
              {buttons.map(b => <div className="button" onClick={this.inputChange.bind(this, b.toString())}>
                {b}
              </div>)
              }
            </div>
            <div className="bottom-button-box button-box">
              <div className="button" onClick={this.editInput} style={{ borderLeft: "none" }}><i class="fa fa-window-close" aria-hidden="true"></i></div>
              <div className="button" onClick={this.inputChange.bind(this, "0")}>0</div>
              <div className="button" onClick={this.deleteInput} style={{ color: "red" }}><i class="fa fa-trash" aria-hidden="true"></i></div>
              <div className="add-ticket" onClick={this.addTicket}><i class="fa fa-plus-square-o" aria-hidden="true"></i><button>ADD TICKET</button></div>
            </div>
          </div>
          <div className="wheel-box">
            <h2> Click the wheel to genrate random Tickets</h2>
            <img src={logo} onClick={this.genrateNoByWheel} className={rotate_wheel ? "rotate-wheel" : ""} />
            <div>Ticket number range 100000 - 999999</div>
          </div>
        </div>
        <div className="ticket-area">
          {tickets.length > 0 && <h3>Your Selected Tickets:</h3> || <h3>No Ticket to show:</h3>}
          {tickets.length > 0 && <div className="ticket-container">{
            tickets.map((t, i) => {
              return <div className="ticket-box">
                <span>Ticket #{i + 1}</span>
                <div className="circle-box">
                  {t.split('').map(n => <div>{n}</div>)}
                  <button title="click to delete this ticket" onClick={() => this.deleteTicket(i)}><i class="fa fa-trash" aria-hidden="true"></i></button>
                </div>
              </div>
            })
          }</div>}
        </div>
      </div>
    )
  }
}

export default App;
