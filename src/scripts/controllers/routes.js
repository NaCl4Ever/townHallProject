import page from 'page';
import mapController from './map-controller';
import indexController from './index-controller';


page('/',
  mapController.reset,
  mapController.checkUrlParamsForSelection,
  indexController.renderMainIndex,
  mapController.setBounds,
  mapController.webGlsupported,
  indexController.renderDom,
);

page('/:stateName',
  mapController.getState,
  mapController.checkUrlParamsForSelection,
  indexController.renderStateIndex,
  mapController.setStateBounds,
  mapController.webGlsupported,
  mapController.setborderListeners,
  indexController.renderDom,
);

page()