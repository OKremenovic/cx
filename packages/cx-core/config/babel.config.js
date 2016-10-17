module.exports = {
   "externalHelpers": true,
   "plugins": [
      "external-helpers",
      "cx",
      "transform-object-rest-spread",
      "transform-function-bind",
      ["transform-react-jsx", {"pragma": "VDOM.createElement"}]
   ]
};

