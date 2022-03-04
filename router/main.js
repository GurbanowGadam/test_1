const express = require("express");
const router = express.Router();
const models = require('../models/model');
const categori = require('../models/categori');
const users = require("../models/user");


router.get('/', (req, res) => {
    res.render('site/home');
});

router.get('/contact', (req, res) => {
    res.render('site/contact');
});

router.get('/blog', (req, res) => {
    const postperPage = 2
    const page = req.params.page || 1

    models.find({}).populate({ path: 'author', model: users }).sort({ $natural: -1 })
    .skip((postperPage * page) - postperPage)
    .limit(postperPage)
        .then(posts => {
            const usersDocuments = posts.map(document => {
                return {
                    title: document.title,
                    _id: document._id,
                    content: document.content,
                    date: document.date,
                    post_name: document.post_name,
                    categori: document.categori,
                    author: document.author,
                    author_name: document.author.username
                }
            })
            categori.aggregate([
                {
                    $lookup:{
                        from:'posts',
                        localField: "_id",
                        foreignField: "categori",
                        as: 'posts'
                    }
                },
                {
                    $project:{
                        _id:1,
                        name:1,
                        num_of_posts: ($size ='$posts')
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
 
                models.countDocuments().then(postCount => {
                    // console.log(parseInt(page))
                    // console.log(Math.ceil(postCount / postperPage))
                    res.render('site/blog', {
                        post: usersDocuments,
                        author_name: usersDocuments[0].author_name,
                        categori: usersDocuments2,
                        posts: usersDocuments,
                        current: parseInt(page),
                        pages: Math.ceil(postCount / postperPage)
                    }
                )
               
            });
        })


        });
});

module.exports = router;