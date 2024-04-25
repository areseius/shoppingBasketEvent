// -------------------------------------------------- dom assignments

const home = document.querySelector(".home");
const loading = document.querySelector(".loading");
const count = document.querySelector(".shoppingCount");
const basketPage = document.querySelector(".basketPage");
const basketPageIcon = document.querySelector(".basketPageIcon");
const basketProducts = document.querySelector(".basketProducts");
const total = document.querySelector(".total");
const banner = document.querySelector(".banner");
const footer = document.querySelector("footer");
const sign = document.querySelector(".sign");
const clearBasket = document.querySelector(".clearBasket");
const inputText = document.querySelector(".inputText");
const filterButtons = document.querySelectorAll("[data-filter-name]");

// -------------------------------------------------- other assignments

let buyedProducts = {};
let totalAmount = 0;
let products = [];
let usefulProductsForm = [];

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

const checkBasketIsEmpty = (products) => {
  if (Object.keys(products).length) {
    clearBasket.classList.remove("disabled");
    clearBasket.removeAttribute("disabled");
  } else {
    clearBasket.classList.add("disabled");
    clearBasket.setAttribute("disabled", "true");
  }
};

const buildBasketProductİtem = (product) => `<div class="basketProduct">
    <div class="basketProductInfo">
    <figure>
      <img src="${product[1].url}" alt="${product[1].alt}" />
    </figure>
    <div>
      <h1>${product[1].name}</h1>
      <p>${product[1].nov}</p>
    </div>
</div>
    <h1>Ədəd : <span>${product[0]}</span></h1>

    <h1>Qiymət : ${product[1].price} ₼</h1>

    <i class="fa-solid fa-trash"></i>
  </div>`;

const buildProductItem = (product, i) =>
  `<article class="shopCard" data-product-nov="${
    product.nov == "Meyvə" ? "terevez" : "meyve"
  }">
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
      <div class="basketWrapper" data-product-id="${i}"></div>
      Səbətə at <i class="fa-solid fa-cart-shopping shop"></i>
    </button>
    <i class="fa-regular fa-heart"></i>
  </div>
  </article>`;
// -------------------------------------------------- upload products to the screen

getProducts().then((data) => {
  setTimeout(() => {
    products = data;

    let html = "";

    for (let i = 0; i < products.length; i++)
      html += buildProductItem(products[i], i);

    home.innerHTML = html;

    [...home.children].forEach((x) => {
      usefulProductsForm.push({
        productNameEng: x.children[0].children[0].alt,
        productNameAze: x.children[1].children[1].textContent,
        element: x,
      });
    });

    loading.style.display = "none";
    banner.style.display = "block";

    footer.style.display = "flex";
    home.style.display = "grid";
    sign.style.display = "block";
  }, 1000);
});

// -------------------------------------------------- adding product to the basket

home.addEventListener("click", (e) => {
  if (e.target.className == "basketWrapper") {
    count.textContent++;

    const currentProduct = products[+e.target.dataset.productId];

    buyedProducts[currentProduct.alt]
      ? buyedProducts[currentProduct.alt][0]++
      : (buyedProducts[currentProduct.alt] = [1, currentProduct]);
  }
});

// -------------------------------------------------- basket page

basketPageIcon.addEventListener("click", () => {
  calculateBasketAmount();

  checkBasketIsEmpty(buyedProducts);

  basketPage.style.display = "block";

  let html = "";

  for (const key in buyedProducts)
    html += buildBasketProductİtem(buyedProducts[key]);

  basketProducts.innerHTML = html;
});

basketPage.children[0].children[0].addEventListener("click", () => {
  basketPage.style.display = "none";
});

// -------------------------------------------------- delete products from basket

basketPage.addEventListener("click", (e) => {
  if (e.target.classList[1] == "fa-trash") {
    let [currentProduct, quantity] = [
      e.target.parentElement.children[0].children[0].children[0].alt,
      e.target.parentElement.children[1].children[0],
    ];

    if (buyedProducts[currentProduct][0] != 1) {
      buyedProducts[currentProduct][0]--;

      quantity.textContent--;
      count.textContent--;

      total.textContent = (
        total.textContent - buyedProducts[currentProduct][1].price
      ).toFixed(2);
    } else {
      e.target.parentElement.remove();
      count.textContent--;
      total.textContent = (
        total.textContent - buyedProducts[currentProduct][1].price
      ).toFixed(2);
      delete buyedProducts[currentProduct];
    }
    checkBasketIsEmpty(buyedProducts);
  }
});

// -------------------------------------------------- clear basket

clearBasket.addEventListener("click", () => {
  if (confirm("Səbət təmizləmək istədiyinizə əminsiniz ?")) {
    buyedProducts = {};
    basketProducts.innerHTML = "";
    count.textContent = 0;
    total.textContent = "0.00";
    checkBasketIsEmpty(buyedProducts);
  }
});

// -------------------------------------------------- search products

inputText.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  usefulProductsForm.forEach((product) => {
    const isVisible =
      product.productNameEng.toLowerCase().includes(value) ||
      product.productNameAze.toLowerCase().includes(value);

    product.element.classList.toggle("hide", !isVisible);
  });
});

// -------------------------------------------------- filter buttons

filterButtons.forEach((x) => {
  x.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    x.classList.add("active");

    usefulProductsForm.forEach((product) => {
      if (product.element.dataset.productNov == x.dataset.filterName)
        product.element.classList.add("hide");
      else product.element.classList.remove("hide");
    });
  });
});
