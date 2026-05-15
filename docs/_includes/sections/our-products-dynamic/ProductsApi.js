class ProductsApi {
  constructor() {
    this.productsFactory = new ProductsFactory();
  }
  async fetchProducts(source) {
    try {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const products = await response.json();
      return this.productsFactory.fromJson(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
}
