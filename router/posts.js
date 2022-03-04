const express = require("express");
const router = express.Router();
const models = require('../models/model');
const path = require('path');
const categori = require("../models/categori");
const users = require('../models/user');


router.get('/new', (req, res) => {
    if (!req.session.userId) {
        return res.render('site/login')
    }
    categori.find({}).then(categori => {

        const context = {
            categoryDocuments: categori.map(document => {
                return {
                    name: document.name,
                    id: document._id
                }
            })
        }
        res.render('site/addposts', { categori: context.categoryDocuments })
    })
});

router.post('/new', (req, res) => {
    //gosulan imgs alyp galya
    //console.log(req.files)
    let post_name = req.files.post_name;
    post_name.mv(path.join(__dirname, '../public/img/new_img', post_name.name));
    //obj doretyar
    models.create({
        ...req.body,
        post_name: `img/new_img/${post_name.name}`,
        author: req.session.userId
    })

    //flash message
    req.session.sessionFlash = {
        type: 'alert alert-success',
        message: 'Success'
    }
    res.redirect('/blog');
});


router.get('/categori/:categoriID', (req, res) => {
    models.find({ categori: req.params.categoriID })
    .populate({ path: "categori", models: categori })
    .populate({ path: 'author', model: users })
    .then(post => {

        const usersDocuments = post.map(document => {
            return {
                title: document.title,
                _id: document._id,
                content: document.content,
                date: document.date,
                post_name: document.post_name,
                categori: document.categori,
                author: document.author
            }
        })
        const author_name = post[0].author.username
        categori.aggregate([
            {
                $lookup: {
                    from: 'posts',
                    localField: "_id",
                    foreignField: "categori",
                    as: 'posts'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    num_of_posts: ($size = '$posts')
                }
            }

        ])
            .then(categori => {

                const usersDocuments2 = categori.map(document => {
                    return {
                        _id: document._id,
                        name: document.name
                    }
                })
                models.find({}).populate({ path: 'author', model: users }).sort({ $natural: -1 }).then(posts => {
                    const usersDocuments3 = posts.map(document => {
                        return {
                            title: document.title,
                            _id: document._id,
                            content: document.content,
                            date: document.date,
                            post_name: document.post_name,
                            categori: document.categori,
                            author: document.author
                        }
                    })
                    console.log(author_name)

                    res.render('site/blog', {
                        post: usersDocuments,
                        categori: usersDocuments2,
                        posts: usersDocuments3,
                        author_name: author_name
                    }

                    )
                })

            })
    })
})

router.get('/:_id', (req, res) => {
    models.find({ _id: req.params._id }).populate({ path: 'author', model: users })
        .sort({ $natural: -1 })
        .then(post => {
            const new_post = post[0].post_name;
            const new_title = post[0].title;
            const new_content = post[0].content;
            const new_author_name = post[0].author.username
            categori.find({}).then(categori => {

                const usersDocuments2 = categori.map(document => {
                    return {
                        _id: document._id,
                        name: document.name
                    }
                })
                
                models.find({}).sort({ $natural: -1 }).then(post => {

                    const usersDocuments3 = post.map(document => {
                        return {
                            _id:document._id,
                            title:document.title,
                            categori:document.categori,
                            content:document.content,
                            author:document.author,
                            post_name:document.post_name,
                            date:document.date
                        }
                    }
                    )
                    res.render('site/post', {
                        posts: usersDocuments3,
                        categori: usersDocuments2,
                        new_post: new_post,
                        new_title: new_title,
                        new_content: new_content,
                        author_name: new_author_name
                    }
                    );
                })


            })


        });

});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get('/search', (req,res) => {
    console.log(req.query.search)
    if (req.query.search) {
        const regex = new RedExp(escapeRegex(req.query.search), 'gi');
        models.find({ 'title' : regex }).populate({path:'author', model : users})
        .then(post => {
            //console.log(req.query)
            res.render('site/blog', {post:post})
        })
    }
})

module.exports = router;
