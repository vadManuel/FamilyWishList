import React from 'react';
import Navigation from './Navigation'
import Blackscreen from './Blackscreen'
import Card from './Card'
import {
    Container,
    Row,
    Col,
    Button,
    Alert,
    NavLink,
    Modal,
    ModalHeader,
    ModalFooter
} from 'reactstrap'
import { db } from './firebase/Firebase'

import uncheckedGift from './images/white_gift.png'
import checkedGift from './images/red_gift.png'
import popOutLink from './images/bluePopOutLink.png'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userInput: {
                selectedWisher: ''
            },
            isModalOpen: false,
            isLoading: true,
            isBlackscreen: false,
            wishers: [],
            wishes: [],
            currDeleteKey: null
        }

        this.toggleModal = this.toggleModal.bind(this)
        this.changeSelectedWisher = this.changeSelectedWisher.bind(this)
        this.handleUserInput = this.handleUserInput.bind(this)
        this.handleCheckbox = this.handleCheckbox.bind(this)
    }

    componentDidMount() {
        const changeLoadingState = (finishedAnimation, finishedLoading) => {
            if (finishedAnimation && finishedLoading) {
                this.setState({ isLoading: false })
            }
        }
        const changeBlackscreenState = () => {
            this.setState({ isBlackscreen: true })
        }

        let finishedLoading = false
        let finishedAnimation = false
        setTimeout(() => {
            changeBlackscreenState()
        }, 4000)
        setTimeout(() => {
            finishedAnimation = true
            changeLoadingState(finishedAnimation, finishedLoading)
        }, 4500)
        db.collection('wishers').onSnapshot(snapshot => {
            let newWishers = []
            snapshot.forEach(doc => {
                newWishers.push(doc.data().name)
            })

            if (newWishers.length !== 0) {
                db.collection(newWishers[0]).onSnapshot(snapshot => {
                    let newWishes = []
                    snapshot.forEach(doc => {
                        newWishes.push([doc.id, doc.data()])
                    })
                    
                    this.setState({
                        userInput: { selectedWisher: newWishers[0] },
                        wishers: newWishers,
                        wishes: newWishes
                    })
    
                    finishedLoading = true
                    changeLoadingState(finishedAnimation, finishedLoading)
                })
            }
            finishedLoading = true
            if (finishedAnimation) {
                changeLoadingState()
            }
        })
    }

    changeSelectedWisher(newWisher) {
        db.collection('wishers').onSnapshot(snapshot => {
            let newWishers = []
            snapshot.forEach(doc => {
                newWishers.push(doc.data().name)
            })

            let tempArr = [newWisher]
            for (let i = 0; i < newWishers.length; i++) {
                if (newWishers[i] !== newWisher) {
                    tempArr.push(newWishers[i])
                }
            }

            db.collection(newWisher).onSnapshot(snapshot => {
                let newWishes = []
                snapshot.forEach(doc => {
                    newWishes.push([doc.id, doc.data()])
                })
                
                this.setState({
                    userInput: { selectedWisher: newWisher },
                    wishers: tempArr,
                    wishes: newWishes
                })
            })
        })
    }

    handleUserInput(event) {
        const target = event.target
        this.setState(prevState => ({ userInput: { ...prevState.userInput, [target.name]: target.value }}))
    }

    handleCheckbox(index) {
        const { wishes } = this.state
        wishes[index][1].checked = !wishes[index][1].checked
        this.setState({ wishes })
        db.collection(this.state.userInput.selectedWisher).doc(wishes[index][0]).update({ ...wishes[index][1] })
    }

    handleRemove(index) {
        const { wishes } = this.state
        db.collection(this.state.userInput.selectedWisher).doc(wishes[index][0]).delete()
    }

    toggleModal(currDeleteKey) {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
            currDeleteKey
        })
    }

    render() {
        const {
            isModalOpen,
            wishes,
            wishers,
            isLoading,
            isBlackscreen,
            currDeleteKey
        } = this.state

        const WarningModal = () => (
            <Modal isOpen={isModalOpen} modalTransition={{ timeout: 250 }} backdropTransition={{ timeout: 250 }} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Please don't erase me <span role='img' aria-label='sad-face-emoji'>🥺🥺</span></ModalHeader>
                <ModalFooter className='d-flex flex-column flex-md-row justify-content-center align-items-center'>
                    <Button className='w-100 m-0 border-0' style={{background:'rgb(179, 20, 22)'}} onClick={() => {
                        this.handleRemove(currDeleteKey)
                        this.toggleModal()
                    }}>I don't even know you...</Button>
                    <div className='mx-0 mx-md-2 my-1 my-md-0'></div>
                    <Button className='w-100 m-0 border-0' color='primary' onClick={this.toggleModal}>What! No, I'm sorry!</Button>
                </ModalFooter>
            </Modal>
        )

        const Stuff = () => (
            <Container>
                <Row className='mt-2 mb-5'>
                    {(wishes.length === 0) ? (<Alert style={{background:'transparent'}} className='w-100 text-white mt-4 text-center border-0'>So sad! No wishes here :(</Alert>) : wishes.map((wish, key) => 
                        <Col key={`card-${key+1}`} xs='12' md='6' className='do-magic-thing'>
                            <div style={{ borderRadius:'4px', background:'rgb(235,236,240)'}} className='card-thing mt-4 mt-md-3 mx-0 d-flex flex-column'>
                                <div className='d-flex flex-row w-100 h-100'>
                                    {/* Gift checkbox */}
                                    <div className='mr-1 d-flex align-items-center justify-content-center p-2 h-auto' style={{ background:'rgb(13,31,65)', borderRadius:'4px 0 0 4px' }} onClick={() => this.handleCheckbox(key)}>
                                        <img className='align-self-center' style={{ height: '2.5rem' }} src={wish[1].checked ? checkedGift : uncheckedGift} alt={'>:3'} />
                                    </div>
                                    {/* Body of card (title and description)*/}
                                    <div className='d-flex flex-column justify-content-center px-1 pt-1 w-100 h-auto'>
                                        {/* Title of card */}
                                        <div className=''>
                                            <h4>{
                                                wish[1].link !== '' ?
                                                    <NavLink href={wish[1].link} className='p-0 m-0'>
                                                        {wish[1].title}
                                                        <img style={{ marginLeft:'4px', height: '11px' }} src={popOutLink} alt={'>:3'} />
                                                    </NavLink>
                                                :
                                                wish[1].title
                                            }</h4>
                                        </div>
                                        {/* Description of card */}
                                        {wish[1].description !== '' ? <p className='text-secondary' style={{verticalAlign:'middle'}}>{wish[1].description}</p> : null}
                                    </div>
                                    {/* Erase card */}
                                    <div className='ml-auto p-0 m-0 h-auto d-flex flex-row align-items-center' style={{background:'rgb(179, 20, 22)', borderRadius:'0 4px 4px 0', }}>
                                        <Button className='border-0 m-0 py-1 px-2' style={{background:'transparent'}} onClick={() => {
                                            this.toggleModal(key)
                                        }}><span style={{fontSize: '2rem', fontWeight:'bold', color:'rgb(235,236,240)'}}>&#215;</span></Button>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    )}
                </Row>
            </Container>
        )

        document.body.classList.add('all')

        return (
            <div>
                { isBlackscreen ? <Blackscreen /> : null }
                { isLoading ? <Card /> :
                <div>
                    <Navigation wishers={wishers} changeSelectedWisher={this.changeSelectedWisher} />
                    <WarningModal />
                    <Stuff />
                </div>
                }
            </div>
        )
    }
}

export default App