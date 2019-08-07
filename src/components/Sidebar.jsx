import React from 'react'
import Icon from 'cozy-ui/react/Icon'
import { translate } from 'cozy-ui/react/I18n'
import { NavLink } from 'react-router-dom'

export const Sidebar = ({ t }) => (
  <aside className="o-sidebar">
    <nav>
      <ul className="c-nav">
        <li className="c-nav-item">
          <NavLink
            to="/home"
            className="c-nav-link"
            activeClassName="is-active"
          >
            <Icon className="c-nav-icon" icon="help" />
            {t('Nav.home')}
          </NavLink>
        </li>
        <li className="c-nav-item">
          <NavLink
            to="/create"
            className="c-nav-link"
            activeClassName="is-active"
          >
            <Icon className="c-nav-icon" icon="spinner" />
            {t('Nav.create')}
          </NavLink>
        </li>
        <li className="c-nav-item">
          <NavLink
            to="/results"
            className="c-nav-link"
            activeClassName="is-active"
          >
            <Icon className="c-nav-icon" icon="clock" />
            {t('Nav.results')}
          </NavLink>
        </li>
      </ul>
    </nav>
  </aside>
)

// translate() provide t() to use translations (ex: locales/en.json)
export default translate()(Sidebar)
