
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

/*
 * GET hello page.
 */

exports.hello = function(req, res){
  res.render('hello', { title: 'Hello Node World' })
};
