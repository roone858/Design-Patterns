import Counter from "./counter";

document.getElementById("blue").addEventListener("click", () => {
  const counter = Counter.increment();
  console.log(counter)
});
