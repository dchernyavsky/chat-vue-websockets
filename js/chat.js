const AppChat = {
  data() {
    return {
      HOST: 'ws://skade.cc',
      PORT: '38080',
      MY_NAME: 'My Name',
      ws: null,
      inputMessageValue: '',
      maxMessagesCount: 5,
      messages: [
        {
          name: 'name1',
          message: 'message1',
          isOwn: false,
          time: '13:05',
        },
        {
          name: 'name2',
          message: 'message2',
          isOwn: false,
          time: '13:06',
        },
        {
          name: 'name3',
          message: 'message3',
          isOwn: true,
          time: '13:09',
        },
      ],
    }
  },
  mounted() {
    console.log('mounted')
    this.createChannel()
  },
  beforeUnmount() {
    console.log('beforeUnmount')
    this.closeChannel()
  },
  methods: {
    openHandler() {
      console.log('ws channel opened')
    },

    closeHandler() {
      console.log('ws channel closed')
      setTimeout(this.createChannel, 5000)
    },

    messageHandler(e) {
      const d = new Date()
      console.log(e.data)
      const newMessage = JSON.parse(e.data)
      this.messages.push({ ...newMessage, isOwn: false, time: d.getHours() + ':' + d.getMinutes() })
      this.messages = this.cropMessages(this.messages, this.maxMessagesCount)
    },

    errorHandler() {
      console.error('ws channel error')
    },

    closeChannel() {
      if (this.ws) {
        this.ws?.removeEventListener('message', this.messageHandler)
        this.ws?.removeEventListener('open', this.openHandler)
        this.ws?.removeEventListener('error', this.errorHandler)
        this.ws?.removeEventListener('close', this.closeHandler)
        this.ws?.close()
      }
    },

    createChannel() {
      this.closeChannel()

      console.log('creating new ws channel...')
      this.ws = new WebSocket(`${this.HOST}:${this.PORT}`)
      this.ws.addEventListener('message', this.messageHandler)
      this.ws.addEventListener('open', this.openHandler)
      this.ws.addEventListener('error', this.errorHandler)
      this.ws.addEventListener('close', this.closeHandler)
    },

    sendMessage(e) {
      const d = new Date()
      const newMessage = {
        name: this.MY_NAME,
        message: this.inputMessageValue,
      }
      this.ws?.send(JSON.stringify(newMessage))
      this.messages.push({ ...newMessage, isOwn: true, time: d.getHours() + ':' + d.getMinutes() })
      this.inputMessageValue = ''
      console.log('messages', this.messages)
      this.messages = this.cropMessages(this.messages, this.maxMessagesCount)
    },

    cropMessages(messages, maxMessagesCount) {
      return messages.filter((m, index, array) => index >= array.length - maxMessagesCount)
    },

    getChatBoxMessageClassName(firstName, secondName, isAddSecondName) {
      return firstName + ' ' + (isAddSecondName && secondName)
    },
  },
}

Vue.createApp(AppChat).mount('#app-chat')
