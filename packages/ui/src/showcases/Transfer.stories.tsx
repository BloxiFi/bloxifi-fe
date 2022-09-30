import React, { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { AddressInput } from '../AddressInput'
import { BaseInput } from '../BaseInput'
import { Button } from '../Button'
import { Icon } from '../Icon'
import {
  BoxLayout,
  CardLayout,
  ColumnLayout,
  GridLayout,
  PageLayout,
  StackLayout,
  usePageLayout,
} from '../Layouts'
import { Menu, MenuItem } from '../Menu'
import { ColumnData, Table } from '../Table'
import { Text } from '../Text'

export default {
  title: 'Showcases/Transfer',
}

export const Overview = args => {
  const nav = usePageLayout()
  const { setHeader } = nav

  useEffect(() => {
    if (args.header) {
      setHeader(
        <PageLayout.Header
          navigationItems={[
            { to: '/', label: 'Dashboard' },
            { to: '/deposit', label: 'Deposit & Borrow' },
            { to: '/moreInformation', label: 'More information' },
            { to: '/transfer', label: 'Token Transfer' },
          ]}
        >
          <Button variant="medium" appearance="primary-ghost" size="medium">
            Blox Balance
          </Button>

          <Button
            appearance="primary-ghost"
            variant="medium"
            size="medium"
            icon="metamask"
          />
          <Button
            appearance="primary-ghost"
            variant="medium"
            size="medium"
            icon="polkadot"
          />
        </PageLayout.Header>,
      )
    } else {
      setHeader(null)
    }
  }, [args.header, setHeader])

  const tokens = ['MOVR', 'KAR', 'aUSD', 'KSM']
  const chains = ['Moonriver', 'Karura', 'Kusama']

  const [closeMenu, setCloseMenu] = useState(false)
  const [selectedToken, setSelectedToken] = useState(tokens[0])
  const [selectedOrigin, setSelectedOrigin] = useState(chains[0])
  const [selectedDestination, setSelectedDestination] = useState(chains[1])

  const handleClose = () => {
    setCloseMenu(false)
  }

  const columns = {
    asset: {
      header: '',
      Cell: ({ data: { icon, name } }: any) => (
        <ColumnLayout gap={1.5}>
          <Icon size={40} name={icon} />{' '}
          <Text as="span" type="body 2">
            {name}
          </Text>
        </ColumnLayout>
      ),
      alignText: 'left',
    },
    value: {
      header: '',
      Cell: ({ data: { symbol, value } }) => (
        <Text as="span" type="body 2">
          {value}
          {symbol}
        </Text>
      ),
      alignText: 'right',
    },
  } as Record<string, ColumnData>

  const data = [
    { icon: 'dai', name: 'Moonbeam GLMR', value: 1000, symbol: 'GLMR' },
    { icon: 'dai', name: 'Acala ACA', value: 0, symbol: 'xcACA' },
    { icon: 'dai', name: 'Acala AUSD ', value: 0, symbol: 'xcaUSD' },
    { icon: 'dai', name: 'Parallei PARA ', value: 0, symbol: 'xcPARA' },
    { icon: 'dai', name: 'Polkadot DOT ', value: 0, symbol: 'xcDOT' },
  ]
  return (
    <BrowserRouter>
      <PageLayout {...nav}>
        <PageLayout.Section>
          <GridLayout>
            <GridLayout.Column span={6}>
              <CardLayout>
                <BoxLayout gap={2}>
                  <StackLayout gap={1.875}>
                    <ColumnLayout center gap={2} align="space-between">
                      <StackLayout gap={0.625}>
                        <Text color="oxfordBlue" type="heading 3">
                          Origin Chain
                        </Text>
                        <Menu
                          left
                          bottom
                          positionOffset={{ top: 5, left: 0 }}
                          forceClose={closeMenu}
                          onClose={handleClose}
                          toggler={
                            <Button
                              appearance="secondary"
                              variant="large"
                              size="medium"
                            >
                              <>
                                <BoxLayout gap={0.5}>
                                  <Icon
                                    name="dai"
                                    color="oxfordBlue"
                                    size={40}
                                  />
                                </BoxLayout>
                                <Text as="span" type="body 2">
                                  {selectedOrigin}
                                </Text>

                                <BoxLayout gap={0.75}>
                                  <Icon name="arrow-down" color="oxfordBlue" />
                                </BoxLayout>
                              </>
                            </Button>
                          }
                          field={
                            <StackLayout>
                              {chains.map(token => (
                                <MenuItem
                                  key={token}
                                  appearance="text"
                                  variant="medium"
                                  size="large"
                                  onClick={() => setSelectedOrigin(token)}
                                  className="u-full-width"
                                >
                                  <ColumnLayout
                                    className="u-full-width"
                                    align="space-between"
                                  >
                                    <Icon
                                      name="dai"
                                      color="oxfordBlue"
                                      size={20}
                                    />
                                    <Text type="body 2">{token}</Text>
                                  </ColumnLayout>
                                </MenuItem>
                              ))}
                            </StackLayout>
                          }
                        />
                      </StackLayout>
                      <Icon size={40} name="transfer" />

                      <StackLayout gap={0.625}>
                        <Text color="oxfordBlue" type="heading 3">
                          Destination Chain
                        </Text>
                        <Menu
                          left
                          bottom
                          positionOffset={{ top: 5, left: 0 }}
                          forceClose={closeMenu}
                          onClose={handleClose}
                          toggler={
                            <Button
                              appearance="secondary"
                              variant="large"
                              size="medium"
                            >
                              <>
                                <BoxLayout gap={0.75}>
                                  <Icon
                                    name="dai"
                                    color="oxfordBlue"
                                    size={40}
                                  />
                                </BoxLayout>
                                <Text as="span" type="body 2">
                                  {selectedDestination}
                                </Text>
                                <BoxLayout gap={0.75}>
                                  <Icon name="arrow-down" color="oxfordBlue" />
                                </BoxLayout>
                              </>
                            </Button>
                          }
                          field={
                            <StackLayout>
                              {chains.map(token => (
                                <MenuItem
                                  key={token}
                                  appearance="text"
                                  variant="large"
                                  size="large"
                                  onClick={() => setSelectedDestination(token)}
                                  className="u-full-width"
                                >
                                  <ColumnLayout
                                    className="u-full-width"
                                    align="space-between"
                                  >
                                    <Icon
                                      name="dai"
                                      color="oxfordBlue"
                                      size={20}
                                    />
                                    <Text type="body 2">{token}</Text>
                                  </ColumnLayout>
                                </MenuItem>
                              ))}
                            </StackLayout>
                          }
                        />
                      </StackLayout>
                    </ColumnLayout>

                    <StackLayout gap={0.625}>
                      <Text color="oxfordBlue" type="heading 3">
                        Origin account
                      </Text>
                      <AddressInput
                        className="u-full-width"
                        name="originChain"
                        value=""
                        networkName=""
                        icon={undefined}
                      />
                    </StackLayout>
                    <StackLayout gap={1}>
                      <StackLayout gap={0.625}>
                        <Text color="oxfordBlue" type="heading 3">
                          Destination account
                        </Text>
                        <AddressInput
                          className="u-full-width"
                          name="destinationChain"
                          value=""
                          networkName=""
                          icon={undefined}
                        />
                      </StackLayout>

                      <StackLayout gap={3.315}>
                        <StackLayout gap={0.5}>
                          <ColumnLayout align="space-between">
                            <Text as="span" color="oxfordBlue" type="heading 3">
                              Amount
                            </Text>
                            <Text as="span" color="oxfordBlue" type="body 1">
                              0 (in Moonbeam)
                            </Text>
                          </ColumnLayout>

                          <ColumnLayout gap={2} align="space-between">
                            <ColumnLayout className="u-full-width">
                              <BaseInput
                                className="u-full-width"
                                width="100%"
                                type="number"
                                name="assetAmount"
                                value=""
                                height="large"
                              />
                              <Button
                                appearance="secondary"
                                variant="large"
                                size="small"
                                className="u-fit-content-width"
                              >
                                MAX
                              </Button>
                            </ColumnLayout>
                            <Menu
                              left
                              bottom
                              positionOffset={{ top: 5, left: 0 }}
                              forceClose={closeMenu}
                              onClose={handleClose}
                              toggler={
                                <Button
                                  appearance="secondary"
                                  variant="large"
                                  size="small"
                                >
                                  <>
                                    <Text as="span" type="body 2">
                                      {selectedToken}
                                    </Text>
                                    <BoxLayout gap={0.75}>
                                      <Icon
                                        name="arrow-down"
                                        color="oxfordBlue"
                                      />
                                    </BoxLayout>
                                  </>
                                </Button>
                              }
                              field={
                                <StackLayout>
                                  {tokens.map(token => (
                                    <MenuItem
                                      key={token}
                                      appearance="text"
                                      variant="large"
                                      size="large"
                                      onClick={() => setSelectedToken(token)}
                                      className="u-full-width"
                                    >
                                      <Text type="body 2">{token}</Text>
                                    </MenuItem>
                                  ))}
                                </StackLayout>
                              }
                            />
                          </ColumnLayout>
                        </StackLayout>

                        <Button
                          className="u-full-width"
                          appearance="dark"
                          size="large"
                          variant="large"
                        >
                          Transfer
                        </Button>
                      </StackLayout>
                    </StackLayout>
                  </StackLayout>
                  <BoxLayout gap={2.315} />
                </BoxLayout>
              </CardLayout>
            </GridLayout.Column>
            <GridLayout.Column span={6}>
              <CardLayout>
                <Table
                  columns={columns}
                  data={data}
                  titleComponent={
                    <>
                      <Text as="span" type="heading 2">
                        Cross Chain Assets
                      </Text>
                      <BoxLayout gap={1.15} />
                    </>
                  }
                  columnSpacing
                  compact
                />
                <BoxLayout gap={3.25} />
              </CardLayout>
            </GridLayout.Column>
          </GridLayout>
        </PageLayout.Section>
      </PageLayout>
    </BrowserRouter>
  )
}

Overview.args = { header: true }
