import React, { Component } from 'react';
import './UserDialog.css'
import { signUp, signIn } from './leanCloud'



export default class UserDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: 'signUp',
            formData: {
                username: '',
                password: '',
            }
        }
    }

    //点击切换注册 登录
    switch(e) {
        this.setState({
            selected: e.target.value,
        })
    }

    //注册事件
    signUp(e) {
        e.preventDefault()
        let {username, password} = this.state.formData
        let success = (user) => {
            console.log(user)
            this.props.onSignUp.call(null, user)
        }
        let error = (error) => {
            switch (error.code) {
                case 202:
                    alert('用户名已被占用')
                    break
                case 214:
                    alert('手机号码已经被注册。')
                    break
                case 201:
                    alert('密码不能为空')
                    break
                case 203:
                    alert('电子邮箱地址已经被占用')
                    break
                case 217:
                    alert('无效的用户名，不允许空白用户名。')
                    break
                default:
                    alert(error)
                    break
            }
        }
        signUp(username, password, success, error)
    }

    //登录事件
    signIn(e) {
        e.preventDefault()
        let {username, password} = this.state.formData
        let success = (user) => {
            this.props.onSignIn.call(null, user)
        }
        let error = (error) => {
            switch (error.code) {
                case 210:
                    alert('用户名与密码不匹配')
                    break
                case 205:
                    alert('找不到电子邮箱地址对应的用户')
                    break
                case 211:
                    alert('找不到用户。')
                    break
                case 213:
                    alert('手机号码对应的用户不存在')
                    break
                case 200:
                    alert('手机号码对应的用户不存在')
                    break
                default:
                    alert(error)
                    break
            }
        }
        signIn(username, password, success, error)
    }
    //监听用户名 密码输入内容
    changeFormData(key, e) {
        let stateCopy = JSON.parse(JSON.stringify(this.state))  // 用 JSON 深拷贝
        stateCopy.formData[key] = e.target.value
        this.setState(stateCopy)
    }
    render() {
        //注册表单
        let signUpForm = (
            <form className="signUp" onSubmit={this.signUp.bind(this)}> {/* 注册*/}
                <div className="row">
                    <label>用户名</label>
                    <input type="text" value={this.state.formData.username}
                        onChange={this.changeFormData.bind(this, 'username')} />
                    {/* bind 不仅可以绑定 this，还可以绑定第一个参数 */}
                </div>
                <div className="row">
                    <label>密码</label>
                    <input type="password" value={this.state.formData.password}
                        onChange={this.changeFormData.bind(this, 'password')} />
                </div>
                <div className="row actions">
                    <button type="submit">注册</button>
                </div>
            </form>
        )

        //登录表单
        let signInForm = (
            <form className="signIn" onSubmit={this.signIn.bind(this)}> {/* 登录*/}
                <div className="row">
                    <label>用户名</label>
                    <input type="text" value={this.state.formData.username}
                        onChange={this.changeFormData.bind(this, 'username')} />
                </div>
                <div className="row">
                    <label>密码</label>
                    <input type="password" value={this.state.formData.password}
                        onChange={this.changeFormData.bind(this, 'password')} />
                </div>
                <div className="row actions">
                    <button type="submit">登录</button>
                </div>
            </form>
        )

        return (
            <div className="UserDialog-Wrapper">
                <div className="UserDialog">
                    <nav>
                        <label>
                            <input type="radio" value="signUp"
                                checked={this.state.selected === 'signUp'}
                                onChange={this.switch.bind(this)}
                            /> 注册</label>
                        <label>
                            <input type="radio" value="signIn"
                                checked={this.state.selected === 'signIn'}
                                onChange={this.switch.bind(this)}
                            /> 登录</label>
                    </nav>
                    <div className="panes">
                        {this.state.selected === 'signUp' ? signUpForm : null}
                        {this.state.selected === 'signIn' ? signInForm : null}
                    </div>
                </div>
            </div>
        )
    }
}