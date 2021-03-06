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
 * Browse repository CLM detail pages controller.
 * FIXME move this to proui
 *
 * @since 3.0
 */
Ext.define('NX.coreui.controller.BrowseRepositoryItemClm', {
  extend: 'Ext.app.Controller',

  views: [
    'repository.RepositoryBrowseItemClmLicense',
    'repository.RepositoryBrowseItemClmSecurity'
  ],

  /**
   * @override
   */
  init: function () {
    var me = this;

    me.getApplication().getIconController().addIcons({
      'repository-browse-item-clm-license': {
        file: 'medal_gold_1.png',
        variants: ['x16', 'x32']
      },
      'repository-browse-item-clm-security': {
        file: 'shield.png',
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

  onItemSelected: function (infoContainer, model) {
    var licensePanel = infoContainer.down('nx-coreui-repository-browse-item-clm-license'),
        securityPanel = infoContainer.down('nx-coreui-repository-browse-item-clm-security');

    if (!licensePanel) {
      licensePanel = infoContainer.addTab({ xtype: 'nx-coreui-repository-browse-item-clm-license' });
    }
    if (!securityPanel) {
      securityPanel = infoContainer.addTab({ xtype: 'nx-coreui-repository-browse-item-clm-security' });
    }

    licensePanel.down('#title').setText('License analysis of ' + model);
    securityPanel.down('#title').setText('Security issues of ' + model);
  },

  onItemDeselected: function (infoContainer) {
    var licensePanel = infoContainer.down('nx-coreui-repository-browse-item-clm-license'),
        securityPanel = infoContainer.down('nx-coreui-repository-browse-item-clm-security');

    if (licensePanel) {
      infoContainer.removeTab(licensePanel);
    }
    if (securityPanel) {
      infoContainer.removeTab(securityPanel);
    }
  }

});