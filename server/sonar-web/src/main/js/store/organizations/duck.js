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
// @flow
import { combineReducers } from 'redux';
import omit from 'lodash/omit';
import uniq from 'lodash/uniq';
import without from 'lodash/without';

export type Organization = {
  avatar?: string,
  canAdmin?: boolean,
  description?: string,
  isDefault?: boolean,
  key: string,
  name: string,
  url?: string
};

type ReceiveOrganizationsAction = {
  type: 'RECEIVE_ORGANIZATIONS',
  organizations: Array<Organization>
};

type ReceiveMyOrganizationsAction = {
  type: 'RECEIVE_MY_ORGANIZATIONS',
  organizations: Array<Organization>
};

type CreateOrganizationAction = {
  type: 'CREATE_ORGANIZATION',
  organization: Organization
};

type UpdateOrganizationAction = {
  type: 'UPDATE_ORGANIZATION',
  key: string,
  changes: {}
};

type DeleteOrganizationAction = {
  type: 'DELETE_ORGANIZATION',
  key: string
};

type Action =
    ReceiveOrganizationsAction |
        ReceiveMyOrganizationsAction |
        CreateOrganizationAction |
        UpdateOrganizationAction |
        DeleteOrganizationAction;

type ByKeyState = {
  [key: string]: Organization
};

type MyState = Array<string>;

type State = {
  byKey: ByKeyState,
  my: MyState
};

export const receiveOrganizations = (organizations: Array<Organization>): ReceiveOrganizationsAction => ({
  type: 'RECEIVE_ORGANIZATIONS',
  organizations
});

export const receiveMyOrganizations = (organizations: Array<Organization>): ReceiveMyOrganizationsAction => ({
  type: 'RECEIVE_MY_ORGANIZATIONS',
  organizations
});

export const createOrganization = (organization: Organization): CreateOrganizationAction => ({
  type: 'CREATE_ORGANIZATION',
  organization
});

export const updateOrganization = (key: string, changes: {}): UpdateOrganizationAction => ({
  type: 'UPDATE_ORGANIZATION',
  key,
  changes
});

export const deleteOrganization = (key: string): DeleteOrganizationAction => ({
  type: 'DELETE_ORGANIZATION',
  key
});

const onReceiveOrganizations = (
  state: ByKeyState,
  action: ReceiveOrganizationsAction | ReceiveMyOrganizationsAction
): ByKeyState => {
  const nextState = { ...state };
  action.organizations.forEach(organization => {
    nextState[organization.key] = { ...state[organization.key], ...organization };
  });
  return nextState;
};

const byKey = (state: ByKeyState = {}, action: Action) => {
  switch (action.type) {
    case 'RECEIVE_ORGANIZATIONS':
    case 'RECEIVE_MY_ORGANIZATIONS':
      return onReceiveOrganizations(state, action);
    case 'CREATE_ORGANIZATION':
      return { ...state, [action.organization.key]: action.organization };
    case 'UPDATE_ORGANIZATION':
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          key: action.key,
          ...action.changes
        }
      };
    case 'DELETE_ORGANIZATION':
      return omit(state, action.key);
    default:
      return state;
  }
};

const my = (state: MyState = [], action: Action) => {
  switch (action.type) {
    case 'RECEIVE_MY_ORGANIZATIONS':
      return uniq([...state, ...action.organizations.map(o => o.key)]);
    case 'CREATE_ORGANIZATION':
      return uniq([...state, action.organization.key]);
    case 'DELETE_ORGANIZATION':
      return without(state, action.key);
    default:
      return state;
  }
};

export default combineReducers({ byKey, my });

export const getOrganizationByKey = (state: State, key: string): Organization => (
    state.byKey[key]
);

export const getMyOrganizations = (state: State): Array<Organization> => (
    state.my.map(key => getOrganizationByKey(state, key))
);

export const areThereCustomOrganizations = (state: State): boolean => (
    Object.keys(state.byKey).length > 1
);
