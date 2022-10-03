import React, { useState, useEffect } from 'react'
import {
  AddressInput,
  BaseInput,
  BoxLayout,
  Button,
  CardLayout,
  ColumnLayout,
  Icon,
  Menu,
  MenuItem,
  StackLayout,
  Text,
} from '@bloxifi/ui'
import { useTranslation } from 'react-i18next'

const TransferAsset = () => {
  const { t } = useTranslation()

  const tokens = ['MOVR', 'KAR', 'aUSD', 'KSM']
  const chains = ['Moonriver', 'Karura', 'Kusama']
  const DEFAULT_ORIGIN_CHAIN = 'Moonriver'
  const DEFAULT_DESTINATION_CHAIN = 'Karura'
  const DEFAULT_TOKEN = 'MOVR'

  type SelectedChain = 'Moonriver' | 'Karura' | 'Kusama'
  type SelectedToken = 'MOVR' | 'KAR' | 'aUSD' | 'KSM'

  const [closeMenu, setCloseMenu] = useState(false)
  const [selectedToken, setSelectedToken] = useState(DEFAULT_TOKEN)
  const [selectedOrigin, setSelectedOrigin] = useState(DEFAULT_ORIGIN_CHAIN)
  const [selectedDestination, setSelectedDestination] = useState(
    DEFAULT_DESTINATION_CHAIN,
  )
  const [allowedTokens, setAllowedTokens] = useState([])

  const handleClose = () => {
    setCloseMenu(false)
  }

  const handleOriginChange = (originChain: SelectedChain) => {
    setSelectedOrigin(originChain)
    if (originChain === 'Moonriver') {
      setSelectedDestination(DEFAULT_DESTINATION_CHAIN)
    } else {
      setSelectedDestination('Moonriver')
    }
  }

  const handleDestinationChange = (destinationChain: SelectedChain) => {
    setSelectedDestination(destinationChain)
    if (destinationChain === 'Moonriver') {
      setSelectedOrigin(DEFAULT_DESTINATION_CHAIN)
    } else {
      setSelectedOrigin('Moonriver')
    }
  }

  const handleSwapButtonClick = () => {
    setSelectedOrigin(selectedDestination)
    setSelectedDestination(selectedOrigin)
  }

  useEffect(() => {
    /**  Allowed tokens for Moonriver<>Kusama => KSM */
    if (selectedDestination === 'Kusama' || selectedOrigin === 'Kusama') {
      setAllowedTokens(['KSM'])
      setSelectedToken('KSM')
    } else {
      /** Allowed tokens for Moonriver<>Karura => MOVR,KAR,aUSD */
      setAllowedTokens(['MOVR', 'KAR', 'aUSD'])
      setSelectedToken(DEFAULT_TOKEN)
    }
  }, [selectedDestination, selectedOrigin])

  return (
    <CardLayout>
      <BoxLayout gap={2}>
        <StackLayout gap={1.875}>
          <ColumnLayout center gap={2} align="space-between">
            <StackLayout gap={0.625}>
              <Text color="oxfordBlue" type="heading 3">
                {t('transfer.originChain')}
              </Text>
              <Menu
                left
                bottom
                positionOffset={{ top: 5, left: 0 }}
                forceClose={closeMenu}
                onClose={handleClose}
                toggler={
                  <Button appearance="secondary" variant="large" size="medium">
                    <>
                      <BoxLayout gap={0.5}>
                        <Icon name="dai" color="oxfordBlue" size={40} />
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
                    {chains.map((chain: SelectedChain) => (
                      <MenuItem
                        key={chain}
                        appearance="text"
                        variant="medium"
                        size="large"
                        onClick={() => handleOriginChange(chain)}
                        className="u-full-width"
                        disabled={chain === selectedOrigin}
                      >
                        <ColumnLayout
                          className="u-full-width"
                          align="space-between"
                        >
                          <Icon name="dai" color="oxfordBlue" size={20} />
                          <Text type="body 2">{chain}</Text>
                        </ColumnLayout>
                      </MenuItem>
                    ))}
                  </StackLayout>
                }
              />
            </StackLayout>
            <Icon onClick={handleSwapButtonClick} size={40} name="transfer" />

            <StackLayout gap={0.625}>
              <Text color="oxfordBlue" type="heading 3">
                {t('transfer.destinationChain')}
              </Text>
              <Menu
                left
                bottom
                positionOffset={{ top: 5, left: 0 }}
                forceClose={closeMenu}
                onClose={handleClose}
                toggler={
                  <Button appearance="secondary" variant="large" size="medium">
                    <>
                      <BoxLayout gap={0.75}>
                        <Icon name="dai" color="oxfordBlue" size={40} />
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
                    {chains.map((chain: SelectedChain) => (
                      <MenuItem
                        key={chain}
                        appearance="text"
                        variant="large"
                        size="large"
                        onClick={() => handleDestinationChange(chain)}
                        className="u-full-width"
                        disabled={chain === selectedDestination}
                      >
                        <ColumnLayout
                          className="u-full-width"
                          align="space-between"
                        >
                          <Icon name="dai" color="oxfordBlue" size={20} />
                          <Text type="body 2">{chain}</Text>
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
              {t('transfer.originAccount')}
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
                {t('transfer.destinationAccount')}
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
                    {t('global.inputs.amount')}
                  </Text>
                  <Text as="span" color="oxfordBlue" type="body 1">
                    0 ( {t('transfer.inNetworkLabel', { network: 'Moonbeam' })})
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
                            <Icon name="arrow-down" color="oxfordBlue" />
                          </BoxLayout>
                        </>
                      </Button>
                    }
                    field={
                      <StackLayout>
                        {tokens.map((token: SelectedToken) => (
                          <MenuItem
                            key={token}
                            appearance="text"
                            variant="large"
                            size="large"
                            onClick={() => setSelectedToken(token)}
                            className="u-full-width"
                            disabled={!allowedTokens.includes(token)}
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
                {t('global.buttons.transfer')}
              </Button>
            </StackLayout>
          </StackLayout>
        </StackLayout>
        <BoxLayout gap={2.315} />
      </BoxLayout>
    </CardLayout>
  )
}
export default TransferAsset
