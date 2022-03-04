const express = require("express");
const router = express.Router();
const categoris = require('../../models/categori');
const models = require('../../models/model');


router.get('/', (req, res) => {


  res.render('admin/index')

});

router.get('/categories', (req, res) => {
  categoris.find({}).sort({ $natural: -1 }).then(categories => {
    const context = {
      categoriesDocuments: categories.map(document => {
        return {
          name: document.name,
          _id: document._id
        }
      })
    }
    res.render('admin/categories', { categories: context.categoriesDocuments });
  })
});

router.post('/categories', (req, res) => {
  categoris.create(req.body, (err, categori) => {
    if (!err) res.redirect('categories')
  })
});

router.delete('/categories/:id', (req, res) => {
  categoris.remove({ _id: req.params.id }).then(() => {
    res.redirect('/admin/categories')
  })
});


router.get('/posts', (req, res) => {



  models.find({}).populate({ path: 'categori', model: categoris }).sort({ $natural: -1 })
    .then((post) => {

      const context = {
        usersDocuments: post.map(document => {
          return {
            title: document.title,
            _id: document._id,
            content: document.content,
            date: document.date,
            post_name: document.post_name,
            categori: document.categori,
            author: document.author,
            categori_name:document.categori.name
          }
        })
      }
      res.render('admin/posts', {
        post: context.usersDocuments
      });

    });
});

router.delete('/posts/:id', (req, res) => {
  models.remove({ _id: req.params.id }).then(() => {
    res.redirect('/admin/posts')
  })
});

router.get('/posts/edit/:_id', (req, res) => {


  models.findOne({ _id: req.params._id }).sort({ $natural: -1 })
    .then((post) => {

        res.render('admin/editpost', {post: {
                title: post.title,
                content:post.content,
                categori:post.categori,
                post_name:post.post_name,
                _id:post._id
                }
          });
      })

    
});

router.put('/admin/posts/:_id', (req,res) =>  {
    //gosulan imgs alyp galya
    let post_name = req.files.post_name;
    post_name.mv(path.join(__dirname,'../../public/img/new_img',post_name.name));

    models.findOne({ _id: req.params._id }).then(post => {
       post.title = req.body.title
       post.content = req.body.content
       post.date = req.body.date
       post.categori = req.body.categori
       post.post_name = req.body.post_name
       console.log(post)
       post.save().then(post => {
         res.render('site/blog', {post:post});
       });
    })
    
})

module.exports = router;
