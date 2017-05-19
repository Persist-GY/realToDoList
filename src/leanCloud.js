import AV from 'leancloud-storage'

//初始化leanCloud
var APP_ID = 'zLdOXbSPLSrBrJoDr9N1emGM-gzGzoHsz'
var APP_KEY = 'g5tyY2cw3UYf7Pu4c03AeNOr'
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})


//注册用户
export function signUp(username, password, successFn, errorFn) {
  // 新建 AVUser 对象实例
  var user = new AV.User()
  // 设置用户名
  user.setUsername(username)
  // 设置密码
  user.setPassword(password)

  // 设置邮箱
  user.signUp().then(function (loginedUser) {
    //设zhi待办列表
    loginedUser.set('todo', [])
    let user = getUserFromAVUser(loginedUser)
    successFn.call(null, user)

  }, function (error) {
    errorFn.call(null, error)
  })

  return undefined

}
//获取当前用户
function getUserFromAVUser(AVUser) {
  return {
    id: AVUser.id,
    ...AVUser.attributes
  }
}

//重新打开页面获取上次登录的用户获取todo  默认的缓存没有这个属性(又有了)
export function getCurrentUserToDoList(fn) {
 if(!AV.User.current()){
   fn()
   return;
 }
  let user = getUserFromAVUser(AV.User.current())
  if (user) {
    var query = new AV.Query('_User');
    query.get(user.id).then(function (user) {
      // 成功获得实例
      if (user) {
        fn(getUserFromAVUser(user))
      } else {
        return null
      }
    }, function (error) {
      // 异常处理
    });
  }

}
export function getCurrentUser() {
  let user = AV.User.current()
  if (user) {
    console.log(user)
    return getUserFromAVUser(user)
  } else {
    return null
  }

}
//登出
export function signOut() {
  AV.User.logOut()
  return undefined
}

//登录
export function signIn(username, password, successFn, errorFn) {
  AV.User.logIn(username, password).then(function (loginedUser) {
    let user = getUserFromAVUser(loginedUser)
    successFn.call(null, user)
  }, function (error) {
    errorFn.call(null, error)
  })
}

//向leanCloud 发送数据
export function postToDoList(todo) {
  let user = AV.User.current()
  user.attributes.todo = todo
  console.log(user, todo)
  user.save().then(function (todo) {
    console.log('objectId is ' + todo.id);
  }, function (error) {
    console.error(error);
  });
}



export default AV