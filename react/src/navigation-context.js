import {createContext} from 'react'

const NavigationContext = createContext((name, args) => console.log('navigateTo is uninitialized'))

export {NavigationContext}
