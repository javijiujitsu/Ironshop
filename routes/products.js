const express = require('express');
const Product = require('../models/product');

const router  = express.Router();


router.get('/api', (req, res, next) => {
  Product.find({}, (err, products) => {
    if (err) { return next(err) }

    res.send(products);
    });
  });





router.get('/', (req, res, next) => {
  Product.find({}, (err, products) => {
    if (err) { return next(err) }

    res.render('products/index', {
      products: products
    });
  });
});


router.get('/new', (req, res, next) => {
  res.render('products/new');
});

router.get('/:id/edit', (req, res, next) => {
  const productId = req.params.id;

  Product.findById(productId, (err, product) => {
    if (err) { return next(err); }
    res.render('products/edit', { product: product });
  });
});

router.get('/search', (req, res) => {
  let query = req.query.searchTerm;

  let queryRegex = new RegExp(query);
  // We use a Regex here to find items that are similar to the search
  // For instance if I searched "Yoga", I would then find the Yoga Mat
  Product.find({ name: queryRegex }, (err, products) => {
    if (err) { next(err) }
    res.render('products/search-results', {products});
  });
});

router.get('/cheapest', (req, res, next) => {
  Product
    .find({})
    .sort({ price: "ascending" })
    .exec((err, products) => {
      if (err) { next(err) }
      res.render('products/search-results',  {products})
    });
});

router.get('/expensive', (req, res, next) => {
  Product
    .find({})
    .sort({ price: "descending" })
    .exec((err, products) => {
      if (err) { next(err) }
      res.render('products/search-results',  {products})
    });
});

router.get('/:id', (req, res, next) => {
  const productId = req.params.id;

  Product.findById(productId, (err, oneProduct) => {
      if (err) { return next(err); }
      res.render('products/show', { product: oneProduct });
    });
});


router.post('/:id', (req, res, next) => {
  const productId = req.params.id;

  /*
   * Create a new object with all of the information from the request body.
   * This correlates directly with the schema of Product
   */
  const updates = {
      name: req.body.name,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      description: req.body.description
  };

  Product.findByIdAndUpdate(productId, updates, (err, product) => {
    if (err){ return next(err); }
    return res.redirect('/products');
  });
});


router.post('/', (req, res, next) => {
  // Take the params, and translate them into a new object
  const productInfo = {
      name: req.body.name,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      description: req.body.description
  };

  // Create a new Product with the params
  const newProduct = new Product(productInfo);
  newProduct.save( (err) => {
    if (err) {
      return res.render('products/new', { errors: newProduct.errors });
    }
    return res.redirect('/products');
  });
});

router.post('/:id/delete', (req, res, next) => {
  const id = req.params.id;

  Product.findByIdAndRemove(id, (err, product) => {
    if (err){ return next(err); }
    return res.redirect('/products');
  });

});


module.exports = router;
