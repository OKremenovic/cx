module.exports = {
   "plugins": [
      "babel-plugin-cx",
      "babel-plugin-transform-object-rest-spread",
      "babel-plugin-transform-function-bind",
      ["babel-plugin-transform-react-jsx", {"pragma": "VDOM.createElement"}]
   ]
};

