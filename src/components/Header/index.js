/* eslint-disable no-undef */
import React, { Component } from 'react';
import { find } from 'lodash';
import {
  Button,
  Menu,
  Icon
} from 'antd';
import classNames from 'classnames';
import { MENU_MAP, STATE_LEGISLATURES_MENU, MISSING_MEMBER_LINK } from './menuConstants';

const { SubMenu } = Menu;

import './style.less';
import ImageModal from './Modal';

class Header extends Component {
  constructor(props) {
    super(props)
    this.handleMenuSelect = this.handleMenuSelect.bind(this);
    this.hasSubMenu = this.hasSubMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.state = {
      activeKey: "",
    }
  }

  componentDidUpdate(prevProps) {
    const { hash } = this.props;
    if (hash && hash !== prevProps.hash) {
      MENU_MAP.forEach((subMenu, key) => {
        const menu = find(subMenu, {
            link: hash
        })
        if (menu) {
          this.setState({ activeKey : key})
        }
      })
    }

  }

  hasSubMenu(key) {
    const keyToCheck = key || this.state.activeKey;
    const subMenu = MENU_MAP.get(keyToCheck);
    return subMenu && subMenu.length;
  }

  closeMenu() {
    this.setState({activeKey: ''})
  }

  handleMenuSelect(refObj) {
    const { key } = refObj;
    if (this.hasSubMenu(key) && key !== this.state.activeKey) {
      this.setState({activeKey: key })
    } else {
      this.setState({activeKey: ''})
    }
  }

  renderLink(menuItem) {
    if (!menuItem.link) {
      return menuItem.display
    }
    if (menuItem.external) {
      return (
            <a 
            className={classNames(["menu-link"])}
            target="_blank"
            href={menuItem.link}
          >{menuItem.display}</a>
      )
    }
    return (
          <a 
            className={classNames(["menu-link", "hash-link"])}
            data-toggle="tab"
            href={`#${menuItem.link}`}
            onClick={() => location.hash = `#${menuItem.link}`}
          >{menuItem.display}</a>
    )

  }

  renderDropdown() {
    const { activeKey } = this.state;
    const { setLocation, hash } = this.props;
    const subMenu = MENU_MAP.get(activeKey);
    if (this.hasSubMenu()) {
      return subMenu.map((menuItem) => {
         if (menuItem.display === 'State Legislatures') {
           return (
             <SubMenu
               className="state-legislatures-menu fade-in"
               key={menuItem.display}
               title={
                 <span className="state-legislatures-title">
                   {menuItem.display}
                 </span>
               }
             >
               {
                 STATE_LEGISLATURES_MENU.map((stateName) => {
                   const linkName = stateName.toLowerCase().replace(' ', '-');
                   return (
                     <Menu.Item key={stateName} onClick={() => setLocation(stateName.toLowerCase())}>
                       <a href={`/${linkName}`} style={{ textDecoration: 'none' }}>{stateName}</a>
                     </Menu.Item>
                   )
                 })
               }
             </SubMenu>
           )
         } 
         if (menuItem.type === 'modal') {
           return (
             <ImageModal
                hash={hash}
                menuItem={menuItem}
                setHash={this.props.setHash}
             />
           )
         }
        return (
          <Menu.Item 
            className={classNames(["fade-in", {'submenu-item-selected' : hash === menuItem.link && !menuItem.external }])}
            key={menuItem.display}
            onClick={() => !menuItem.external ? this.props.setHash(menuItem.link) : undefined}
          >
            { 
              this.renderLink(menuItem)
            }
          </Menu.Item>
        )
         
     })
    } 
  }

  render() {
    const arrowClasses = ['arrow', 'fade-in'];
    const { activeKey } = this.state;
    const {
      setLocation
    } = this.props;
    return (
      <div className="menu-container">
        <Menu
          className="main-nav-menu"
          mode="horizontal"
          overflowedIndicator={<Button icon="menu" type="primary" />}
          style={{ lineHeight: '60px' }}
          onClick={this.handleMenuSelect}
        >
          <Menu.Item key="home" onClick={() => setLocation('')}>
            <a data-toggle="tab" href="#home" className={classNames("navbar-brand","hash-link","brand-icon")}>
              <img src="/Images/THP_logo_horizontal_simple.png" alt=""></img>
            </a>
          </Menu.Item>
          <Menu.Item key="submit-event">
            <a href={`#submit`} style={{ textDecoration: 'none' }} data-toggle="tab" className="hash-link">Submit an Event</a>
          </Menu.Item>
          <Menu.Item key="take-action">
            Take Action
            <div className={classNames(arrowClasses, {active : activeKey === 'take-action'})}></div>
          </Menu.Item>
          <Menu.Item key="our-projects">
            Our Projects
            <div className={classNames(arrowClasses, {active : activeKey === 'our-projects'})}></div>
          </Menu.Item>
          <Menu.Item key="learn-more">
            Learn More
            <div className={classNames(arrowClasses, {active : activeKey === 'learn-more'})}></div>
          </Menu.Item>
          <Menu.Item key="2019-review" style={{color: 'red'}}>
            <Icon type="bank" theme="filled" />
            2019 In Review
            <div className={classNames(arrowClasses, {active : activeKey === '2019-review'})}></div>
          </Menu.Item>
          <div key="donate" className="donate-btn">
            <Button
              type="danger"
              shape="round"
              size="large"
              href="https://secure.actblue.com/donate/townhallproject2019"
              target="_blank"
            >
              Donate Now
            </Button>
          </div>
        </Menu>
        <Menu 
          className={`submenu-${this.hasSubMenu() ? 'active' : 'hidden'}`}
          mode="horizontal"
          overflowedIndicator={<Button type="ghost">More<Icon type="down"/></Button>}
        >
          {this.renderDropdown()}
        </Menu>

      </div>
    )
  }
}

export default Header;
