const express = require('express');
const postDb = require('../post-model/postDb');
const db = require('../data/db');
const postRouter = express.Router();
postRouter.use(express.json());

// get all posts
postRouter.get('/', (req, res) => {
    postDb.find()
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The posts information could not be retrieved." });
        });
});

// create a new post
postRouter.post('/', (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({ error: "Please provide title and contents for the post." });
    }
    postDb.insert({ title, contents })
        .then(newComment => {
            res.status(201).json(newComment);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error while saving the post to the database" });
        });
});

// get individual post by id
postRouter.get('/:id', (req, res) => {
    const postId = req.params.id;
    postDb.findPostComments(postId)
        .then(post => {
            console.log('post', post);
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ error: "The post with the specified ID does not exist." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The post information could not be retrieved." });
        });
});

// get comment specfied by post id
postRouter.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    postDb.findCommentById(id)
        .then(comment => {
            // console.log('comment', comment);
            if (comment) {
                res.status(200).json(comment)
            } else {
                res.status(404).json({ error: "The post with the specified ID does not exist." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The comments information could not be retrieved." });
        });
});

// create new comment for post specified by id
postRouter.post('/:id/comments', (req, res) => {
    const { text, post_id } = req.body;
    const { id } = req.params.id;
    console.log(post_id);
    if (!post_id) {
        res.status(404).json({ error: "The post with the specified ID does not exist." });
    }
    postDb.insertComment({ text, post_id })
        .then(newComment => {
            if (!text) {
                return res.status(400).json({ error: "Please provide text for the comment." });
            }
            res.status(201).json(newComment);
        })
        .catch(err => {
            console.log('comment post err', err);
            res.status(500).json({ error: "The posts information could not be retrieved." });
        });
});

// delete post specified by id
postRouter.delete('/:id', (req, res) => {
    const { id } = req.params;
    postDb.remove(id)
        .then(deleted => {
            if (deleted) {
                res.status(204).end();
            } else {
                res.status(404).json({ error: "The post with the specified ID does not exist." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The post could not be removed" });
        });
});

// update post specified by id
postRouter.put('/:id', (req, res) => {
    const { title, contents } = req.body;
    const { id } = req.params;
    if (!title && !contents) {
        res.status(400).json({ error: "Please provide title and contents for the post." });
    }
    postDb.update(id, { title, contents })
        .then(updated => {
            if (updated) {
                db.findById(id)
                    .then(post => res.status(200).json(post))
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: "The post information could not be modified." });
                    });
            } else {
                res.status(404).json({ error: "The post with the specified ID does not exist." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The post information could not be modified." });
        });
});

module.exports = postRouter;


/*
HENRY'S SOLUTION:

const express = require('express');
const router = express.Router('express');
const db = require('../data/db.js');

// router.get('/', (req, res) => {
//     res.send('working');
// });

router.get('/', (req, res) => {
    db.find()
        .then(posts => res.status(200).json(posts))
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "The posts information could not be retrieved"});
        });
});

router.post('/', (req, res) => {
    const {title, contents} = req.body;
    if(!title || !contents) {
        // adding 'return' prevents code from continuing to run.
        return res.status(400).json({error: 'need title and contents'});
    }
    db.insert(({title, contents}) => {
        .then(({id}) => {
            db.findById(id)
                .then(([post]) => {
                    res.status(201).json(post))
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "Error getting post"});
        });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "Error inserting post"});
        });
});

router.get('/:id', (req, res) => {
    const {id} = req.params;
    db.findById(id)
        // alternative to be used with post.length or adding .first to findById fxn: then((post) =>{})
        .then(([post]) => {
            console.log(post);
            // alternative to use with line 159: if(post.length) {}
            if(post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({error: "Post with id does not exist"});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "The posts information could not be retrieved"});
        });
});

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const {title, contents} = req.body;
    if(!title && !contents) {
        // adding 'return' prevents code from continuing to run.
        return res.status(400).json({error: 'need changess'});
    }
    db.update(id, {title, contents})
        .then(updated => {
            if(updated) {
                getPost(id, res);
            } else {
                res.status(404).json({error: "post with id does not exist"});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "Error updating post"});
        });
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    db.remove(id)
        .then(removed => {
            if(removed) {
                res.status(204).end();
            } else {
                res.status(404).json({error: "post with id does not exist"});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "error deleting post"});
        });
});

router.get('/:post_id/comments', (req, res) => {
    const {post_id} = req.params;
    db.findById(post_id)
        .then(([post]) => {
            if(post) {
                db.findPostComments(post_id)
                    .then(comments => {
                        res.status(200).json(comments);
                    });
            } else {
                res.status(404).json({error: "post with id does not exist"});
            }
        })
        .catch(err => {
            console.log('get comments', err);
            res.status(500).json({error: "error getting comments"});
        });
});

router.post('/:post_id/comments', (req, res) => {
    const {post_id} = req.params;
    const {text} = req.body;
    if(text === '' || typeof text !== 'string') {
        return res.status(400).json({error: 'comment requires text'});
    }
    db.insertComment({text, post_id})
        .then(({id: comment_id}) => {
            db.findCommentById(comment_id)
                .then(([comment]) => {
                    if(comment) {
                        res.status(200).json(comment);
                    } else {
                        res.status(404).json({error: "comment with id not found"});
                    }
                })
                .catch(err => {
                    console.log('post comment', err);
                    res.status(500).json({error: 'error getting comment'});
                });

        })
     .catch(err => {
                    console.log('post comment', err);
                    res.status(500).json({error: 'error adding comment'});
                });
});

module.exports = router;
*/