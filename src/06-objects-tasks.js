/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  const obj = {};
  obj.width = width;
  obj.height = height;
  obj.getArea = function countArea() {
    return (this.width * this.height);
  };
  return obj;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

function checkOrder(arr) {
  const classIndexes = [];
  const attrIndexes = [];
  const pseudoClassIndexes = [];
  const pseudoElemIndexes = [];
  const elemIndexes = [];
  const idIndexes = [];

  arr.forEach((sel, i) => {
    if (arr[i].includes('#')) {
      idIndexes.push(arr.indexOf(arr[i]));
    }
    if (!arr[i].match(/[.:#]/)) {
      elemIndexes.push(arr.indexOf(arr[i]));
    }
    if (arr[i].includes('.')) {
      classIndexes.push(arr.indexOf(arr[i]));
    }
    if (arr[i].includes('[')) {
      attrIndexes.push(arr.indexOf(arr[i]));
    }
    if (arr[i][0] === ':' && arr[i][1] !== ':') {
      pseudoClassIndexes.push(arr.indexOf(arr[i]));
    }
    if (arr[i].match(/::.*/g)) {
      pseudoElemIndexes.push(arr.indexOf(arr[i]));
    }
  });
  if (attrIndexes[0] < classIndexes[0] || pseudoClassIndexes[0] < classIndexes[0]
  || classIndexes[0] < idIndexes[0] || classIndexes[0] < elemIndexes[0]
  || pseudoClassIndexes[0] < attrIndexes[0] || pseudoClassIndexes[0] < idIndexes[0]
  || pseudoElemIndexes[0] < pseudoClassIndexes[0] || pseudoElemIndexes[0] < idIndexes[0]
  || idIndexes[0] < elemIndexes[0]) {
    throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  }
}
class MyCssSelector {
  constructor() {
    this.selectorsChain = [];
    this.combinedSelectors = [];
  }

  element(value) {
    const selector = value;
    this.selectorsChain.forEach((sel) => {
      if (!sel.match(/[.::#]/)) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
    });
    this.selectorsChain.push(selector);
    checkOrder(this.selectorsChain);
    return this;
  }

  id(value) {
    const iD = `#${value}`;
    this.selectorsChain.forEach((sel) => {
      if (sel.includes('#')) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
    });
    this.selectorsChain.push(iD);
    checkOrder(this.selectorsChain);
    return this;
  }

  class(value) {
    const clAss = `.${value}`;
    this.selectorsChain.push(clAss);
    checkOrder(this.selectorsChain);
    return this;
  }

  attr(value) {
    const atTr = `[${value}]`;
    this.selectorsChain.push(atTr);
    checkOrder(this.selectorsChain);
    return this;
  }

  pseudoClass(value) {
    const pseudoC = `:${value}`;
    this.selectorsChain.push(pseudoC);
    checkOrder(this.selectorsChain);
    return this;
  }

  pseudoElement(value) {
    const pseudoE = `::${value}`;
    this.selectorsChain.forEach((sel) => {
      if (sel.includes('::')) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
    });
    this.selectorsChain.push(pseudoE);
    checkOrder(this.selectorsChain);
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.combinedSelectors.push(selector1.stringify(), combinator, selector2.stringify());
    return this;
  }

  stringify() {
    if (this.combinedSelectors.length !== 0) {
      return this.combinedSelectors.join(' ');
    }
    const result = this.selectorsChain.join('');
    this.selectorsChain = [];
    return result;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new MyCssSelector().element(value);
  },

  id(value) {
    return new MyCssSelector().id(value);
  },

  class(value) {
    return new MyCssSelector().class(value);
  },

  attr(value) {
    return new MyCssSelector().attr(value);
  },

  pseudoClass(value) {
    return new MyCssSelector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new MyCssSelector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new MyCssSelector().combine(selector1, combinator, selector2);
  },

  stringify() {
    return new MyCssSelector().stringify();
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
