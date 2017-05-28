import AV from 'leancloud-storage'

//初始化leanCloud
var APP_ID = 'zLdOXbSPLSrBrJoDr9N1emGM-gzGzoHsz'
var APP_KEY = 'g5tyY2cw3UYf7Pu4c03AeNOr'
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})


//注册用户
export function signUp(email, username, password, successFn, errorFn) {
  // 新建 AVUser 对象实例
  var user = new AV.User()
  // 设置用户名
  user.setUsername(username)
  // 设置密码
  user.setPassword(password)
  // 设置邮箱
  user.setEmail(email)
  user.signUp().then(function (loginedUser) {
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
  if (!AV.User.current()) {
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

//获取上次登录的账户
export function getCurrentUser() {
  let user = AV.User.current()
  if (user) {
    // console.log(user)
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
    // console.log(todo.id);
  }, function (error) {
    console.error(error);
  });
}

//发送重置密码邮箱账号
export function sendPasswordResetEmail(email, successFn, errorFn) {
  AV.User.requestPasswordReset(email).then(function (success) {
    successFn.call(success)
  }, function (error) {
    errorFn.call(error)
  })
}

// 所有跟 Todo 相关的 LeanCloud 操作都放到这里
export const TodoModel = {

  //获取所有用户的todo  查
  getByUser(type, successFn, errorFn) {
    // 文档见 https://leancloud.cn/docs/leanstorage_guide-js.html#批量操作
    let query
    if (type === 1) {
      //所有待办
      query = new AV.Query('Todo')
      query.equalTo('deleted', false)
      query.find().then((response) => {
        let array = response.map((t) => {
          return { id: t.id, ...t.attributes }
        })
        successFn.call(null, array)
        console.log(response)
      }, (error) => {
        errorFn && errorFn.call(null, error)

      })
    } else if (type === 2) {
      //未完成
      let cql = 'select * from Todo where status = ? and deleted = ?';
      let pvalues = ['', false];
      AV.Query.doCloudQuery(cql, pvalues).then(function (data) {
        // results 即为查询结果，它是一个 AV.Object 数组
        var results = data.results;
        let array = results.map((t) => {
          return { id: t.id, ...t.attributes }
        })
        console.log(results)
        successFn.call(null, array)
      }, function (error) {
      })
      // console.log('未完成')

    } else if (type === 3) {
      //已完成
      let cql = 'select * from Todo where status = ? and deleted = ?';
      let pvalues = ['completed', false];
      AV.Query.doCloudQuery(cql, pvalues).then(function (data) {
        // results 即为查询结果，它是一个 AV.Object 数组
        var results = data.results;
        let array = results.map((t) => {
          return { id: t.id, ...t.attributes }
        })
        successFn.call(null, array)
      }, function (error) {
      })
      // console.log('已完成')
    } else if (type === 4) {
      //已删除
      query = new AV.Query('Todo')
      query.equalTo('deleted', true)

    }


  },

  //增
  create({status, title, deleted,date}, successFn, errorFn) {
    let Todo = AV.Object.extend('Todo') // 记得把多余的分号删掉，我讨厌分号
    let todo = new Todo()
    todo.set('title', title)
    todo.set('status', status)
    todo.set('deleted', deleted)
    todo.set('date', date)
    // 根据文档 https://leancloud.cn/docs/acl-guide.html#单用户权限设置
    // 这样做就可以让这个 Todo 只被当前用户看到
    let acl = new AV.ACL()
    acl.setPublicReadAccess(false) // 注意这里是 false 读权限不公开
    acl.setWriteAccess(AV.User.current(), true) //写权限只有当前用户可以
    acl.setReadAccess(AV.User.current(), true) //度权限只有当前用户
    todo.setACL(acl);
    todo.save().then(function (response) {
      successFn.call(null, response.id)
    }, function (error) {
      errorFn && errorFn.call(null, error)
    });
  },
  //改
  update({id, title, status, deleted}, successFn, errorFn) {
    // 文档 https://leancloud.cn/docs/leanstorage_guide-js.html#更新对象
    let todo = AV.Object.createWithoutData('Todo', id)
    title !== undefined && todo.set('title', title)
    status !== undefined && todo.set('status', status)
    deleted !== undefined && todo.set('deleted', deleted)
    // 为什么我要像上面那样写代码？
    // 考虑如下场景
    // update({id:1, title:'hi'})
    // 调用 update 时，很有可能没有传 status 和 deleted
    // 也就是说，用户只想「局部更新」
    // 所以我们只 set 该 set 的
    // 那么为什么不写成 title && todo.set('title', title) 呢，为什么要多此一举跟 undefined 做对比呢？
    // 考虑如下场景
    // update({id:1, title: '', status: null}}
    // 用户想将 title 和 status 置空，我们要满足
    todo.save().then((response) => {
      successFn && successFn.call(null)
    },
      (error) => errorFn && errorFn.call(null, error))
  },
  //删
  destroy(todoId, successFn, errorFn) {
    // 文档 https://leancloud.cn/docs/leanstorage_guide-js.html#删除对象
    //  let todo = AV.Object.createWithoutData('Todo', todoId)
    //  todo.destroy().then(function (response) {
    //    successFn && successFn.call(null)
    //  }, function (error) {
    //    errorFn && errorFn.call(null, error)
    //  })

    // 我们不应该删除数据，而是将数据标记为 deleted
    TodoModel.update({ id: todoId, deleted: true }, successFn, errorFn)
  }

}
export default AV