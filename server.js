var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');

var Player = require('./app/models/player');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

// Middleware om bij elke keer dat de API wordt gebruikt (een request wordt verstuurd) er iets gebeurd
router.use(function(req, res, next) {
  // In dit geval logging naar console
  console.log('Something is happening.');
  next();
})

router.get('/', function(req,res) {
  res.json({ message: 'jeej message!'});
});

router.route('/players')

// Create een player (toegang bij een POST op http://localhost:8080/api/players)
  .post(function(req, res) {
    var player = new Player();
    player.name = req.body.name;

    player.save(function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'Player Created!' });
    });
  })

// Vind/GET een player (toegang bij een GET op http://localhost:8080/api/players)

  .get(function(req, res) {
    Player.find(function(err, players) {
      if (err)
        res.send(err);

      res.json(players);
    });
  });

router.route('/players/:player_id')
// Doet iets met api dat eindigt op :player_id (ZIE: req.params.player_id komt overeen met wat ik in router.route heb aangegeven)

  .get(function(req, res) {
    Player.findById(req.params.player_id, function(err, player) {
      if (err)
        res.send(err);

      res.json(player);
    });
  })

  .put(function(req, res) {
    Player.findById(req.params.player_id, function(err, player) {
      if (err)
        res.send(err);

      player.name = req.body.name; // Dit update de Player Name (player.name neemt toegang tot de 'name' value van player. req.body.name komt vanuit de gebruiker of POSTMAN)

      player.save(function(err) {
        if (err)
          res.send(err);

        res.json({ message: 'Player Updated!' });
      });
    });
  })

  .delete(function(req, res) {
    Player.remove({
      _id: req.params.player_id
    }, function(err, player) {
      if (err)
        res.send(err);

      res.json({ message: 'Player Deleted!' })
    });
  });

app.use('/api', router);

app.listen(port);
console.log('Server port: ' + port);
