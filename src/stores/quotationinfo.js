import { defineStore } from 'pinia';

export const usequoStore = defineStore({
  id:'quotationinfo',
  state: () => ({
    quopol: '',
    quodes: '',
    dialogadd: false
  }),
  actions: {
    setAddPol(value) {
      this.quopol = value;
    },
    setAddDes(value) {
      this.quodes = value;
    },
    
  }
});

export default usequoStore