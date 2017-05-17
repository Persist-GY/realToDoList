import AV from 'leancloud-storage'

//初始化leanCloud
 var APP_ID = 'zLdOXbSPLSrBrJoDr9N1emGM-gzGzoHsz'
 var APP_KEY = 'g5tyY2cw3UYf7Pu4c03AeNOr'
 AV.init({
   appId: APP_ID,
  appKey: APP_KEY
 })

 export default AV
 export function signUp(username, password, successFn, errorFn){
    // 新建 AVUser 对象实例
   var user = new AV.User()
   // 设置用户名
   user.setUsername(username)
   // 设置密码
   user.setPassword(password)
   // 设置邮箱
   user.signUp().then(function (loginedUser) {
     let user = getUserFromAVUser(loginedUser)
     successFn.call(null, user)
   }, function (error) {
     errorFn.call(null, error)
   })
 
   return undefined
 
 }
 //获取当前用户
 function getUserFromAVUser(AVUser){
   return {
     id: AVUser.id,
     ...AVUser.attributes
   }
 }

 //重新打开页面获取上次登录的用户
 export function getCurrentUser(){
   let user = AV.User.current()
   if(user){
     return getUserFromAVUser(user)
   }else{
     return null
   }
 }

 //登出
 export function signOut(){
   AV.User.logOut()
   return undefined
 }

 //登录
 export function signIn(username, password, successFn, errorFn){
  AV.User.logIn(username, password).then(function (loginedUser) {
    let user = getUserFromAVUser(loginedUser)
    successFn.call(null, user)
  }, function (error) {
    errorFn.call(null, error)
  })
}