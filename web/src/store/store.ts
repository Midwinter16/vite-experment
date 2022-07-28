import {defineStore} from 'pinia'
import {Names} from './store-name'

export const storeHome = defineStore(Names.storeHome, {
  state: () => {
    return {
      chooseId: 0,
      operate: 'none',
    }
  },
})
