import React, { Component } from 'react';
import './UserDialog.css'
import { signUp, signIn, sendPasswordResetEmail } from './leanCloud' //leanCloud.js 注册方法  登录方法  发送邮箱重置密码
import { jsonParseObj } from './JSON' //实现对象深拷贝
import { showStatusCodeChinese } from './status' //错误状态吗
import ForgetPasswordForm from './ForgetPasswordForm' //忘记密码表单
import SignInOrSignUp from './SignInOrSignUp' //登录 注册表单


export default class UserDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedTab: 'signInOrSignUp', // 'forgetPassword'
            formData: {
                email: '',
                username: '',
                password: '',
            }
        }
    }

    //注册事件
    signUp(e) {
        e.preventDefault()
        let {email, username, password} = this.state.formData
        if (email.length === 0 || username.length === 0 || password.length === 0) {
            alert('请完善注册信息')
            return
        }
        var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
        if(!re.test(email)){
            alert("请输入正确邮箱")
            return;
        }
        if(username.length<=3){
            alert("用户名必须大于三个字符")
            return;  
        }
        if(password.length<6){
            alert("密码必须不小于6个字符")
            return;  
        }
        let success = (user) => {
            this.props.onSignUp.call(null, user)
        }
        let error = (error) => {
            showStatusCodeChinese(error)
        }
        signUp(email, username, password, success, error)
    }

    //登录事件
    signIn(e) {
        e.preventDefault()
        let {username, password} = this.state.formData
        if (username.length === 0 || username.password === 0) {
            alert('请完善登录信息')
            return
        }
        let success = (user) => {
            this.props.onSignIn.call(null, user)
        }
        let error = (error) => {
            showStatusCodeChinese(error)
        }
        signIn(username, password, success, error)
    }
    //监听用户名 密码输入内容
    changeFormData(key, e) {
        let stateCopy = jsonParseObj(this.state)  // 用 JSON 深拷贝
        stateCopy.formData[key] = e.target.value
        this.setState(stateCopy)
    }

    //展示重置密码界面
    showForgetPassword() {
        let stateCopy = jsonParseObj(this.state)
        stateCopy.selectedTab = 'forgetPassword'
        this.setState(stateCopy)
    }

    //重置密码
    resetPassword(e) {
        e.preventDefault()
        let success = (success) => {
            //重置密码成功 隐藏忘记密码表单
            let stateCopy = jsonParseObj(this.state)
            stateCopy.selectedTab = 'signInOrSignUp'
            this.setState(stateCopy)
            alert('重置密码成功，请查看邮箱。')
        }
        let error = (error) => {
            showStatusCodeChinese(error)
        }
        sendPasswordResetEmail(this.state.formData.email, success, error)
    }

    //返回登录
    returnToSignIn() {
        let stateCopy = jsonParseObj(this.state)
        stateCopy.selectedTab = 'signInOrSignUp'
        this.setState(stateCopy)
    }
    
    render() {

        return (
            <div className="UserDialog-Wrapper">
                <div className="UserDialog">
                    {this.state.selectedTab === 'signInOrSignUp' ?
                        <SignInOrSignUp
                            formData={this.state.formData}
                            onChange={this.changeFormData.bind(this)}
                            onSignUp={this.signUp.bind(this)}
                            onSignIn={this.signIn.bind(this)}
                            onForgotPassword={this.showForgetPassword.bind(this)}
                        /> :
                        <ForgetPasswordForm
                            formData={this.state.formData}
                            onSubmit={this.resetPassword.bind(this)}
                            onChange={this.changeFormData.bind(this)}
                            onSignIn={this.returnToSignIn.bind(this)}
                        />}

                </div>
            </div>
        )
    }
}