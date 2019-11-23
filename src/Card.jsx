import React from 'react'
import './card.css'
import tree from './images/tree.png'
import seal from './images/seal.png'

class Card extends React.Component {
    render() {
        return (
            <div className='myWrapper'>
                <div className='myCard'>
                    <div className='myEnvelope'>
                        <div className='myLid'></div>
                    </div>
                    <img className='seal' src={seal} alt={'>:3'} />
                    <div className='myLetter'>
                        <img style={{ height: '90%' }} className='pt-3' src={tree} alt={'>:3'} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Card