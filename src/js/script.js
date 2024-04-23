const home = document.querySelector(".home");
const loading = document.querySelector(".loading");
const count = document.querySelector(".shoppingCount");

const getProducts = async () => {
  const url = "/projects/shoppingBasket/src/js/products.json";
  const response = await fetch(url);

  if (response.status != 200) return "";

  return response.json();
};

getProducts().then((data) => {
  setTimeout(() => {
    const products = data;

    let html = "";

    for (let i = 0; i < products.length; i++) {
      html += `<article class="shopCard">
  <figure>
    <img src="${products[i].url}" alt="" />
  </figure>
  <div class="cardInfo">
    <h1>${products[i].price}</h1>
    <h2>${products[i].name}</h2>
    <p>${products[i].desc}</p>
  </div>
  <div class="cardButtons">
    <button class="basket">Səbətə at <i class="fa-solid fa-cart-shopping shop"></i></button>
    <i class="fa-regular fa-heart"></i>
  </div>
  </article>`;
    }

    home.innerHTML = html;

    loading.style.display = "none";
    home.style.display = "grid";
  }, 1000);
});

home.addEventListener("click", (e) => {
  if (
    e.target.className == "basket" ||
    [...e.target.classList].includes("shop")
  )
    count.textContent++;
});
