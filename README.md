[![GitHub Actions](https://github.com/alberto56/lakaylink/actions/workflows/config.yml/badge.svg)](https://github.com/alberto56/lakaylink/actions/workflows/config.yml)

Lakay Link Frontend
=====

Lakay Link is a service which allows expats to purchase goods for their families back home. We think that in certain cases this is a good alternative to sending money directly because the sender might want to control what is purchased.

Personas
-----

* **administrators** have full access to the Drupal site through an administrator account (they can log in with Google, or through `drush uli`, or however they want).
* **sellers** are groups working in target countries who have the capacity to deliver goods to addresses. A manager has a account with a seller role on the Drupal site, the manager also has access to put images on the web, often on a GitHub repo, and periodically manages their offerings on a Google Sheet spreadsheet. Sellers can coordinate with administrators through WhatsApp.
* **expats** use the site to pay for their families back home to receive goods.
* **families** receive the goods

Technical setup
-----

* WhatsApp is used to communicate between different personas
* Google Sheets is used to maintain products for a store
* GitHub (this repo) is used to store images for products
* The frontend site (https://github.com/alberto56/lakaylink-front, this repo, http://lakaylink-front.dcycleproject.org)
* The backend site (https://github.com/alberto56/lakaylink, https://lakaybeta.dcycleproject.org)

Typical usage scenario
-----

* 1. Outside of this Drupal site, the **amdministrator** maintains a **Google Sheet template** at https://docs.google.com/spreadsheets/d/12x-ANhpnkr_QO8QmXhWKdoCUA-qMRaxDh0wT-yLSqAI/.
* 2. Outside of this Drupal site, the **Google Sheet template** is available to the world in read-only mode: if you open an incognito window in Chrome, you can see its contents (view only).
* 3. Outside of this Drupal site, the **Google Sheet template** is available in write mode to administrators.
* 4. [to fix in https://github.com/alberto56/lakaylink-front/issues/4] Outside of this Drupal site, the **Google Sheet** contains mock products, and each product contains, in the image_url column, an image associated with the product. The image URL should be visible to the world.
* 5. Outside of the Drupal site, an **administrator** selects a **seller** in Haiti who will use the system.
* 6. Outside of the Drupal site, the **administrator** makes a copy of the **Google Sheet template**, called the **Seller Google Sheet**, and provides access and training to the **Seller** on how to fill this in. (For images specifically, sellers typically have a GitHub account and add images of their products to https://github.com/alberto56/lakaylink-front/tree/master/docs/media/products, then that product image is publicly available via GitHub pages, and that URL is placed in the image_url column of the **Seller Google Sheet**). For example, https://github.com/alberto56/lakaylink-front/blob/master/docs/media/products/farinebongu.jpeg is available on http://lakaylink-front.dcycleproject.org/media/products/farinebongu.jpeg, and http://lakaylink-front.dcycleproject.org/media/products/farinebongu.jpeg is put into the image_url column of the **seller Google Sheet**.
* 7. The **seller** goes to https://lakaybeta.dcycleproject.org/ and logs in using Google login.
* 7.01 The **seller** sees a login screen which says "continue as seller" or "continue as buyer".
* 7.02 The **seller** see "Ask an administrator to provide seller access and associate you with at least one store."
* 7.03 Outside of this Drupal site, the **seller** tells the **administrator** that they want their account to associated with a store.
* 7.1. The **administrator** logs in to the Drupal site https://lakaybeta.dcycleproject.org using an account with the "administrator" role
* 7.11. The **administrator** goes to https://lakaybeta.dcycleproject.org/store/add/online
* 7.12. The **administrator** fills in the info for a new store:
 * 7.12.1. Name
 * 7.12.2. Default currency
 * 7.12.3. Language
 * 7.12.4. Timezone
 * 7.12.5. Address
 * 7.12.6. Google Sheet URL according to the description which states, for "Google Sheet URL in CSV format", "example: https://docs.google.com/spreadsheets/d/e/2PACX-1vTDycRpyA4c8vOqriTxOSq36H6M6c0YoMKY-K540m783-gI8vghZvXKSo_lEvkHJRlCBsG5FrF15oBo/pub?output=csv or https://docs.google.com/spreadsheets/d/12x-ANhpnkr_QO8QmXhWKdoCUA-qMRaxDh0wT-yLSqAI/export?format=csv&gid=446996421"
 * 7.12.7. The Google Sheet Tab GID according to the description which sattes, for "Google Sheet Tab GID", "example: 0 or 446996421 (the gid= part of the URL)"
 * 7.12.8. Save
* 7.13. The **administrator** now sees the store at an URL which looks like https://lakaybeta.dcycleproject.org/store/3/edit
* 7.14. The **administrator** can click on a tab which says "Import status"
* 7.15. The import status page will show something like:

    The Google sheet URL and GID (https://docs.google.com/spreadsheets/d/12x-ANhpnkr_QO8QmXhWKdoCUA-qMRaxDh0wT-yLSqAI/export?format=csv&gid=446996421) are invalid. Here is the error message: .......

    Last import: never

or...

    The Google sheet URL and GID (https://docs.google.com/spreadsheets/d/12x-ANhpnkr_QO8QmXhWKdoCUA-qMRaxDh0wT-yLSqAI/export?format=csv&gid=446996421) are valid.

    Last import: (date and time). 3 days ago.

    5 products imported

    To import you must run "drush ev....."

About the theme
-----

The theme comes from <https://themewagon.com/themes/electro-bootstrap/> under the [Theme Wagon License](https://themewagon.com/license/).
