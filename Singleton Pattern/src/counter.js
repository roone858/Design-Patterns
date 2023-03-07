let instance;
let counter = 0;
class Counter {
  getInstance() {
    return this;
  }
  getCount() {
    return counter;
  }
  increment(){
     return ++counter
  }
  decrement(){
     return --counter
  }
}

const count = Object.freeze(new Counter());

export default count ;
