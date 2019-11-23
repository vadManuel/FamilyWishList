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

import grayGift from './images/gray_gift.png'
import redGift from './images/red_gift.png'
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
        const changeLoadingState = () => {
            this.setState({ isLoading: false })
        }
        const changeBlackscreenState = () => {
            this.setState({ isBlackscreen: !this.state.isBlackscreen })
        }

        let finishedLoading = false
        let finishedAnimation = false
        setTimeout(() => {
            changeBlackscreenState()
        }, 4000)
        setTimeout(() => {
            changeBlackscreenState()
        }, 5600)
        setTimeout(() => {
            if (finishedLoading) {
                changeLoadingState()
            }
            finishedAnimation = true
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
                    if (finishedAnimation) {
                        changeLoadingState()
                    }
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
                    <Button className='w-100 m-0' color='danger' onClick={() => {
                        this.handleRemove(currDeleteKey)
                        this.toggleModal()
                    }}>I don't even know you...</Button>
                    <div className='mx-0 mx-md-2 my-1 my-md-0'></div>
                    <Button className='w-100 m-0' color='primary' onClick={this.toggleModal}>What! No, I'm sorry!</Button>
                </ModalFooter>
            </Modal>
        )

        const Stuff = () => (
            <Container>
                <Row>
                    {(wishes.length === 0) ? (<Alert color='light' className='w-100 mt-4 text-center border-0'>So sad! No wishes here :(</Alert>) : wishes.map((wish, key) => 
                        <Col key={`card-${key+1}-${Date.now()}`} xs='12' md='6' className='mb-2 mb-md-4'>
                            <div style={{ borderRadius:'4px', margin:'5px'}} className='mx-0 p-1 bg-light h-100'>
                                <div className='d-flex flex-row w-100'>
                                    {/* Gift checkbox */}
                                    <div className='px-1 pt-1'>
                                        <div onClick={() => this.handleCheckbox(key)}>
                                        <img style={{ height: '30px' }} src={wish[1].checked ? redGift : grayGift} alt={'>:3'} />
                                        </div>
                                    </div>
                                    {/* Body of card (title and description)*/}
                                    <div className='d-flex flex-column px-1 pt-1 w-100'>
                                        {/* Title of card */}
                                        <div className='d-flex align-items-center'>
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
                                        {wish[1].description !== '' ? <div>
                                            <p className='text-secondary'>{wish[1].description}</p>
                                        </div> : null}
                                    </div>
                                    {/* Erase card */}
                                    <div className='px-1 pt-1 ml-auto'>
                                        <Button close style={{ marginTop:'2px' }} onClick={() => {
                                            this.toggleModal(key)
                                        }}/>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    )}
                </Row>
            </Container>
        )

        return (
            <div>
                { isBlackscreen ? <Blackscreen /> : null }
                { isLoading ? <Card /> :
                <div>
                    <Navigation wishers={wishers} changeSelectedWisher={this.changeSelectedWisher}/>
                    <WarningModal />
                    <Stuff />
                </div>
                }
            </div>
        )
    }
}

export default App