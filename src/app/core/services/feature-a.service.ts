import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeatureAService {
  counter = 0
  message = 'Hello from FeatureAService (scoped to its feature injector)!';
  constructor() {
    console.log(this.counter)
  }
}
