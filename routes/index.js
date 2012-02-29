
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
  res.render('hello', { title: 'Hello Node World', room1: 'Room 1', room2: 'Room 2' })
};
