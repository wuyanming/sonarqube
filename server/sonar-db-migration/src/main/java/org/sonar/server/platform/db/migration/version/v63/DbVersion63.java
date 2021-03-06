/*
 * SonarQube
 * Copyright (C) 2009-2016 SonarSource SA
 * mailto:contact AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
package org.sonar.server.platform.db.migration.version.v63;

import java.util.stream.Stream;
import org.sonar.server.platform.db.migration.step.MigrationStepRegistry;
import org.sonar.server.platform.db.migration.version.DbVersion;

public class DbVersion63 implements DbVersion {
  @Override
  public Stream<Object> getSupportComponents() {
    return Stream.of(DefaultOrganizationUuidImpl.class);
  }

  @Override
  public void addSteps(MigrationStepRegistry registry) {
    registry
      .add(1500, "Add Events.UUID", AddUuidToEvents.class)
      .add(1501, "Populate Events.UUID", PopulateUuidColumnOfEvents.class)
      .add(1502, "Make Events.UUID not nullable", MakeUuidNotNullOnEvents.class)
      .add(1503, "Add PROJECTS.ORGANIZATION_UUID", AddOrganizationUuidToProjects.class)
      .add(1504, "Populate PROJECTS.ORGANIZATION_UUID", PopulateOrganizationUuidToProjects.class)
      .add(1505, "Make PROJECTS.ORGANIZATION_UUID not nullable", MakeOrganizationUuidOfProjectsNotNullable.class)
      .add(1506, "Add index on PROJECTS.ORGANIZATION_UUID", AddIndexOnOrganizationUuidOfProjects.class)
      .add(1507, "Drop table RESOURCE_INDEX", DropTableResourceIndex.class)
      .add(1508, "Add columns ORGANIZATIONS.DEFAULT_PERM_TEMPLATE_*", AddDefaultPermTemplateColumnsToOrganizations.class)
      .add(1509, "Populate columns ORGANIZATIONS.DEFAULT_PERM_TEMPLATE_*", PopulateDefaultPermTemplateColumnsOfOrganizations.class);
  }
}
