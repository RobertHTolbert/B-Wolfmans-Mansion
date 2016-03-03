window.onload = function () {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    

    
    function preload() {
        game.load.spritesheet('dude', 'assets/customSprite.png', 30, 61);

        game.load.audio('cheer', 'assets/cheering.wav');
        game.load.image('portal', 'assets/portal.png');
        game.load.image('tile', 'assets/tile.png');
    }

//global variables
var player;
var cursors;
var sound;
var portals;
var tiles;
var display;
var speed;
    
    function create(){
        //enable physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        display = game.add.text(25, 25, 'I can be the fastest man alive!  \nThe more I run, the faster I get!', {fontSize: '40px', fill: '#999'});



        tiles = game.add.group();
        tiles.enableBody = true;
        tiles.collideWorldBounds = true;

//bottom row
        var basetile = tiles.create(0, game.world.height-50, 'tile');
        basetile.body.immovable=true;
        basetile.scale.setTo(.5, .5);
        for (var i=1; i<15; i++){
            var num = game.rnd.integerInRange(0, 6);
            if (num != 1){
                var tile = tiles.create(i*50, game.world.height-50, 'tile');
                tile.body.immovable = true;
                tile.scale.setTo(.5, .5);
            }
        }
        
        //exit
        portals = game.add.group();
        portals.enableBody = true;
        var exit = portals.create(game.world.width-50, game.world.height-100, 'portal');
        exit.body.immovable = true;
        

        
        //player
        player = game.add.sprite(0, game.world.height-110, 'dude');
        game.physics.arcade.enable(player);
        player.body.gravity.y = 600;
        player.body.collideWorldBounds = true;
        //walk left 
        player.animations.add('left', [3, 2, 1, 0], 10, true);
        //walk right
        player.animations.add('right', [5, 6, 7, 8], 10, true);
        speed = 150;
        
        
        //sound
        sound = game.add.audio('cheer');
        
        //add controls
        cursors = game.input.keyboard.createCursorKeys();
    } 
    
    function update() {
        game.physics.arcade.collide(tiles, tiles);
        game.physics.arcade.collide(player, tiles);
        game.physics.arcade.overlap(player, portals, endGame, null, this);
        player.body.velocity.x = 0;
        
        
        //create custom detector to display YOU LOSE, F5 to restart text if player goes below certain y
        //TODO []
        if(player.position.y > game.world.height-110){
            display.text = 'I refuse to give up!  Hit F5 so I can try again!'
        }
        
        if(cursors.left.isDown){
            player.body.velocity.x = -speed; 
            player.animations.play('left');
        }
        else if(cursors.right.isDown){
            player.body.velocity.x = speed;
            player.animations.play('right');
        }
        else {
            player.animations.stop();
            player.frame = 4;
        }
        if (cursors.up.isDown && player.body.touching.down){
            player.body.velocity.y = -175;
        }
        if (cursors.down.isDown){
            player.body.velocity.y = 175;
        }
        
        
        //change function to call helper functions that will reset player and blocks
        //TODO [X]
        function endGame (player, exit){
            sound.play();
            display.text = 'I feel faster now!';
            //game.world.remove(tiles);
            tiles.removeAll();
            player.position.x = 0;
            setTile();
        }
        
        function setTile (){
            var basetile = tiles.create(0, game.world.height-50, 'tile');
            speed = speed+10;
            basetile.body.immovable=true;
            basetile.scale.setTo(.5, .5);
            for (var i=1; i<15; i++){
                var num = game.rnd.integerInRange(0, 6);
                if (num != 1){
                    var tile = tiles.create(i*50, game.world.height-50, 'tile');
                    tile.body.immovable = true;
                    tile.scale.setTo(.5, .5);
                }
            }
        }
        

    }
};
