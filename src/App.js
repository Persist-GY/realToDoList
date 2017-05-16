import React, { Component } from 'react';
import './App.css';
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import 'normalize.css'
import './reset.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newTodo: '',
      todoList: []
    }
  }
  render() {

    //读取没有删除的数据
    let todos = this.state.todoList
      .filter((item) => !item.deleted)
      .map((item, index) => {
        return ( // 为什么这里要加个括号？这是动手题3 🐸 不加小括号，意思是直接返回当前行后面空，不会走下面另一行的代码
          <li key={index}>
            <TodoItem todo={item} onToggle={this.toggle.bind(this)}
              onDelete={this.delete.bind(this)} />
          </li>
        )
      })

    return (
      <div className="App">
        <h1>我的待办</h1>
        <dic className="inputWrapper">
          <TodoInput content={this.state.newTodo}
            onChange={this.changeTitle.bind(this)}
            onSubmit={this.addTodo.bind(this)} />
        </dic>
        <ol className="todoList">
          {todos}
        </ol>
      </div>
    );
  }

  //监听input输入改变，是为了解决在点击回车添加todo时，输入框置空
  changeTitle(event) {
    this.setState({
      newTodo: event.target.value,
      todoList: this.state.todoList
    })
  }

  //添加待办事项
  addTodo(event) {
    this.state.todoList.push({
      id: idMaker(),
      title: event.target.value,
      status: null,
      deleted: false
    })
    this.setState({
      newTodo: '',
      todoList: this.state.todoList
    })
  }

//设置完成 未完成
  toggle(e, todo) {
    todo.status = todo.status === 'completed' ? '' : 'completed'
    this.setState(this.state)
  }
  //删除待办
  delete(event, todo) {
    todo.deleted = true
    this.setState(this.state)
  }
}
//待办id
let id = 0

function idMaker() {
  id += 1
  return id
}
export default App;
