// Copyright 2014-2019, University of Colorado Boulder

/**
 * Equality operator between 2 sides of equation: equals (balanced) or not equals (not balanced).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Property.<Equation>} equationProperty
   * @param {Object} [options]
   * @constructor
   */
  function EqualityOperatorNode( equationProperty, options ) {

    options = merge( {}, options );

    const textOptions = {
      font: new PhetFont( 80 ),
      stroke: 'black'
    };

    // nodes
    const equalsSignNode = new Text( '\u003D',
      merge( { fill: BCEConstants.BALANCED_HIGHLIGHT_COLOR }, textOptions ) );
    const notEqualsSignNode = new Text( '\u2260',
      merge( { fill: BCEConstants.UNBALANCED_COLOR, center: equalsSignNode.center }, textOptions ) );

    options.children = [ equalsSignNode, notEqualsSignNode ];
    Node.call( this, options );

    // show the correct operator, based on whether the equation is balanced
    const balancedObserver = function( balanced ) {
      equalsSignNode.visible = balanced;
      notEqualsSignNode.visible = !balanced;
    };
    equationProperty.link( function( newEquation, oldEquation ) {
      if ( oldEquation ) { oldEquation.balancedProperty.unlink( balancedObserver ); }
      newEquation.balancedProperty.link( balancedObserver );
    } );
  }

  balancingChemicalEquations.register( 'EqualityOperatorNode', EqualityOperatorNode );

  return inherit( Node, EqualityOperatorNode, {

    // No dispose needed, instances of this type persist for lifetime of the sim.
  } );
} );
