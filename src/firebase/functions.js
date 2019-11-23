import {
    timestamp,
    db
} from './Firebase'

export const addToWishers = (name) => {
    db.collection('wishers').add({
        name,
        timestamp: timestamp()
    }).then(() => {
        console.log('Successfully added a new wisher to list!')
    }).catch((error) => {
        console.error('Error: ', error)
    })
}

export const createWisher = (name, title, description, link) => {
    addToWishers(name)
    db.collection(name).doc(title).set({
        name,
        title,
        description,
        link,
        checked: false,
        timestamp: timestamp()
    }).then(() => {
        console.log('Successfully created a new wisher!')
    }).catch((error) => {
        console.error('Error: ', error)
    })
}

export const addWish = (name, title, description, link) => {
    let query = db.collection(name).doc(title)
    query.set({
        name,
        title,
        description,
        link,
        checked: false,
        timestamp: timestamp()
    }).then(() => {
        console.log('Wish successfully uploaded!')
    }).catch((error) => {
        console.error('Error: ', error)
    })
}