import { Client } from 'pg';
import { getDBClientOptions } from './getDBClientOptions';

export default class DBClientManager {
  private client: Client;
  private static instance;

  private constructor() {
    this.client = null;
  }

  static getInstance() {
    if (!DBClientManager.instance) {
      DBClientManager.instance = new DBClientManager();
    }
    return DBClientManager.instance;
  }

  getClient(): Client {
    if (!this.client) {
      throw new Error('Please connect.');
    }
    return this.client;
  }

  async connect() {
    this.client = new Client(getDBClientOptions());
    await this.client.connect();
  }

  async disconnect() {
    if (!this.client) {
      return;
    }

    await this.client.end();
    this.client = null;
  }
}
