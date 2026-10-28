---
---

function convertCurrencyPrices() {
    'use strict';

    // Run only once per page.
    if (window.currencyConverterInitialized) {
      return;
    }

    window.currencyConverterInitialized = true;

    const apiBase = "{{ site.data.site.api_base_url }}";

    fetch(apiBase + '/api/get-ip-to-currency-rate?SIMULATE-IP=176.31.84.249', {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Accept: 'application/json'
      }
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Currency API request failed');
        }

        return response.json();
      })
      .then(function (data) {
        const currency = String(
          data['client-currency'] || 'USD'
        ).toUpperCase();

        const rates = data.rates || {};

        // USD visitors see the original prices.
        if (currency === 'USD') {
          return;
        }

        // Only support EUR and CAD.
        if (!['EUR', 'CAD'].includes(currency)) {
          return;
        }

        const rateKey = 'usd-' + currency.toLowerCase();
        const rate = Number(rates[rateKey]);

        // Do not convert without a valid exchange rate.
        if (!Number.isFinite(rate) || rate <= 0) {
          console.warn('Missing exchange rate:', rateKey);
          return;
        }

        const formatCurrency = function (amount, code) {
          return new Intl.NumberFormat(
            code === 'EUR' ? 'de-DE' : 'en-CA',
            {
              style: 'currency',
              currency: code,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }
          ).format(amount);
        };

        // Match standalone USD prices, e.g. $99, $1,299.99.
        const priceRegex = /^\s*\$\s*([\d,]+(?:\.\d{1,2})?)\s*$/;

        // Find matching text nodes without modifying Liquid templates.
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: function (node) {
              const parent = node.parentElement;

              if (!parent) {
                return NodeFilter.FILTER_REJECT;
              }

              // Skip scripts, styles, form fields and existing notes.
              if (
                parent.closest(
                  'script, style, noscript, textarea, input, select, ' +
                  '[contenteditable="true"], .currency-usd-note'
                )
              ) {
                return NodeFilter.FILTER_REJECT;
              }

              return priceRegex.test(node.nodeValue)
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT;
            }
          }
        );

        // Collect nodes before changing the DOM.
        const priceNodes = [];

        while (walker.nextNode()) {
          priceNodes.push(walker.currentNode);
        }

        priceNodes.forEach(function (node) {
          const match = node.nodeValue.match(priceRegex);

          if (!match || !node.parentNode) {
            return;
          }

          const usdAmount = Number(
            match[1].replace(/,/g, '')
          );

          if (!Number.isFinite(usdAmount)) {
            return;
          }

          const convertedAmount = usdAmount * rate;
          const parent = node.parentNode;

          // Replace the displayed USD price.
          node.nodeValue = formatCurrency(
            convertedAmount,
            currency
          );

          // Add the original USD amount below the converted price.
          const note = document.createElement('small');
          note.className = 'currency-usd-note text-muted';

          if (currency === 'EUR') {
            note.textContent =
              'You will be charged in US dollars: US$' +
              usdAmount.toFixed(2);
          } else {
            note.textContent =
              'US dollar amount: US$' +
              usdAmount.toFixed(2);
          }

          note.style.display = 'block';

          parent.insertBefore(note, node.nextSibling);
        });
      })
      .catch(function (error) {
        // Keep the original USD prices if the API fails.
        console.warn('Currency conversion failed:', error);
      });
  }
