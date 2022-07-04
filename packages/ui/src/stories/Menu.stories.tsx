import { Meta } from '@storybook/react'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Menu, MenuItem, MenuItemTitle } from '../Menu'
import { Button } from '../Button'
import { Colors } from '../styles/colors'
import { Icon } from '../Icon'
import { BoxLayout, StackLayout } from '../Layouts'
import { Toggle } from '../Toggle'

export default {
  title: 'Components/Menu',
  component: Menu,
} as Meta

export const LeftMenu = () => {
  const [closeMenu, setCloseMenu] = useState(false)
  const handleClose = () => {
    setCloseMenu(false)
  }

  return (
    <Wrapper align="flex-start">
      <Menu
        left
        bottom
        positionOffset={{ top: 5, left: 0 }}
        forceClose={closeMenu}
        onClose={handleClose}
        toggler={
          <Button appearance="primary-ghost" variant="medium" size="medium">
            <>
              Oxfd...586c
              <BoxLayout gap={0.75}>
                <Icon name="arrow-down" color="white" />
              </BoxLayout>
            </>
          </Button>
        }
        field={
          <StackLayout>
            <MenuItemTitle type="heading 3">Oxfd...586c</MenuItemTitle>

            <MenuItem
              appearance="text"
              variant="large"
              size="large"
              onClick={() => setCloseMenu(true)}
            >
              View on explorer
            </MenuItem>
            <MenuItem
              appearance="text"
              variant="large"
              size="large"
              onClick={() => setCloseMenu(true)}
              isLastItem
            >
              Disconnect wallet
            </MenuItem>
          </StackLayout>
        }
      />
    </Wrapper>
  )
}

export const RightMenu = () => {
  const [closeMenu, setCloseMenu] = useState(false)
  const [darkMode, toggleDarkMode] = useState(false)
  const [testnetMode, toggleTestnetMode] = useState(false)

  return (
    <Wrapper align="flex-end">
      <Menu
        bottom
        forceClose={closeMenu}
        onClose={() => setCloseMenu(false)}
        positionOffset={{ top: 5, left: 35 }}
        toggler={
          <Button
            appearance="primary-ghost"
            variant="medium"
            size="medium"
            icon="settings"
          />
        }
        field={
          <StackLayout>
            <MenuItemTitle type="heading 3">Global settings</MenuItemTitle>
            <MenuItem
              appearance="text"
              variant="large"
              size="large"
              onClick={() => toggleDarkMode(!darkMode)}
            >
              <>
                Dark mode
                <Toggle
                  checked={darkMode}
                  styleProps={{ width: 50, paddingTop: 2 }}
                />
              </>
            </MenuItem>
            <MenuItem
              appearance="text"
              variant="large"
              size="large"
              onClick={() => toggleTestnetMode(!testnetMode)}
            >
              <>
                Testnet mode
                <Toggle
                  checked={testnetMode}
                  styleProps={{ width: 50, paddingTop: 2 }}
                />
              </>
            </MenuItem>
          </StackLayout>
        }
      />
    </Wrapper>
  )
}

LeftMenu.storyName = 'Left menu'
RightMenu.storyName = 'Right menu'

const Wrapper = styled(BoxLayout)<{ align: string }>`
  background: ${Colors.light.buttonDark};
  justify-content: ${({ align }) => align};
  display: flex;
`
