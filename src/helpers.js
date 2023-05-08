import firebase from 'firebase/compat/app'

export function getUserId() {
    return firebase.auth().currentUser.uid;
}

export const request = ( url, params={}, method='GET' ) => {
    let options = {
        method: method
    };
    if ( 'GET' === method ) {
        url += '?' + ( new URLSearchParams( params ) ).toString();
    } else {
        options.body = JSON.stringify( params );
    }
    
    return fetch( url, options ).then((res) => res.json());
};
export const get =  ( url, params ) => { return request( url, params, 'GET' ) };
export const post = ( url, params ) => { return request( url, params, 'POST' )};