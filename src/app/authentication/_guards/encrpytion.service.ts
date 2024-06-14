import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private readonly secretKey = 'my-secret-key'; // Use a more secure key in a real application

  constructor() { }

  private obfuscateKey(key: string): string {
    return btoa(key).split('').reverse().join('');
  }

  private deobfuscateKey(obfuscatedKey: string): string {
    return atob(obfuscatedKey.split('').reverse().join(''));
  }

  private encodeData(data: any): string {
    return btoa(JSON.stringify(data));
  }

  private decodeData(encodedData: string): any {
    return JSON.parse(atob(encodedData));
  }

  setItem(key: string, value: any): void {
    try {
      const obfuscatedKey = this.obfuscateKey(key);
      const encodedValue = this.encodeData(value);
      const encryptedValue = CryptoJS.AES.encrypt(encodedValue, this.secretKey).toString();
      localStorage.setItem(obfuscatedKey, encryptedValue);
    } catch (error) {
      console.error('Error setting item in localStorage', error);
    }
  }

  getItem(key: string): any {
    try {
      const obfuscatedKey = this.obfuscateKey(key);
      const storedValue = localStorage.getItem(obfuscatedKey);
      if (storedValue) {
        const bytes = CryptoJS.AES.decrypt(storedValue, this.secretKey);
        const encodedValue = bytes.toString(CryptoJS.enc.Utf8);
        return this.decodeData(encodedValue);
      }
      return null;
    } catch (error) {
      console.error('Error getting item from localStorage', error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      const obfuscatedKey = this.obfuscateKey(key);
      localStorage.removeItem(obfuscatedKey);
    } catch (error) {
      console.error('Error removing item from localStorage', error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }
}
