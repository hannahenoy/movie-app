const ObjectId = require("mongodb").ObjectId
module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      let movies =[
        { movieTitle: 'THE BATMAN', rating: '🍅 88%', src: 'batman.jpeg', description: 'When a serial killer murders political figures in Gotham, Batman is forced to investigate the citys corruption and question his familys involvement.'},
        { movieTitle: 'EVERYTHING...', rating: '🍅 99%', src: 'everything.jpeg', description: 'A Chinese American immigrant discovers that she must connect with parallel universe versions of herself to prevent a powerful being destroying the multiverse.' },
        { movieTitle: 'TURNING RED', rating: '🍅 89%', src: 'red.jpeg', description: 'Mei, a Chinese Canadian teen finds out whenever she gets too excited or stressed, she "poofs" into a giant red panda due to her ancestors association with the red pandas.' },
        { movieTitle: 'X', rating: '🍅 90%', src: 'x.jpeg', description: 'In 1979, a group of young filmmakers set out to make an adult film in rural Texas, but finds themselves fighting for their lives.' },
        { movieTitle: 'MARCEL...', rating: '🍅 80%', src: 'marcel.jpeg', description: 'Marcel, an adorable one-inch-tall shell living alone with his grandmother Connie seek to find their long-lost community' },
        { movieTitle: 'NOPE', rating: '🍅 80%', src: 'nope.jpeg', description: 'Written by Jordan Peele and starring Daniel Kaluuya and Keke Palmer as horse-wrangling siblings attempting to capture evidence of an unidentified flying object.' },
        { movieTitle: 'HUSTLE', rating: '🍅 78%', src: 'hustyle.jpg', description: 'An NBA scout discovers a raw but talented basketball player in Spain and tries to prepare him for the NBA draft.' },
        { movieTitle: 'TRIANGLE...', rating: '🍅 83%', src: 'triangle.jpeg', description: 'A fashion model celebrity couple join an eventful cruise for the super-rich and end up testing their relationship and will to survive.' },
        { movieTitle: 'FIRE ISLAND', rating: '🍅 80%', src: 'fire.jpeg', description: 'Inspired by Jane Austens Pride and Prejudice, a group of gay friends go on vacation only for things to become complicated by classism and romance.' },
        { movieTitle: 'THE PHANTOM...', rating: '🍅 68%', src: 'phantom.jpeg', description: 'An amateur golfer achieves his late-in-life goal of participating in the British Open Golf Championship, much to the ire of the staid golfing community.' },
        { movieTitle: 'THE SADNESS', rating: '🍅 70%', src: 'sadness.jpeg', description: 'As Taiwan succumbs to a viral pandemic that transforms citizens into bloodthirsty maniacs, a young couple battle to be reunited before becoming infected.' },
        { movieTitle: 'NANNY', rating: '🍅 77%', src: 'nanny.jpeg', description: 'An undocumented Senegalese working as a nanny for an affluent Manhattan family hopes to bring her child she left behind to the United States.' },
        { movieTitle: 'BOBS BURGERS...', rating: '🍅 98%', src: 'bobs.jpeg', description: 'The Belchers struggle to pay their loan after a sinkhole opens in front of their restaurant, while the kids try to solve the murder of a carnie.' },
        { movieTitle: 'WATCHER', rating: '🍅 88%', src: 'watcher.jpeg', description: 'After putting all their savings into their dream home in the idyllic suburb of Westfield, New Jersey, they soon realize the neighborhood is less than welcoming.' },
        { movieTitle: 'PEARL', rating: '🍅 96%', src: 'pearl.jpeg', description: 'Trapped on an isolated farm, Pearl tends to her ailing father under her mothers watch. Pearl lusts for luxury as her temptations and repressions collide.' },
        { movieTitle: 'ENOLA HOLMES 2', rating: '🍅 79%', src: 'enola.jpeg', description: 'Enola takes on her first official case as a detective to solve the mystery of a missing girl with help from friends and her brother, Sherlock.' },
      ];
      db.collection('savedList').find().toArray((err1,savedmovies)=>{
        db.collection('users').find().toArray((err2, result) => {
          if (err2) return console.log(err2)
          console.log(savedmovies, 'saved list')
          res.render('profile.ejs', {
            user : req.user,
            movies: movies,
            savedmovies: savedmovies
          })
        })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/saveMovie', (req, res) => {
      console.log(req.body,'request sent to post route')
      db.collection('savedList')
        .insertOne({
            movieTitle: req.body.movieTitle,
            rating: req.body.rating,
            moviePoster: req.body.moviePoster,
            description: req.body.description }, 
        (err, result) => {
          if (err) return console.log(err)
          console.log('saved to database', result)
          res.send({})
      })
    })

    // app.put('/messages', (req, res) => {
    //   db.collection('messages')
    //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    //     $set: {
    //       thumbUp:req.body.thumbUp + 1
    //     }
    //   }, {
    //     sort: {_id: -1},
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })

    app.delete('/deleteSave', (req, res) => {
      console.log(req.body, 'delete route hit')
      db.collection('savedList').findOneAndDelete({_id: ObjectId(req.body.movieId)},
        function(err, result){
        if(err) return res.send(500, err)
        res.send(result)
      })

    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
