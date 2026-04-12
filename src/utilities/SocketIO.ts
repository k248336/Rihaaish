import {io as SocketIOClient} from 'socket.io-client';

const BASE_URL_SOCKET = 'https://api.vitalarchive.trangotechdevs.com';
// const BASE_URL_SOCKET = 'https://api.buildmaterentals.com';

const socket = SocketIOClient(BASE_URL_SOCKET, {
  transports: ['websocket'],
  /** Avoid connecting until chat is wired to your backend (saves battery without server). */
  autoConnect: false,
});

export const EVENTS = {
  Listeners: {
    ERROR: 'error_',
    NEW_ROOM: 'newRoom_',
    NEW_GROUP: 'newGroup_',
    NEW_THREAD: 'newThread_',
    FIND_CREATE_ROOM: 'findOrCreateRoom_',
    GET_CHAT_THREADS: 'getChatThreads_',
    GET_UNREAD_THREAD_COUNT: 'getUnreadThreadsCount_',
    LOAD_CHAT_HISTORY: 'loadChatHistory_',
    RECEIVED_MESSAGE: 'receivedMessage_',
    GET_GROUP_THREADS: 'getGroupThreads_',
    CREATE_GROUP: 'createGroup_',
    UPDATE_GROUP: 'updateGroupDetails_',
    ADD_NEW_MEMBER: 'newMemberAdded_',
    REMOVE_MEMBER: 'removeMember_',
    LEAVE_GROUP: 'leaveGroup_',
  },
  Emitters: {
    JOIN_ROOM: '_joinRoom',
    SEND_MESSAGE: '_sendMessage',
    GET_CHAT_THREADS: '_getChatThreads',
    LOAD_CHAT_HISTORY: '_loadChatHistory',
    FIND_CREATE_ROOM: '_findOrCreateRoom',
    RESET_MESSAGE_COUNT: '_resetMessageCount',
    GET_UNREAD_THREAD_COUNT: '_getUnreadThreadsCount',
    DELETE_CHAT_MESSAGE: '_deleteChatMessage',
    DELETE_CHAT_THREAD: '_deleteChatThread',
    GET_GROUP_THREADS: '_getGroupThreads',
    CREATE_GROUP: '_createGroup',
    UPDATE_GROUP: '_updateGroupDetails',
    ADD_NEW_MEMBER: '_addMember',
    REMOVE_MEMBER: '_removeMember',
    LEAVE_GROUP: '_leaveGroup',
  },
};

class SocketIO {
  connectToSocket = (api_token: string) => {
    socket.io.opts.query = {
      authorization: api_token,
    };
    socket.connect();
    socket.on('connect', () => {
      console.log('connected to socket server');
    });
    socket.on('connect_error', res => {
      console.log('error connecting socket: ', JSON.stringify(res));
    });
  };

  emit = (eventName: string, params: any, onSuccess?: (res: any) => void) => {
    socket.emit(eventName, params, (res: any) => {
      // console.log(`${eventName} response: `, JSON.stringify(res));
      onSuccess && onSuccess(res);
    });
  };

  listen = (eventName: string, onSuccess?: (res: any) => void) => {
    socket.on(eventName, (res: any) => {
      // console.log(`${eventName} response: `, JSON.stringify(res));
      onSuccess && onSuccess(res);
    });
  };

  dispose = (eventName: string) => {
    socket.off(eventName);
  };

  disconnect = () => {
    socket.disconnect();
  };
}

export default new SocketIO();
