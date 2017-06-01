import React, { Component } from 'react';
import './TodoItem.css'
export default class TodoItem extends Component {
  render() {
    return (
      <div>
        <div className="TodoItem">
          <input type="checkbox" checked={this.props.todo.status === 'completed'}
            onChange={this.toggle.bind(this)} />
          <span className={this.props.todo.status === 'completed' ? 'title active' : 'title'}>{this.props.todo.title}</span>
          <button onClick={this.delete.bind(this)}>X</button>
        </div>
        <input type='date' onChange={this.changeDate.bind(this)} value={this.props.todo.date===''?'':this.props.todo.date} className='date'/>
      </div>

    )
  }

//选择日期
changeDate(e) {
  
  this.props.changeDate(e, this.props.todo)
}

  //设置待办完成 未完成
  toggle(e) {

    this.props.onToggle(e, this.props.todo)

  }

  //删除待办
  delete(e) {
    this.props.onDelete(e, this.props.todo)
  }
}