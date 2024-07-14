import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFlagStore = defineStore('store', {
  state: () => {
    return {
      BackgroundColor: '#fff',
    }
  },
})
