import firebase from 'firebase/compat/app'
import { Navigate } from 'react-router-dom'


function Logout() {
    firebase.auth().signOut()
    // check if not logged in before redirecting
    if (!firebase.auth().currentUser) {
        console.log('no user')
        return <Navigate to="/" />

    }
    return <div> Logging out...</div>

}

export default Logout;