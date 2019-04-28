const loadImages = () => {
  return new Promise(resolve => {
    PIXI.loader
      .add('actionBg', '/static/images/action-bg.png')
      .add('actionIconAttack', '/static/images/action-icon-attack.png')
      .add('actionIconBuild', '/static/images/action-icon-build.png')
      .add('actionIconCancel', '/static/images/action-icon-cancel.png')
      .add('actionIconCut', '/static/images/action-icon-cut.png')
      .add('actionIconEmpty', '/static/images/action-icon-empty.png')
      .add('actionIconRecruit', '/static/images/action-icon-recruit.png')
      .add('army', '/static/images/army.png')
      .add('armyIcon', '/static/images/army-icon.png')
      .add('arrow', '/static/images/arrow.png')
      .add('blackOverlay', '/static/images/black-overlay.png')
      .add('border', '/static/images/border.png')
      .add('camp', '/static/images/camp.png')
      .add('capital', '/static/images/capital.png')
      .add('castle', '/static/images/castle.png')
      .add('contested', '/static/images/contested.png')
      .add('fog', '/static/images/fog.png')
      .add('forest', '/static/images/forest.png')
      .add('gold', '/static/images/gold.png')
      .add('hitpointsBg', '/static/images/hitpoints-bg.png')
      .add('hitpointsFill', '/static/images/hitpoints-fill.png')
      .add('mountain', '/static/images/mountain.png')
      .add('pattern', '/static/images/pattern.png')
      .add('village', '/static/images/village.png')
      .add('water', '/static/images/water.png')
      .load(resolve)
  })
}

export default loadImages
