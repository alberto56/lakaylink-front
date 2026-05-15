class ProductsPage {
  constructor() {
    this.api = new ProductsApi();
  }
  getProductSections() {
    let ret = [];
    document.querySelectorAll('.my-fetch-products').forEach((element) => {
      /* Perform actions on each element */
      ret.push(new ProductsSection(element, this.api));
    });
    return ret;
  }
}
