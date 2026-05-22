(function($) {
    $.fn.loadProducts = function(options) {
      const settings = $.extend({
        genericImage: "/img/product-placeholder.png"
      }, options);
  
      const container = this;

      async function fetchProducts(apiUrl) {
        try {
          const response = await fetch(apiUrl);
          const json = await response.json();
          const products = json.data || [];
          const included = json.included || [];
  
          container.empty(); // clear previous content
  
          products.forEach((product, index) => {
            const title = product.attributes.title || "No Title";
  
            // Get the default variation id
            const variationRef = product.relationships?.variations?.data?.[0];
            let price = "Price not available";

            let image = settings.genericImage;

            if (variationRef) {
              // Find the variation object in the included array
              const variation = included.find(
                inc => inc.type === variationRef.type && inc.id === variationRef.id
              );
  
              if (variation && variation.attributes?.price) {
                const p = variation.attributes.price;
                price = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: p.currency_code
                }).format(parseFloat(p.number));
              }

              // ---------------- IMAGE ----------------
              const imageRef = variation?.relationships?.field_image?.data;

              if (imageRef) {
                // Find the image file entity in included
                const imageFile = included.find(
                  inc => inc.type === imageRef.type && inc.id === imageRef.id
                );

                // Drupal JSON:API file URL
                if (imageFile?.attributes?.uri?.url) {
                  image = imageFile.attributes.uri.url;
                }
              }
            }

            const apiBase = window.location.origin;
            image = apiBase + image;

            const col = $(`
              <div class="col-md-6 col-lg-4 col-xl-3">
                <div class="product-item rounded wow fadeInUp" data-wow-delay="${0.1 * index}s">
                  <div class="product-item-inner border rounded">
                    <div class="product-item-inner-item">
                      <img src="${image}" class="img-fluid w-100 rounded-top" alt="${title}">
                      <div class="product-details">
                        <a href="#"><i class="fa fa-eye fa-1x"></i></a>
                      </div>
                    </div>
                    <div class="text-center rounded-bottom p-4">
                      <a href="#" class="d-block mb-2">${title}</a>
                      <a href="#" class="d-block h4">${title}</a>
                      <span class="text-primary fs-5">${price}</span>
                    </div>
                  </div>
                  <div class="product-item-add border border-top-0 rounded-bottom text-center p-4 pt-0">
                    <a href="#" class="btn btn-primary border-secondary rounded-pill py-2 px-4 mb-4">
                      <i class="fas fa-shopping-cart me-2"></i> Add To Cart
                    </a>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="d-flex"></div>
                      <div class="d-flex"></div>
                    </div>
                  </div>
                </div>
              </div>
            `);
  
            container.append(col);
          });
        } catch (error) {
          console.error("Error fetching products:", error);
          container.html("<p>Failed to load products.</p>");
        }
      }
  
      // Automatically detect data-source attribute if present
      const apiUrl = container.data("source") || settings.apiUrl;
      if (apiUrl) fetchProducts(apiUrl);
  
      return this; // allow chaining
    };
  })(jQuery);
  
  // Initialize all dynamic product sections automatically
  $(document).ready(function() {
    $(".all-products-dynamic").each(function() {
      $(this).loadProducts();
    });
  });