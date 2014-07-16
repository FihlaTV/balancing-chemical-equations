// Copyright 2002-2014, University of Colorado Boulder

/**
 * Visual representation of an equation as a pair of bar charts, for left and right side of equation.
 * An indicator between the charts (equals or not equals) indicates whether they are balanced.
 * <p>
 * This implementation is very brute force, just about everything is recreated each time
 * a coefficient is changed in the equations.  But we have a small number of coefficients,
 * and nothing else is happening in the sim.  So we're trading efficiency for simplicity of
 * implementation.
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BarNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BarNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );

  /**
   * @param {Property} equationProperty the equation that the scales are representing
   * @param {HorizontalAligner} aligner provides layout information to ensure horizontal alignment with other user-interface elements
   * @param {*} options
   * @constructor
   */
  function BarChartsNode( equationProperty, aligner, options ) {

    var self = this;
    Node.call( this );

    this.aligner = aligner;
    this.equationProperty = equationProperty;

    this.reactantsChartParent = new Node();
    this.addChild( this.reactantsChartParent );

    this.productsChartParent = new Node();
    this.addChild( this.productsChartParent );

    var textOptions = {
      font: new PhetFont( 80 ),
      stroke: 'black',
      fill: BCEConstants.UNBALANCED_COLOR
    };

    this.equalsSignNode = new Text( '\u003D', textOptions );
    this.addChild( this.equalsSignNode );
    this.equalsSignNode.center = new Vector2( aligner.getScreenCenterX(), -40 );

    this.notEqualsSignNode = new Text( '\u2260', textOptions );
    this.addChild( this.notEqualsSignNode );
    this.notEqualsSignNode.center = new Vector2( aligner.getScreenCenterX(), -40 );

    // if coefficients change ...
    var coefficientsObserver = function() {
      self.updateNode();
    };

    // if the equation changes...
    equationProperty.link( function( newEquation, oldEquation ) {
      if ( oldEquation ) { oldEquation.removeCoefficientsObserver( coefficientsObserver ); }
      newEquation.addCoefficientsObserver( coefficientsObserver );
    } );

    this.mutate( options );
  }

  return inherit( Node, BarChartsNode, {

    /**
     * Update the node when it becomes visible.
     * @param visible
     * @override
     */
    setVisible: function( visible ) {
      var wasVisible = this.visible;
      Node.prototype.setVisible.call( this, visible );
      if ( !wasVisible && visible ) {
         this.updateNode();
      }
    },

    /**
     * Updates this node's entire geometry and layout
     * @private
     */
    updateNode: function() {
      if ( this.visible ) {
        this.updateChart( this.reactantsChartParent, true /* isReactants */ );
        this.updateChart( this.productsChartParent, false /* isReactants */ );
        this.updateEqualitySign();
      }
    },

    /**
     * Updates single chart (reactants or products).
     * @private
     */
    updateChart: function( parentNode, isReactants ) {

      parentNode.removeAllChildren();
      var x = 0;
      var atomCounts = this.equationProperty.get().getAtomCounts();

      atomCounts.forEach( function( atomCount ) {
        var count = ( isReactants ? atomCount.reactantsCount : atomCount.productsCount );
        var barNode = new BarNode( atomCount.element, count, {x: x} );
        parentNode.addChild( barNode );
        x = barNode.bounds.maxX + 50;
      } );

      parentNode.centerX = isReactants ? this.aligner.getReactantsBoxCenterX() : this.aligner.getProductsBoxCenterX();
    },

    /**
     * Updates equality and nonEquality signs
     * @private
     */
    updateEqualitySign: function() {
      var balanced = this.equationProperty.get().balanced;
      this.notEqualsSignNode.visible = !balanced;
      this.equalsSignNode.visible = balanced;
      this.equalsSignNode.fill = ( balanced ? BCEConstants.BALANCED_HIGHLIGHT_COLOR : BCEConstants.UNBALANCED_COLOR );
    }
  } );
} );