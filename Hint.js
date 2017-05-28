import React, { Component } from 'react'
export default class Hint extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hint: 'tishi'
        }
    }
    render() {
        return (
            <div className='hint'>
                {this.state.hint}
            </div>
        )
    }
}
