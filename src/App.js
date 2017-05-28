import React, { Component } from 'react';
import './App.css';
import TodoInput from './TodoInput' //每个输入框组件
import TodoItem from './TodoItem' //每个待办组件
import 'normalize.css'
import './reset.css'
import UserDialog from './UserDialog' //对话框组件
import { getCurrentUser, signOut, TodoModel } from './leanCloud' //leanCloud组件  得到上次登陆的账号信息  登出  增删改查发送待办
import { jsonParseObj } from './JSON' //对象深拷贝
import Mark from './Mark'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: getCurrentUser() || {},
      newTodo: '',
      todoList: [],
      type: 1
    }
    let user = getCurrentUser()
    if (user) {
      (this.getAllTodoList.bind(this))()
    }

  }

  render() {
    let todo = this.state.todoList
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
        <h1><span>ToDoList By {this.state.user.username || ''}</span>
          {this.state.user.id ? <button onClick={this.signOut.bind(this)}>登出</button> : null}
        </h1>
        <dic className="inputWrapper">
          <TodoInput content={this.state.newTodo}
            onChange={this.changeTitle.bind(this)}
            onSubmit={this.addTodo.bind(this)} />
        </dic>
        <ol className="todoList">
          {todo}
        </ol>
        <Mark all={this.getAllTodoList.bind(this)}
          uncomplete={this.getUnCompleteTodoList.bind(this)}
          complete={this.getCompleteTodoList.bind(this)}
          delete={this.getDeleteTodoList.bind(this)}
        />
        {this.state.user.id ?
          null :
          <UserDialog
            onSignUp={this.onSignUpOrSignIn.bind(this)}
            onSignIn={this.onSignUpOrSignIn.bind(this)} />}
      </div>
    );
  }
  //获取所有待办
  getAllTodoList() {
    TodoModel.getByUser(1, (todos) => {
      let stateCopy = jsonParseObj(this.state)
      stateCopy.todoList = todos
      stateCopy.type = 1
      this.setState(stateCopy)
    })
  }

  //获取未完成待办
  getUnCompleteTodoList() {
    TodoModel.getByUser(2, (todos) => {
      let stateCopy = jsonParseObj(this.state)
      stateCopy.todoList = todos
      stateCopy.type = 2
      this.setState(stateCopy)
    })
  }
  //获取已完成待办
  getCompleteTodoList() {
    TodoModel.getByUser(3, (todos) => {
      let stateCopy = jsonParseObj(this.state)
      stateCopy.todoList = todos
      stateCopy.type = 3
      this.setState(stateCopy)
    })
  }
  //获取已删除待办
  getDeleteTodoList() {
    TodoModel.getByUser(4, (todos) => {
      let stateCopy = jsonParseObj(this.state)
      stateCopy.todoList = todos
      this.setState(stateCopy)
    })
  }
  //监听input输入改变，是为了解决在点击回车添加todo时，输入框置空
  changeTitle(event) {

    let stateCopy = jsonParseObj(this.state)
    stateCopy.newTodo = event.target.value
    this.setState(stateCopy)

  }

  //获取当前时间
   getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
    }
    if (min >= 0 && min <= 9) {
        min = "0" + min;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hour + seperator2 + min
            
    return currentdate;
}
  //添加待办事项
  addTodo(event) {
    let newTodo = {
      title: event.target.value,
      status: '',
      deleted: false,
      date: this.getNowFormatDate()
    }
    TodoModel.create(newTodo, (id) => {
      newTodo.id = id
      //如果当前是所有todo  就显示 否则不显示 
      if (this.state.type === 1 || this.state.type === 2) {
        this.state.todoList.push(newTodo)
        let stateCopy = jsonParseObj(this.state)
        stateCopy.todoList = this.state.todoList
        stateCopy.newTodo = ''
        this.setState(stateCopy)
      }else{
        let stateCopy = jsonParseObj(this.state)
        stateCopy.newTodo = ''
        this.setState(stateCopy)
      }
    }, (error) => {
      console.log(error)
    })
  }

  //设置完成 未完成
  toggle(e, todo) {
    let oldStatus = todo.status
    todo.status = todo.status === 'completed' ? '' : 'completed'
    TodoModel.update(todo, () => {

      //判断当前是哪个type 所有 未完成 已完成 
      if (this.state.type === 1) {
        (this.getAllTodoList.bind(this))()
      } else if (this.state.type === 2) {
        (this.getUnCompleteTodoList.bind(this))()
      } else if (this.state.type === 3) {
        (this.getCompleteTodoList.bind(this))()
      }
    }, (error) => {
      todo.status = oldStatus
      this.setState(this.state)
    })
  }
  //删除待办
  delete(event, todo) {
    TodoModel.destroy(todo.id, () => {
      todo.deleted = true
      this.setState(this.state)
    })
  }

  //点击注册或者登录时  更新username
  onSignUpOrSignIn(user) {
    let stateCopy = jsonParseObj(this.state)
    stateCopy.user = user
    TodoModel.getByUser((todos) => {
      stateCopy.todoList = todos
      this.setState(stateCopy)
    })
  }
  //登出
  signOut() {
    signOut()
    let stateCopy = jsonParseObj(this.state)
    stateCopy.user = {}
    stateCopy.newTodo = ''
    stateCopy.todoList = []
    this.setState(stateCopy)
  }
}
export default App;
