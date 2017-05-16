import React from 'react'; // 因为下边用到了React.Component，所以必须导入这个文件。不导入会报错。

class Welcome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),// 更新 date
      test: '1'
    }
    setInterval(() => {
      this.setState({
        date: new Date(), // 更新 date
        test: 'setInterval'
      })
    }, 5000)
    console.log('我已经初始化好props和state')
  }
  componentWillMount() {
    this.setState({
      date: new Date(), // 更新 date
      test: 'componentWillMount'
    })
    console.log('运行到这里的话，说明马上就要运行 render 了')
  }
  render() {
    console.log('恩，这里是render')
    return (
      <div>
        <h1>Hello,{this.props.name}</h1>
        <h2>{this.state.date.toString()}</h2>
      </div>
    )
  }
  componentDidMount() {
    this.setState({
      date: new Date(), // 更新 date
      test: 'componentDidMount'
    })
    console.log('已经挂载到页面里了')
  }
  componentWillReceiveProps() {
    this.setState({
      date: new Date(), // 更新 date
      test: 'componentWillReceiveProps'
    }) 
  }
  shouldComponentUpdate() {
    this.setState({
      date: new Date(), // 更新 date
      test: 'componentWillReceiveProps'
    }) 
    return true;
  }
  componentWillUpdate() {
    console.log('将会更新')
  }
  componentDidUpdate() {
    console.log('更新完了')
  }
  componentWillUnmount() {
    console.log('要死了')
  }

}

export default Welcome
// export表示导出一个对象，就像任务1中的foo.js在index.js中import,可以使用foo函数。不加export,其他文件只会拿到一个空对象
//default 默认导出后边这个对象
//尝试不加default 在其他文件无法找到这个Welcome这个类，其他文件拿到undefined
//所以要想在其他文件中拿到Welcom这个类，必须两个都要设置
