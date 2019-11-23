import React from 'react'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    Button,
    Row,
    Col,
    Form,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    InputGroupAddon,
    InputGroup,
    InputGroupText,
    Container
} from 'reactstrap';
import { addWish, createWisher } from './firebase/functions'
import logo from './images/logo.png'

export class Navigation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userInput : {
                title: '',
                description: '',
                link: '',
                newPerson: '',
                selectedPerson: props.wishers[0],
            },
            badTitle: false,
            wishers: props.wishers,
            badNewPerson: false,
            isNavOpen: false,
            isModalOpen: false
        }

        this.handleSubmission = this.handleSubmission.bind(this)
        this.handleSelectedPerson = this.handleSelectedPerson.bind(this)
        this.handleUserInput = this.handleUserInput.bind(this)
        this.toggleNav = this.toggleNav.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
    }

    handleSubmission(event) {
        event.preventDefault()
        const {
            userInput: {
                title,
                description,
                link,
                newPerson,
                selectedPerson,        
            },
            wishers
        } = this.state

        if ((
                title !== '' && title !== undefined && title !== null)
                && ((selectedPerson !== '' && selectedPerson !== undefined && selectedPerson !== null)
                || (newPerson !== '' && newPerson !== undefined && newPerson !== null))
            ) {
            const tempDescription = ((description === '' || description === undefined || description === null) ? '' : description)
            const tempLink = ((link === '' || link === undefined || link === null) ? '' : 'http://'+link)
            
            if (newPerson !== '' && newPerson !== undefined && newPerson !== null) {
                createWisher(newPerson, title, tempDescription, tempLink)
                let tempArr = [newPerson]
                for (let i = 0; i < wishers.length; i++) {
                    if (wishers[i] !== newPerson) {
                        tempArr.push(wishers[i])
                    }
                }
                this.setState({
                    userInput: {
                        title: '',
                        description: '',
                        link: '',
                        newPerson: '',
                        selectedPerson: newPerson
                    },
                    wishers: tempArr
                })
                this.props.changeSelectedWisher(newPerson)
            } else {
                addWish(selectedPerson, title, tempDescription, tempLink)
                let tempArr = [selectedPerson]
                for (let i = 0; i < wishers.length; i++) {
                    if (wishers[i] !== selectedPerson) {
                        tempArr.push(wishers[i])
                    }
                }
                this.setState({
                    userInput: {
                        title: '',
                        description: '',
                        link: '',
                        newPerson: '',
                        selectedPerson
                    },
                    wishers: tempArr
                })
                this.props.changeSelectedWisher(selectedPerson)
            }

            this.toggleModal()
        } else {
            let badTitle = false
            let badNewPerson = false
            if (title === '' || title === undefined || title == null) {
                badTitle = true
            }
            if (selectedPerson === '' || selectedPerson === undefined || selectedPerson == null) {
                badNewPerson = true
            }
            this.setState({
                badTitle: badTitle,
                badNewPerson: badNewPerson
            })
        }
    }

    handleUserInput(event) {
        const { badNewPerson, badTitle } = this.state
        const target = event.target

        this.setState(prevState => ({
            userInput: {
                ...prevState.userInput,
                [target.name]: target.value
            },
            badTitle: target.name === 'title' ? false : badTitle,
            badNewPerson: target.name === 'newPerson' ? false : badNewPerson,
        }))
    }
    
    handleSelectedPerson(event) {
        // const { wishers } = this.state
        const target = event.target

        this.setState({
            userInput: {
                selectedPerson: target.value,
                newPerson: ''
            }
        })

        this.props.changeSelectedWisher(target.value)
    }

    toggleNav() {
        this.setState({ isNavOpen: !this.state.isNavOpen })
    }

    toggleModal() {
        this.setState({ isModalOpen: !this.state.isModalOpen })
    }

    render() {
        const {
            userInput,
            isNavOpen,
            isModalOpen,
            // badNewPerson,
            badTitle,
            wishers
        } = this.state

        return (
            // <Navbar color='light' light expand='md' className='sticky-top'>
            <Navbar expand='md' className='sticky-top nav-style' dark>
                <Container className='align-items-center'>
                {/* <NavbarBrand href='/'>2019 Wish List</NavbarBrand> */}
                <NavbarBrand>
                    <img style={{ height: '4rem' }} src={logo} alt={'>:3'} />
                </NavbarBrand>
                <NavbarToggler onClick={this.toggleNav} />
                <Collapse isOpen={isNavOpen} navbar>
                    <Nav style={{minWidth:'300px'}} className='ml-auto pt-3 pt-md-0 pb-1' navbar>
                        <Form className='w-100'>
                            <Input className='w-100 d-none d-md-block' type='select' name='select' value={userInput.selectedPerson} onChange={event => {
                                this.handleSelectedPerson(event)
                            }}>
                                {wishers.map((wisher, key) => {
                                    return <option value={wisher} key={`wishers-nav-${(key+1)}`}>{wisher}</option>
                                })}
                            </Input>
                            <Input className='w-100 d-block d-md-none' type='select' name='select' value={userInput.selectedPerson} onChange={event => {
                                this.handleSelectedPerson(event)
                                this.toggleNav()
                            }}>
                                {wishers.map((wisher, key) => {
                                    return <option value={wisher} key={`wishers-nav-${(key+1)}`}>{wisher}</option>
                                })}
                            </Input>
                        </Form>
                        <div className='mx-0 mx-md-2 my-2 my-md-0'></div>
                        <Button className='w-100 d-none d-md-block border-0' style={{background:'rgb(179, 20, 22)'}} onClick={this.toggleModal}>Add a Wish &#10010;</Button>
                        <Button className='w-100 d-block d-md-none border-0' style={{background:'rgb(179, 20, 22)'}} onClick={() => {
                            this.toggleModal()
                            this.toggleNav()
                        }}>Add a Wish &#10010;</Button>
                    </Nav>
                </Collapse>
                <Modal style={{background:'rgb(235,236,240)', borderRadius:'4px', border:'none'}} isOpen={isModalOpen} modalTransition={{ timeout: 250 }} backdropTransition={{ timeout: 250 }} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Wishy Wish Wash</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleSubmission}>
                            <Row>
                                {/* <Col xs='12' md='4'> */}
                                <Col xs='12'>
                                    <Input className='mb-2' type='select' name='select' value={userInput.selectedPerson} onChange={this.handleSelectedPerson}>
                                        {wishers.map((wisher, key) => {
                                            return <option value={wisher} key={`wishers-modal-${(key+1)}`}>{wisher}</option>
                                        })}
                                    </Input>
                                </Col>
                                {/* <Col xs='12' md='8'>
                                    <Input invalid={badNewPerson ? true : false} className='mb-2' value={userInput.newPerson} onChange={this.handleUserInput} type='text' name='newPerson' placeholder={badNewPerson ? 'my guy type in your name' : 'new wisher name'} />
                                </Col> */}
                            </Row>
                            <Input invalid={badTitle ? true : false} value={userInput.title} onChange={this.handleUserInput} type='text' name='title' placeholder={badTitle ? 'must enter your wish' : 'your wish'} />
                            <Input value={userInput.description} onChange={this.handleUserInput} className='my-2' type='text' name='description' placeholder='description' />
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                <InputGroupText className='text-secondary'>http://</InputGroupText>
                                </InputGroupAddon>
                                <Input value={userInput.link} onChange={this.handleUserInput} type='text' name='link' placeholder='link to your wish' />
                            </InputGroup>
                            <Input className='d-none' type='submit' />
                        </Form>
                    </ModalBody>
                    <ModalFooter className='d-flex flex-column flex-md-row justify-content-center align-items-center'>
                        <Button className='w-100 m-0 border-0' color='secondary' onClick={this.toggleModal}>Cancel</Button>
                        <div className='mx-0 mx-md-2 my-1 my-md-0'></div>
                        {/* <Button className='w-100 m-0' style={{background:'rgb(13,31,65)'}} onClick={this.handleSubmission}>Add your Wish</Button> */}
                        <Button className='w-100 m-0 border-0' style={{background:'rgb(179, 20, 22)'}} onClick={this.handleSubmission}>Add your Wish</Button>
                    </ModalFooter>
                </Modal>
                </Container>
            </Navbar>
        )
    }
}

export default Navigation
