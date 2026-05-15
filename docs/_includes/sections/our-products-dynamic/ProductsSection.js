class ProductsSection {
  constructor(element, api) {
    this.element = element;
    this.api = api;
  }
  dataSource() {
    const dataSource = this.element.getAttribute('data-source');
    if (!dataSource) {
      console.error('Data source not specified for products section.');
      return;
    }
    return dataSource;
  }
  fetchAndDisplayProducts() {
    this.api.fetchProducts(
      this.dataSource(),
    ).then((products) => {
      console.log(products);
    }).catch((error) => {
      console.error('Error fetching products:', error);
    });
  }
}
