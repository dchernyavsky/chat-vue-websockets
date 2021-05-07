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
          date: '2020-07-12T13:51:50.417Z',
        },
        {
          name: 'name2',
          message: 'message2',
          isOwn: false,
          date: '2020-07-12T13:53:50.417Z',
        },
        {
          name: 'name3',
          message: 'message3',
          isOwn: true,
          date: '2020-07-13T13:58:50.417Z',
        },
      ],
    }
  },
  mounted() {
    console.log('mounted')
    this.createChannel()
    this.scrollChatToBottom()
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
      console.log(e.data)
      const newMessage = JSON.parse(e.data)
      this.messages.push({ ...newMessage, isOwn: false, date: new Date().toJSON() })
      this.scrollChatToBottom()
      this.messages = this.cropMessages(this.messages, this.maxMessagesCount)
    },

    errorHandler() {
      console.error('ws channel error')
    },

    closeChannel() {
      if (this.ws) {
        this.ws.removeEventListener('message', this.messageHandler)
        this.ws.removeEventListener('open', this.openHandler)
        this.ws.removeEventListener('error', this.errorHandler)
        this.ws.removeEventListener('close', this.closeHandler)
        this.ws.close()
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
      const newMessage = {
        name: this.MY_NAME,
        message: this.inputMessageValue,
      }
      this.ws?.send(JSON.stringify(newMessage))
      this.messages.push({ ...newMessage, isOwn: true, date: new Date().toJSON() })
      this.scrollChatToBottom()
      this.messages = this.cropMessages(this.messages, this.maxMessagesCount)
      this.inputMessageValue = ''
    },

    scrollChatToBottom() {
      setTimeout(() => {
        const chatBoxMessages = this.$el.querySelector('.chat-box__messages')
        chatBoxMessages.scrollTop = chatBoxMessages.scrollHeight
      }, 200)
    },

    cropMessages(messages, maxMessagesCount) {
      return messages.filter((m, index, array) => index >= array.length - maxMessagesCount)
    },

    getChatBoxMessageClassName(firstName, secondName, isAddSecondName) {
      return firstName + ' ' + (isAddSecondName && secondName)
    },

    getDate(date) {
      return new Date(date).toLocaleDateString('ru', { day: 'numeric', month: 'long' })
    },

    getTime(date) {
      return new Date(date).toLocaleDateString('ru', { hour: 'numeric', minute: 'numeric' }).split(',')[1]
    },

    isShowDate(index) {
      if (index === 0) {
        return true
      } else {
        return !(this.getDate(this.messages[index].date) === this.getDate(this.messages[index - 1].date))
      }
    },
  },
  template: `
   <div class="chat-box">
    <!-- chat-box__header -->
    <div class="chat-box__header">
      <a href="#" class="back"><i class="icon icon-left"></i></a>
      <h1 class="main-title">Добро пожаловать в онлаин-чат службы поддержки</h1>
      <div style="width: 12px" class=""></div>
    </div>
    <!-- /chat-box__header -->
    <!-- chat-box__messages -->
    <div class="chat-box__messages" style="height: 60vh; overflow: auto; scroll-behavior: smooth">
    <div v-for="(mess, index) in messages" :key="mess.date">
    <div v-if="isShowDate(index)" class="chat-box__separator">{{ getDate(mess.date) }}</div>
        <div :class="getChatBoxMessageClassName('chat-box__message', 'own', mess.isOwn)">
          <div class="name">{{ mess.name }}</div>
          <div class="message">
            {{ mess.message }}
            <div class="time">{{ getTime(mess.date) }}</div>
            <div class="clear"></div>
          </div>
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <!-- /chat-box__messages -->
    <!-- chat-box__form -->
    <div class="chat-box__form main-form">
      <textarea v-model="inputMessageValue" class="input-style" rows="7"></textarea>
      <div class="row">
        <label class="main-form__item file-field"> </label>
        <div class="main-form__submit">
          <button class="radius-button standart rounded" @click="sendMessage">Отправить</button>
        </div>
      </div>
    </div>
    <!-- /chat-box__form -->
  </div>
  `,
}

Vue.createApp(AppChat).mount('#app-chat')
