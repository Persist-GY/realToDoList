import React, { Component } from 'react';
import './App.css';
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import 'normalize.css'
import './reset.css'
import UserDialog from './UserDialog'
import { getCurrentUser, signOut, postToDoList} from './leanCloud'
import { jsonParseObj } from './JSON'



class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: getCurrentUser() || { todo: [] },
      newTodo: ''
    }
    console.log(this.state.user)
  }
  
  render() {
    //读取没有删除的数据
    let todos;
    if (!this.state.user.todo) {
      todos = []
    } else {
      todos = this.state.user.todo
        .filter((item) => !item.deleted)
        .map((item, index) => {
          return ( // 为什么这里要加个括号？这是动手题3 🐸 不加小括号，意思是直接返回当前行后面空，不会走下面另一行的代码
            <li key={index}>
              <TodoItem todo={item} onToggle={this.toggle.bind(this)}
                onDelete={this.delete.bind(this)} />
            </li>
          )
        })
    }

    return (
      <div className="App">
        <h1><span>{this.state.user.username || ''}</span>待办
           {this.state.user.id ? <button onClick={this.signOut.bind(this)}>登出</button> : null}
        </h1>
        <dic className="inputWrapper">
          <TodoInput content={this.state.newTodo}
            onChange={this.changeTitle.bind(this)}
            onSubmit={this.addTodo.bind(this)} />
        </dic>
        <ol className="todoList">
          {todos}
        </ol>
        {this.state.user.id ?
          null :
          <UserDialog
            onSignUp={this.onSignUpOrSignIn.bind(this)}
            onSignIn={this.onSignUpOrSignIn.bind(this)} />}
      </div>
    );
  }

  //监听input输入改变，是为了解决在点击回车添加todo时，输入框置空
  changeTitle(event) {

    let stateCopy = jsonParseObj(this.state)
    stateCopy.newTodo = event.target.value
    this.setState(stateCopy)

  }

  //添加待办事项
  addTodo(event) {
    this.state.user.todo.push({
      id: idMaker(),
      title: event.target.value,
      status: null,
      deleted: false
    })
    let stateCopy = jsonParseObj(this.state)
    stateCopy.user = this.state.user
    stateCopy.newTodo = ''
    this.setState(stateCopy)
    postToDoList(stateCopy.user.todo)
  }

  //设置完成 未完成
  toggle(e, todo) {
    todo.status = todo.status === 'completed' ? '' : 'completed'
    this.setState(this.state)
    postToDoList(this.state.user.todo)
  }
  //删除待办
  delete(event, todo) {
    todo.deleted = true
    this.setState(this.state)
    postToDoList(this.state.user.todo)
  }

  //点击注册或者登录时  更新username
  onSignUpOrSignIn(user) {
    let stateCopy = jsonParseObj(this.state)
    stateCopy.user = user
    this.setState(stateCopy)
  }
  //登出
  signOut() {
    signOut()
    let stateCopy = jsonParseObj(this.state)
    stateCopy.user = {}
    stateCopy.newTodo = ''
    this.setState(stateCopy)
  }
}
//待办id
let id = 0

function idMaker() {
  id = 1
  return id
}
export default App;
