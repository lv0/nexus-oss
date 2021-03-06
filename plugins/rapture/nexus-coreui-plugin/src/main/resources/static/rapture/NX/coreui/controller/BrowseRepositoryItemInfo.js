/*
 * Sonatype Nexus (TM) Open Source Version
 * Copyright (c) 2007-2013 Sonatype, Inc.
 * All rights reserved. Includes the third-party code listed at http://links.sonatype.com/products/nexus/oss/attributions.
 *
 * This program and the accompanying materials are made available under the terms of the Eclipse Public License Version 1.0,
 * which accompanies this distribution and is available at http://www.eclipse.org/legal/epl-v10.html.
 *
 * Sonatype Nexus (TM) Professional Version is available from Sonatype, Inc. "Sonatype" and "Sonatype Nexus" are trademarks
 * of Sonatype, Inc. Apache Maven is a trademark of the Apache Software Foundation. M2eclipse is a trademark of the
 * Eclipse Foundation. All other trademarks are the property of their respective owners.
 */
/**
 * Browse repository information page controller.
 *
 * @since 3.0
 */
Ext.define('NX.coreui.controller.BrowseRepositoryItemInfo', {
  extend: 'Ext.app.Controller',

  views: [
    'repository.RepositoryBrowseItemInfo'
  ],

  /**
   * @override
   */
  init: function () {
    var me = this;

    me.getApplication().getIconController().addIcons({
      'repository-browse-item-info': {
        file: 'information.png',
        variants: ['x16', 'x32']
      }
    });

    me.listen({
      component: {
        'nx-coreui-repository-itemcontainer': {
          itemselected: me.onItemSelected,
          itemdeselected: me.onItemDeselected
        }
      }
    });
  },

  onItemSelected: function (infoContainer, node) {
    var panel = infoContainer.down('nx-coreui-repository-browse-item-info');

    if (!panel) {
      panel = infoContainer.addTab({ xtype: 'nx-coreui-repository-browse-item-info' });
    }

    panel.down('#title').setText('Information about ' + node.get('text'));

    NX.direct.coreui_RepositoryStorageItemInfo.read(node.get('repositoryId'), node.get('path'), function (response) {
      if (Ext.isDefined(response) && response.success) {
        panel.down('nx-info-panel').showInfo({
          'Path': response.data.path,
          'Size': response.data.size ? response.data.size + ' bytes' : null,
          'Created': NX.util.DateFormat.timestamp(response.data.created),
          'Modified': NX.util.DateFormat.timestamp(response.data.modified),
          'SHA-1': response.data.sha1,
          'MD5': response.data.md5
        });
      }
    });
  },

  onItemDeselected: function (infoContainer) {
    var panel = infoContainer.down('nx-coreui-repository-browse-item-info');

    if (panel) {
      infoContainer.removeTab(panel);
    }
  }

});