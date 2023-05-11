console.log("olo");

fetch("/todo")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
  });
