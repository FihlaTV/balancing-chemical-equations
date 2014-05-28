// Copyright 2002-2014, University of Colorado Boulder

/**
 * Scene graph for the 'Balancing game' screen.
 *
 * @author Daria Mitina (MLearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );

  function GameView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );
  }

  return inherit( ScreenView, GameView );
} );