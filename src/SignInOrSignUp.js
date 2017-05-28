import React, { Component } from 'react'
import SignUpForm from './SignUpForm'  //注册表单
import SignInForm from './SignInForm'  //登录表单


export default class SignInOrSignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: 'signUp'
        }
    }

    //点击切换注册 登录
    switch(e) {
        this.setState({
            selected: e.target.value
        })
    }

    render() {
        return (
            <div className="signInOrSignUp">
                <nav>
                    <label className='signUp'>
                        <input type="radio" value="signUp"
                            checked={this.state.selected === 'signUp'}
                            onChange={this.switch.bind(this)}
                        /> <span>注册</span></label>
                    <label className='signIn'>
                        <input type="radio" value="signIn"
                            checked={this.state.selected === 'signIn'}
                            onChange={this.switch.bind(this)}
                        /> <span>登录</span></label>
                </nav>
                <div className="panes">
                    {this.state.selected === 'signUp' ?
                        <SignUpForm formData={this.props.formData}
                            onSubmit={this.props.onSignUp}
                            onChange={this.props.onChange}
                        />
                        : null}
                    {this.state.selected === 'signIn' ?
                        <SignInForm formData={this.props.formData}
                            onChange={this.props.onChange}
                            onSubmit={this.props.onSignIn}
                            onForgotPassword={this.props.onForgotPassword}
                        />
                        : null}
                </div>
            </div>
        )
    }
}