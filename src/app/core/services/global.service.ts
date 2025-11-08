import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  counter = 0
  message = 'test'
  constructor() {
    console.log(this.message)
  }
}
