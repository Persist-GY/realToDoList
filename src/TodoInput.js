import React, { Component } from 'react';
import './TodoInput.css'


export default class TodoInput extends Component {
  render() {
    return <input type="text" value={this.props.content}
      className="TodoInput"
      onChange={this.changeTitle.bind(this)}
      onKeyPress={this.submit.bind(this)} />
  }

  //回车  添加待办
  submit(e) {
    if (e.key === 'Enter') {
      console.log('用户按回车了');
      this.props.onSubmit(e)
    }
  }

  //监听输入文字
  changeTitle(e) {
    this.props.onChange(e)
  }
}