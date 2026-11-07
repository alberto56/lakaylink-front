/**
 * Lakay Convert
 *
 * Generic unit conversion utility.
 *
 * Usage:
 * LakayConvert.convert(
 *   'weight',
 *   1,
 *   'lb',
 *   'kg',
 *   '/json/units-conversion.json',
 *   callback,
 *   err
 * );
 *
 * Run self-tests in browser console.
 * LakayConvert.selfTest();
 */

class LakayConvert {

  /**
   * Convert a value between two units.
   *
   * @param {string} type       Conversion category (weight, length...)
   * @param {number} from       Value to convert
   * @param {string} fromunit   Source unit
   * @param {string} tounit     Destination unit
   * @param {string|object} sourceData JSON URL or already loaded data
   * @param {function} callback Success callback
   * @param {function} err      Error callback
   */

  static async convert(
    type,
    from,
    fromunit,
    tounit,
    sourceData,
    callback,
    err
    ) {
    try {

        if (typeof from !== 'number' || !Number.isFinite(from)) {
            throw new Error('Invalid conversion value.');
        }

        if (!type || !fromunit || !tounit) {
            throw new Error('Missing conversion parameters.');
        }

        let data;

        // Load JSON or use an existing object
        if (typeof sourceData === 'string') {

            const response = await fetch(sourceData);

            if (!response.ok) {
                throw new Error(
                    `Unable to load conversion data: HTTP ${response.status}`
                );
            }

            try {
                data = await response.json();
            } catch {
                throw new Error('Invalid JSON conversion data.');
            }

        } else if (
            sourceData &&
            typeof sourceData === 'object' &&
            !Array.isArray(sourceData)
        ) {
            data = sourceData;

        } else {
            throw new Error('Invalid conversion source data.');
        }

        // Validate category
        const category = data[type];

        if (
            !category ||
            typeof category !== 'object' ||
            Array.isArray(category)
        ) {
            throw new Error(
                `Conversion category "${type}" does not exist.`
            );
        }

        // Validate source unit
        const source = category[fromunit];

        if (!source) {
            throw new Error(
                `Source unit "${fromunit}" does not exist.`
            );
        }

        // Validate destination unit
        const destination = category[tounit];

        if (!destination) {
            throw new Error(
                `Destination unit "${tounit}" does not exist.`
            );
        }

        // Find common base unit automatically
        const baseUnits = Object.keys(source).filter(
            key =>
                key !== 'label' &&
                typeof source[key] === 'number'
        );

        if (baseUnits.length === 0) {
            throw new Error(
                `No valid base unit found for "${fromunit}".`
            );
        }

        const baseUnit = baseUnits[0];

        // Both units must use the same base unit
        if (
            typeof destination[baseUnit] !== 'number' ||
            !Number.isFinite(destination[baseUnit])
        ) {
            throw new Error(
                `Unit "${tounit}" does not support base unit "${baseUnit}".`
            );
        }

        const sourceFactor = source[baseUnit];
        const destinationFactor = destination[baseUnit];

        if (
            !Number.isFinite(sourceFactor) ||
            sourceFactor <= 0 ||
            !Number.isFinite(destinationFactor) ||
            destinationFactor <= 0
        ) {
            throw new Error('Invalid conversion factor.');
        }

        // Convert through common base unit
        const result =
            (from * sourceFactor) / destinationFactor;

        if (!Number.isFinite(result)) {
            throw new Error('Conversion produced an invalid result.');
        }

        if (typeof callback === 'function') {
            callback(result);
        }

        return result;

    } catch (error) {

        if (typeof err === 'function') {
            err(error);
        } else {
            console.error(error);
        }

        return null;
    }
  }


  /**
   * Run conversion self-tests.
   *
   * Returns true if all tests pass.
   */
  static selfTest() {

      const testData = {
          weight: {
              lb: {
                  kg: 0.453592
              },
              kg: {
                  kg: 1
              },
              g: {
                  kg: 0.001
              }
          }
      };

      const tests = [
          {
              name: '1 lb to kg',
              from: 1,
              fromunit: 'lb',
              tounit: 'kg',
              expected: 0.453592
          },
          {
              name: '1 kg to lb',
              from: 1,
              fromunit: 'kg',
              tounit: 'lb',
              expected: 1 / 0.453592
          },
          {
              name: '1000 g to kg',
              from: 1000,
              fromunit: 'g',
              tounit: 'kg',
              expected: 1
          },
          {
              name: '500 g to lb',
              from: 500,
              fromunit: 'g',
              tounit: 'lb',
              expected: 0.5 / 0.453592
          },
          {
              name: '2 kg to g',
              from: 2,
              fromunit: 'kg',
              tounit: 'g',
              expected: 2000
          }
      ];

      let passed = 0;

      tests.forEach(test => {

          const source = testData.weight[test.fromunit];
          const destination = testData.weight[test.tounit];

          const result =
              (test.from * source.kg) / destination.kg;

          const success =
              Math.abs(result - test.expected) < 0.000001;

          if (success) {
              passed++;
              console.log('✓ PASS:', test.name);
          } else {
              console.error(
                  '✗ FAIL:',
                  test.name,
                  'Expected:',
                  test.expected,
                  'Received:',
                  result
              );
          }

      });

      console.log(
          `LakayConvert selfTest: ${passed}/${tests.length} tests passed.`
      );

      return passed === tests.length;
  }

}


// Global access
if (typeof window !== 'undefined') {
  window.LakayConvert = LakayConvert;

  // Backward-friendly project API
  window.LakayConvert = LakayConvert;
}

// Support Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LakayConvert;
}
