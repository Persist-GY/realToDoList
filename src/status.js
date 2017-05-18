//登录 注册 返回错误状态码
export function showStatusCodeChinese(error) {
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