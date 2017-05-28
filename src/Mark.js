import React from 'react';
export default function(props){
    return (
    <div className='mark'>
       <button onClick={changeColor.bind(null,props,1)} className='active'>ALL</button>
       <button onClick={changeColor.bind(null,props,2)}>UNCOMPLETED</button>
       <button onClick={changeColor.bind(null,props,3)}>COMPLETED</button>
       {/*<button onClick={changeColor.bind(null,props,4)}>DELETE</button>*/}
    </div>
    )
}

function changeColor(props,type,e) {

    //最下边button
    let btnArr = document.querySelectorAll('.mark>button')
    for(let i = 0;i<btnArr.length;i++){
        let btn = btnArr[i]
        btn.classList.remove('active')
    }
   if(type === 1){
       //所有待办
       props.all()
       btnArr[0].classList.add('active')
   }else if(type === 2){
       //未完成
       props.uncomplete()
       btnArr[1].classList.add('active')
   }else if(type === 3){
       //已完成
       props.complete()
       btnArr[2].classList.add('active')
   }else if(type === 4){
       //已删除
       props.delete()
       btnArr[3].classList.add('active')
   }
}