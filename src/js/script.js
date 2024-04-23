// -------------------------------------------------- dom assignments

const home = document.querySelector(".home");
const loading = document.querySelector(".loading");
const count = document.querySelector(".shoppingCount");
const basketPage = document.querySelector(".basketPage");
const basketPageIcon = document.querySelector(".basketPageIcon");
const basketProducts = document.querySelector(".basketProducts");
const total = document.querySelector(".total");
const banner = document.querySelector(".banner");
const banner2 = document.querySelector(".banner2");
const footer = document.querySelector("footer");

// -------------------------------------------------- other assignments

const buyedProducts = {};
let totalAmount = 0;
let products = [];

// -------------------------------------------------- getting products

const getProducts = async () => {
  const url = "products.json";
  const response = await fetch(url);

  if (response.status != 200) return "";

  return response.json();
};

// -------------------------------------------------- other useful functions

const calculateBasketAmount = () => {
  for (const key in buyedProducts)
    totalAmount += +buyedProducts[key][1].price * +buyedProducts[key][0];

  total.textContent = totalAmount.toFixed(2);
  totalAmount = 0;
};

// -------------------------------------------------- upload products to the screen

getProducts().then((data) => {
  setTimeout(() => {
    products = data;

    let html = "";

    for (const product of products) {
      html += `<article class="shopCard">
  <figure>
    <img src="${product.url}" alt="${product.alt}" />
  </figure>
  <div class="cardInfo">
    <h1>${product.price} ₼</h1>
    <h2>${product.name}</h2>
    <p>${product.desc}</p>
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
    banner.style.display = "block";
    banner2.style.display = "block";
    footer.style.display = "flex";
    home.style.display = "grid";
  }, 1000);
});

// -------------------------------------------------- adding product to the basket

home.addEventListener("click", (e) => {
  if (e.target.className == "basketWrapper") {
    count.textContent++;

    const currentProduct =
      products[
        [
          ...e.target.parentElement.parentElement.parentElement.parentElement
            .children,
        ].indexOf(e.target.parentElement.parentElement.parentElement)
      ];
    console.log(currentProduct);
    buyedProducts[currentProduct.alt]
      ? buyedProducts[currentProduct.alt][0]++
      : (buyedProducts[currentProduct.alt] = [1, currentProduct]);
  }
});

// -------------------------------------------------- basket page

basketPageIcon.addEventListener("click", () => {
  calculateBasketAmount();

  basketPage.style.display = "block";

  let html = "";

  for (const key in buyedProducts) {
    html += `<div class="basketProduct">
    <div class="basketProductInfo">
    <figure>
      <img src="${buyedProducts[key][1].url}" alt="${buyedProducts[key][1].alt}" />
    </figure>
    <div>
      <h1>${buyedProducts[key][1].name}</h1>
      <p>${buyedProducts[key][1].nov}</p>
    </div>
</div>
    <h1>Ədəd : ${buyedProducts[key][0]}</h1>

    <h1>Qiymət : ${buyedProducts[key][1].price} ₼</h1>

    <i class="fa-solid fa-trash"></i>
  </div>`;
  }

  basketProducts.innerHTML = html;
});

basketPage.children[0].children[0].addEventListener("click", () => {
  basketPage.style.display = "none";
});

// -------------------------------------------------- delete products from basket

basketPage.addEventListener("click", (e) => {
  if (e.target.classList[1] == "fa-trash") {
    const currentProduct =
      e.target.parentElement.children[0].children[0].children[0].alt;

    if (buyedProducts[currentProduct][0] != 1) {
      buyedProducts[currentProduct][0]--;
      e.target.parentElement.children[1].children[0].textContent--;
      count.textContent--;
      total.textContent = (
        total.textContent - buyedProducts[currentProduct][1].price
      ).toFixed(2);
    } else {
      e.target.parentElement.remove();
      count.textContent--;
      buyedProducts[currentProduct][0]--;
      total.textContent = (
        total.textContent - buyedProducts[currentProduct][1].price
      ).toFixed(2);
      delete buyedProducts[currentProduct];
    }
  }
});
