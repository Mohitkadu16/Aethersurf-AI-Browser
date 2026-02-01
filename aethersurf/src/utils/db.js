// IndexedDB wrapper for conversation storage
const DB_NAME = 'AetherSurfDB';
const DB_VERSION = 1;
const STORE_NAME = 'conversations';

class ConversationDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          objectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          objectStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });
  }

  async createConversation(query, model, modelName) {
    const conversation = {
      id: this.generateId(),
      title: query.substring(0, 50) + (query.length > 50 ? '...' : ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      model: model,
      modelName: modelName,
      messages: []
    };

    const transaction = this.db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    await store.add(conversation);
    
    return conversation;
  }

  async getConversation(id) {
    const transaction = this.db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllConversations() {
    const transaction = this.db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('updatedAt');
    
    return new Promise((resolve, reject) => {
      const request = index.openCursor(null, 'prev'); // Most recent first
      const conversations = [];
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          conversations.push(cursor.value);
          cursor.continue();
        } else {
          resolve(conversations);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async updateConversation(id, updates) {
    const conversation = await this.getConversation(id);
    if (!conversation) throw new Error('Conversation not found');

    const updated = {
      ...conversation,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    const transaction = this.db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.put(updated);
      request.onsuccess = () => resolve(updated);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteConversation(id) {
    const transaction = this.db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async addMessage(conversationId, message) {
    const conversation = await this.getConversation(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    const newMessage = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      ...message
    };

    conversation.messages.push(newMessage);
    return await this.updateConversation(conversationId, { messages: conversation.messages });
  }

  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
const conversationDB = new ConversationDB();
export default conversationDB;
