# Proxy Pattern
Intercept and control interactions to target objects
- With a Proxy object, we get more control over the interactions with certain objects
-  A proxy object can determine the behavior whenever we're interacting with the object, for example when we're getting a value, or setting a value.

Generally speaking, a proxy means a stand-in for someone else. Instead of speaking to that person directly, you'll speak to the proxy person who will represent the person you were trying to reach. The same happens in JavaScript: instead of interacting with the target object directly, we'll interact with the Proxy object.

Let's create a person object, that represents John Doe.

```javascript
const person = {
  name: "John Doe",
  age: 42,
  nationality: "American",
};
```
- **Instead of** interacting with this **object directly**, we want to interact with **a proxy object**.
- JavaScript, we can easily create a new proxy by creating a new instance of `Proxy`:
```javascript
const person = {
  name: "John Doe",
  age: 42,
  nationality: "American",
};
 
const personProxy = new Proxy(person, {});
```
The second argument of Proxy is an object that represents the `handler`.
In the handler object, we can :
- define specific behavior based on the type of interaction
- Although there are many methods that you can add to the Proxy handler, the two most common ones are `get` and `set`:
  -    `get`: Gets invoked when trying to **access** a property
  -    `set`: Gets invoked when trying to **modify** a property

Instead of interacting with the person object directly, we'll be interacting with the personProxy.

### Let's add handlers to the personProxy Proxy

- When trying to **modify a property**, thus invoking the `set` method on the `Proxy`, we want the proxy to log the previous value and the new value of the property
- When trying to **access a property**, thus invoking the `get` method on the `Proxy`, we want the proxy to log a more readable sentence that contains the key and value of the property. 
```javascript
const personProxy = new Proxy(person, {
  get: (obj, prop) => {
    console.log(`The value of ${prop} is ${obj[prop]}`);
  },
  set: (obj, prop, value) => {
    console.log(`Changed ${prop} from ${obj[prop]} to ${value}`);
    obj[prop] = value;
  },
});
```

### A proxy can be useful to add validation

A user shouldn't be able to change person's age to a string value, or give them an empty name
Or if the user is trying to access a property on the object that doesn't exist, we should let the user know.

```javascript
const personProxy = new Proxy(person, {
  get: (obj, prop) => {
    if (!obj[prop]) {
      console.log(
        `Hmm.. this property doesn't seem to exist on the target object`
      );
    } else {
      console.log(`The value of ${prop} is ${obj[prop]}`);
    }
  },
  set: (obj, prop, value) => {
    if (prop === "age" && typeof value !== "number") {
      console.log(`Sorry, you can only pass numeric values for age.`);
    } else if (prop === "name" && value.length < 2) {
      console.log(`You need to provide a valid name.`);
    } else {
      console.log(`Changed ${prop} from ${obj[prop]} to ${value}.`);
      obj[prop] = value;
    }
  },
});
```

---
## Reflect
JavaScript provides a built-in object called `Reflect` ,
- which makes it easier for us to manipulate the target object when working with proxies.

directly getting or setting the values with bracket notation. Instead, we can use the Reflect object. 

we can **access** or **modify** properties on the target object through `Reflect.get()` and `Reflect.set()`.

 The methods receive the same arguments as the methods on the `handler` object.

 ```javascript
const personProxy = new Proxy(person, {
  get: (obj, prop) => {
    console.log(`The value of ${prop} is ${Reflect.get(obj, prop)}`);
  },
  set: (obj, prop, value) => {
    console.log(`Changed ${prop} from ${obj[prop]} to ${value}`);
    Reflect.set(obj, prop, value);
  },
});
 ```

 ## Tradeoffs
 - Proxies are a powerful way to add control over the behavior of an object.
 - A proxy can have various use-cases:
   -  it can help with **validation**, **formatting**, **notifications**, or **debugging**.

Overusing the Proxy object or performing heavy operations on each handler method invocation can easily affect the performance of your application negatively.

**It's best to not use proxies for performance-critical code.**