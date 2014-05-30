// Copyright 2002-2014, University of Colorado Boulder

/**
 * Scene graph for the 'Balancing game' screen.
 *
 * @author Vasily Shakhov (MLearner)
 */

define( function( require ) {
  'use strict';

  // Imports
  //var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var inherit = require( 'PHET_CORE/inherit' );
  //var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  //var Scoreboard = require( 'VEGAS/Scoreboard' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StartGameLevelNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/StartGameLevelNode' );

  /**
   * Constructor.
   *
   * @param {gameModel} gameModel - balancing model object.
   * @constructor
   */
  function GameView( gameModel ) {
    ScreenView.call( this );
    var thisScene = this;

    // Add a root node where all of the game-related nodes will live.
    var rootNode = new Node();
    thisScene.addChild( rootNode );

    var startGameLevelNode = new Node();
    var scoreboard = new Node();
    var gameAudioPlayer = new Node();
    var rewardNode = new Node();

    /*var startGameLevelNode = new StartGameLevelNode( gameModel, this.layoutBounds );
    var scoreboard = new Scoreboard(
      gameModel.problemIndexProperty,
      new Property( gameModel.PROBLEMS_PER_LEVEL ),
      gameModel.levelProperty,
      gameModel.scoreProperty,
      gameModel.elapsedTimeProperty,
      gameModel.timerEnabledProperty,
      function() { gameModel.newGame(); },
      { levelVisible: false }
    );
    scoreboard.mutate( { centerX: this.layoutBounds.centerX, bottom: this.layoutBounds.maxY - 10 } );
    var gameAudioPlayer = new GameAudioPlayer( gameModel.soundEnabledProperty );
    var rewardNode = new Node();*/

    // Monitor the game state and update the view accordingly.
    gameModel.stateProperty.link( function( state ) {
      if ( state === 'selectGameLevel' ) {
        rewardNode.animationEnabled = false;
        rootNode.removeAllChildren();
        rootNode.addChild( startGameLevelNode );
      }
      else if ( state === 'levelCompleted' ) {
        rootNode.removeAllChildren();
        if ( gameModel.score === gameModel.MAX_POINTS_PER_GAME_LEVEL ) {
          // Perfect score, add the reward node.
          rootNode.addChild( rewardNode );
          rewardNode.mutate( { centerX: thisScene.layoutBounds.width / 2, centerY: thisScene.layoutBounds.height / 2 } );
          rewardNode.animationEnabled = true;
        }

        // Add the dialog node that indicates that the level has been completed.
        rootNode.addChild( new LevelCompletedNode( gameModel.level, gameModel.score, gameModel.MAX_POINTS_PER_GAME_LEVEL,
          gameModel.PROBLEMS_PER_LEVEL, gameModel.timerEnabled, gameModel.elapsedTime, gameModel.bestTimes[ gameModel.level ], gameModel.newBestTime,
          function() { gameModel.state = 'selectGameLevel'; }, {
            centerX: thisScene.layoutBounds.width / 2,
            centerY: thisScene.layoutBounds.height / 2,
            levelVisible: false
          } ) );

        // Play the appropriate audio feedback.
        if ( gameModel.score === gameModel.MAX_POINTS_PER_GAME_LEVEL ) {
          gameAudioPlayer.gameOverPerfectScore();
        }
        else if ( gameModel.score > 0 ) {
          gameAudioPlayer.gameOverImperfectScore();
        }
      }
      else if ( typeof( state.createView ) === 'function' ) {
        // Since we're not in the start or game-over states, we must be
        // presenting a problem.
        rootNode.removeAllChildren();
        rootNode.addChild( state.createView( thisScene.layoutBounds ) );
        rootNode.addChild( scoreboard );
      }
    } );
  }

  return inherit( ScreenView, GameView );
} );
