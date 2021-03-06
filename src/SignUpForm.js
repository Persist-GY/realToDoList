import React from 'react';
export default function (props) {
  return (
    <form className="signUp" onSubmit={props.onSubmit.bind(this)}> {/* 注册*/}
      <div className="row">
        <label>邮箱</label>
        <input className='signUp-text' type="text" placeholder='请输入邮箱' value={props.formData.email}
          onChange={props.onChange.bind(null, 'email')}/>
      </div>
      <div className="row">
        <label>用户名</label>
        <input className='signUp-text' type="text" placeholder='请输入用户名' value={props.formData.username}
          onChange={props.onChange.bind(null, 'username')}/>
        {/* bind 不仅可以绑定 this，还可以绑定第一个参数 */}
      </div>
      <div className="row">
        <label>密码</label>
        <input  className='signUp-text' type="password" placeholder='请输入密码' value={props.formData.password}
          onChange={props.onChange.bind(null, 'password')}/>
      </div>
      <div className="row actions">
        <button type="submit">注册</button>
      </div>
    </form>
  )
 }