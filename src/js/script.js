// -------------------------------------------------- dom assignments

const home = document.querySelector(".home");
const loading = document.querySelector(".loading");
const count = document.querySelector(".shoppingCount");
const basketPage = document.querySelector(".basketPage");
const basketPageIcon = document.querySelector(".basketPageIcon");
const close = document.querySelector(".close");
const basketProducts = document.querySelector(".basketProducts");
const total = document.querySelector(".total");

// -------------------------------------------------- other assignments

const buyedProducts = {};
let totalAmount = 0;

// -------------------------------------------------- getting products

const getProducts = async () => {
  const url = "products.json";
  const response = await fetch(url);

  if (response.status != 200) return "";

  return response.json();
};

// -------------------------------------------------- display produtcs

getProducts().then((data) => {
  setTimeout(() => {
    const products = data;

    let html = "";

    for (let i = 0; i < products.length; i++) {
      html += `<article class="shopCard">
  <figure>
    <img src="${products[i].url}" alt="${products[i].alt}" />
  </figure>
  <div class="cardInfo">
    <h1>${products[i].price} ₼</h1>
    <h2>${products[i].name}</h2>
    <p>${products[i].desc}</p>
  </div>
  <div class="cardButtons">
  <button class="basket">
      <div class="basketWrapper"></div>
      Səbətə at <i class="fa-solid fa-cart-shopping shop"></i>
    </button>
    <i class="fa-regular fa-heart"></i>
  </div>
  </article>`;
    }

    home.innerHTML = html;

    loading.style.display = "none";
    home.style.display = "grid";
  }, 1000);
});

// -------------------------------------------------- increment basket count

home.addEventListener("click", (e) => {
  if (e.target.className == "basketWrapper") {
    count.textContent++;
    let currentProduct =
      e.target.parentElement.parentElement.parentElement.children[0].children[0]
        .alt;

    buyedProducts[currentProduct]
      ? buyedProducts[currentProduct][0]++
      : (buyedProducts[currentProduct] = [
          1,
          e.target.parentElement.parentElement.parentElement.children[1].children[0].textContent.split(
            " "
          )[0],
          e.target.parentElement.parentElement.parentElement.children[0].children[0].getAttribute(
            "src"
          ),
          e.target.parentElement.parentElement.parentElement.children[0].children[0].getAttribute(
            "alt"
          ),
        ]);
  }
});

// -------------------------------------------------- basket page

basketPageIcon.addEventListener("click", () => {
  for (const key in buyedProducts)
    totalAmount += +buyedProducts[key][1] * +buyedProducts[key][0];

  total.textContent = totalAmount.toFixed(2);
  totalAmount = 0;

  basketPage.style.display = "block";

  let html = "";

  for (const key in buyedProducts) {
    html += `<div class="basketProduct">
    <figure>
      <img src="${buyedProducts[key][2]}" alt="${buyedProducts[key][3]}" />
    </figure>
    <h1>Ədəd : <span>${buyedProducts[key][0]}</span> x <span>${buyedProducts[key][1]}</span> ₼</h1>
    <i class="fa-solid fa-trash"></i>
  </div>`;
  }

  basketProducts.innerHTML = html;
});

close.addEventListener("click", () => {
  basketPage.style.display = "none";
});

// -------------------------------------------------- basket page inner

basketPage.addEventListener("click", (e) => {
  if (e.target.classList[1] == "fa-trash") {
    const currentProduct = e.target.parentElement.children[0].children[0].alt;

    if (buyedProducts[currentProduct][0] != 1) {
      buyedProducts[currentProduct][0]--;
      e.target.parentElement.children[1].children[0].textContent--;
      count.textContent--;
      total.textContent = (
        total.textContent - buyedProducts[currentProduct][1]
      ).toFixed(2);
    } else {
      e.target.parentElement.remove();
      count.textContent--;
      buyedProducts[currentProduct][0]--;
      total.textContent = (
        total.textContent - buyedProducts[currentProduct][1]
      ).toFixed(2);
      delete buyedProducts[currentProduct];
    }
  }
  console.log(buyedProducts);
});
