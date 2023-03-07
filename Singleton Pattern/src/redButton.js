import Counter from "./counter";

document.getElementById("red").addEventListener("click", () => {
  const counter = Counter.decrement();
  console.log(counter)
});
