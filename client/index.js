async function main() {
  let promise = await fetch("http://localhost:3000/api/v1/departments");
  const depts = await promise.json();

  depts.forEach((dept) => {
    departments.insertAdjacentHTML("beforebegin", `<div>${dept.name}<div/>`);
  });
}

main();
