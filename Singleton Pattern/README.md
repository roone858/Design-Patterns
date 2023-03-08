# Singleton Pattern
Share a single global instance throughout our application
- Singletons are classes which can be instantiated once, and can be accessed globally.
- This single instance can be shared throughout our application
  - which makes Singletons great for managing global state in an application.

First, let's take a look at what a singleton can look like using an ES2015 class. For this example, we're going to build a `Counter` class that has:
 ```javascript
 let counter = 0;
 
class Counter {
  getInstance() {
    return this;
  }
 
  getCount() {
    return counter;
  }
 
  increment() {
    return ++counter;
  }
 
  decrement() {
    return --counter;
  }
}
 ```
 A Singleton should only be able to get instantiated once. Currently, we can create multiple instances of the `Counter` class

 ```javascript
  
const counter1 = new Counter();
const counter2 = new Counter();
 
console.log(counter1.getInstance() === counter2.getInstance()); // false
 ```
 By calling the `new` method twice, we just set `counter1` and `counter2` equal to different instances.
 
  The values returned by the `getInstance` method on `counter1` and `counter2` effectively returned references to different instances: they aren't strictly equal!

**Let's make sure that only one instance of the Counter class can be created:**
1. creating a variable called `instance`
2. In the constructor of `Counter`, we can set `instance` equal to a reference to the instance when a new instance is created
3. We can prevent new instantiations by checking if the `instance` variable already had a value
4. If that's the case, an instance already exists. This shouldn't happen: an error should get thrown to let the user know .
```javascript
let instance;
let counter = 0;
 
class Counter {
  constructor() {
    if (instance) {
      throw new Error("You can only create one instance!");
    }
    instance = this;
  }
 
  getInstance() {
    return this;
  }
 
  getCount() {
    return counter;
  }
 
  increment() {
    return ++counter;
  }
 
  decrement() {
    return --counter;
  }
}
 
const counter1 = new Counter();
const counter2 = new Counter();
// Error: You can only create one instance!
```
Perfect! We aren't able to create multiple instances anymore.

**Let's export the `Counter` instance from the `counter.js` file.**
-  But before doing so
   -   we should freeze the instance as well.
   -  The `Object.freeze` method makes sure that consuming code cannot modify the Singleton.
   -   Properties on the frozen instance cannot be added or modified, which reduces the risk of accidentally overwriting the values on the Singleton.

```javascript
let instance;
let counter = 0;
 
class Counter {
  constructor() {
    if (instance) {
      throw new Error("You can only create one instance!");
    }
    instance = this;
  }
 
  getInstance() {
    return this;
  }
 
  getCount() {
    return counter;
  }
 
  increment() {
    return ++counter;
  }
 
  decrement() {
    return --counter;
  }
}
 
const singletonCounter = Object.freeze(new Counter());
export default singletonCounter;
```

Let's take a look at an application that implements the Counter [example](https://codesandbox.io/embed/lucid-morning-64mr1).

- When we invoke the increment method in either redButton.js or blueButton.js, the value of the counter property on the Counter instance updates in both files.
- the same value is shared among all instances 

---
## Tradeoffs
- Restricting the instantiation to just one instance could potentially **save a lot of memory** space
- Instead of having to set up memory for a new instance each time, we only have to set up memory for that **one instance** which is referenced throughout the application.
-  However, **Singletons are actually considered an anti-pattern**, and can (or.. should) be **avoided in JavaScript**.

## Using a regular object

```javascript
let count = 0;

const counter = {
  increment() {
    return ++count;
  },
  decrement() {
    return --count;
  }
};

Object.freeze(counter);
export { counter };

```

## Testing
Testing code that relies on a Singleton can get tricky Since :
 1. we can't create new instances each time
 2.  all tests rely on the modification to the global instance of the previous test.
 3.  The order of the tests matter in this case
 4.  and one small modification can lead to an entire test suite failing.

**Note:**  After testing, we need to reset the entire instance in order to reset the modifications made by the tests.

## Dependency hiding
When importing another module,

superCounter.js in this case, it may not be obvious that module is importing a Singleton.

In other files, such as index.js in this case, we may be importing that module and invoke its methods.

This way, we accidentally modify the values in the Singleton.
   
This can lead to unexpected behavior, since multiple instances of the Singleton can be shared throughout the application, which would all get modified as well.

  ```javascript
  import Counter from "./counter";

export default class SuperCounter {
  constructor() {
    this.count = 0;
  }

  increment() {
    Counter.increment();
    return (this.count += 100);
  }

  decrement() {
    Counter.decrement();
    return (this.count -= 100);
  }
}

  ```

 ## Global behavior
A Singleton instance should be able to get referenced throughout the entire app.

 Global variables essentially show the same behavior:
 -  since global variables are available on the global scope, we can access those variables throughout the application.


- Having global variables is generally considered as a bad design decision.
-  Global scope pollution can end up in accidentally overwriting the value of a global variable, which can lead to a lot of unexpected behavior.

**In ES2015, creating global variables is fairly uncommon.**
 The new `let` and `const` keyword **prevent developers from accidentally polluting the global scope** : 
 -  by keeping variables declared with these two keywords block-scoped.
 -   The new module system in JavaScript makes creating globally accessible values easier without polluting the global scope,
 -    by being able to export values from a module, and import those values in other files.

However, the common uncase for a Singleton is to have some sort of global state throughout your application.

 Having multiple parts of your codebase rely on the same mutable object can lead to unexpected behavior.

Usually, certain parts of the codebase modify the values within global state, whereas others consume that data.

 The order of execution here is important:
 1.  we don't want to accidentally consume data first, when there is no data to consume (yet)! 
 2.  Understanding the data flow when using a global state can get very tricky as your application grows, and dozens of components rely on each other