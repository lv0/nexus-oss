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
 * Security settings related controller.
 *
 * @since 3.0
 */
Ext.define('NX.coreui.controller.Security', {
  extend: 'Ext.app.Controller',
  mixins: {
    logAware: 'NX.LogAware'
  },

  views: [
    'security.Anonymous',
    'security.SecurityRealms'
  ],

  stores: [
    'RealmType'
  ],

  refs: [
    { ref: 'securityRealms', selector: 'nx-coreui-security-realms' }
  ],

  /**
   * @override
   */
  init: function () {
    var me = this;

    me.getApplication().getIconController().addIcons({
      'feature-security-realms': {
        file: 'shield.png',
        variants: ['x16', 'x32']
      }
    });

    me.getApplication().getFeaturesController().registerFeature([
      {
        mode: 'admin',
        path: '/Security',
        view: 'NX.view.feature.Group',
        iconConfig: {
          file: 'security.png',
          variants: ['x16', 'x32']
        },
        weight: 90,
        visible: function () {
          return NX.Permissions.check('nexus:settings', 'read');
        }
      },
      {
        mode: 'admin',
        path: '/Security/Anonymous',
        view: 'NX.coreui.view.security.Anonymous',
        iconConfig: {
          file: 'user_silhouette.png',
          variants: ['x16', 'x32']
        },
        visible: function () {
          return NX.Permissions.check('nexus:settings', 'read');
        }
      },
      {
        mode: 'admin',
        path: '/Security/Realms',
        view: { xtype: 'nx-coreui-security-realms' },
        visible: function () {
          return NX.Permissions.check('nexus:settings', 'read');
        }
      }
    ]);

    me.listen({
      controller: {
        '#Refresh': {
          refresh: me.loadRelatedStores
        }
      },
      component: {
        'nx-coreui-security-realms': {
          beforerender: me.loadRelatedStores
        }
      }
    });
  },

  loadRelatedStores: function () {
    var me = this,
        securityRealms = me.getSecurityRealms();

    if (securityRealms) {
      me.getRealmTypeStore().load();
    }
  }

});