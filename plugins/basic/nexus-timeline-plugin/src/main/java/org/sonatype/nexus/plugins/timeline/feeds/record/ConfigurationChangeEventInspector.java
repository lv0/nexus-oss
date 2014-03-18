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

package org.sonatype.nexus.plugins.timeline.feeds.record;

import java.util.HashSet;

import javax.inject.Named;
import javax.inject.Singleton;

import org.sonatype.nexus.configuration.Configurable;
import org.sonatype.nexus.configuration.ConfigurationChangeEvent;
import org.sonatype.nexus.events.Asynchronous;
import org.sonatype.nexus.events.EventSubscriber;
import org.sonatype.nexus.plugins.timeline.feeds.FeedRecorder;

import com.google.common.eventbus.AllowConcurrentEvents;
import com.google.common.eventbus.Subscribe;

/**
 * @author Juven Xu
 */
@Named
@Singleton
public class ConfigurationChangeEventInspector
    extends AbstractFeedRecorderEventInspector
    implements EventSubscriber, Asynchronous
{
  @Subscribe
  @AllowConcurrentEvents
  public void inspectForNexus(final ConfigurationChangeEvent event) {
    if (event.getChanges().isEmpty()) {
      return;
    }

    StringBuilder msg = new StringBuilder();

    msg.append("Nexus server configuration was changed: ");

    // keep list unique, one component might be reported multiple times
    final HashSet<String> changes = new HashSet<String>();
    for (Configurable changed : event.getChanges()) {
      changes.add(changed.getName());
    }
    msg.append(changes.toString());

    if (event.getUserId() != null) {
      msg.append(", change was made by [" + event.getUserId() + "]");
    }

    getFeedRecorder().addSystemEvent(FeedRecorder.SYSTEM_CONFIG_ACTION, msg.toString());
  }
}
