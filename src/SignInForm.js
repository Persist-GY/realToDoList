import React from 'react';
export default function (props) {
  return (
    <form className="signIn" onSubmit={props.onSubmit}> {/* 登录*/}
      <div className="row">
        <label>用户名</label>
        <input className='signIn-text' placeholder='请输入用户名' type="text" value={props.formData.username}
          onChange={props.onChange.bind(null, 'username')}/>
      </div>
      <div className="row">
        <label>密码</label>
        <input className='signIn-text' type="password" placeholder='请输入密码' value={props.formData.password}
          onChange={props.onChange.bind(null, 'password')}/>
      </div>
      <div className="row actions">
        <button type="submit" className='login'>登录</button>
        <a href="#" onClick={props.onForgotPassword}>忘记密码了？</a>
      </div>
    </form>
  )
 }