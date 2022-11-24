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
import {
  getNetworkByName,
  sliceMiddleOfString,
  SupportedNetwork,
  toCapitalize,
  useWalletBalance,
  //TokenBalanceData,
} from '@bloxifi/core'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { TokenTransfer } from '@bloxifi/core/src/hooks/tokenTransfer'

import { Web3Container } from '@/containers/Web3Container'
import { Web3PolkadotContainer } from '@/containers/Web3PolkadotContainer'

//type Props = {
//  balances: TokenBalanceData[]
//}

const TransferAsset = () => {
  const { t } = useTranslation()
  const {
    state: {
      currentAccount,
      isSupportedNetwork: isSupportedNetworkEVM,
      signer,
    },
  } = Web3Container.useContainer()
  const {
    state: { currentAccountPolkadot, isPolkadotEnabled },
  } = Web3PolkadotContainer.useContainer()

  const tokens = ['MOVR', 'KAR', 'aUSD', 'KSM']
  const allowedChains = ['moonriver', 'karura', 'kusama']
  const chains = allowedChains.map((chain: SupportedNetwork['network']) =>
    getNetworkByName(chain),
  )

  /**
   * DEFAULT_ORIGIN_CHAIN represents default selected origin chain
   * One of the origin and destination chains must be DEFAULT_ORIGIN_CHAIN
   */
  const DEFAULT_ORIGIN_CHAIN = 'moonriver'
  const DEFAULT_DESTINATION_CHAIN = 'karura'
  const DEFAULT_TOKEN = 'MOVR'

  const DEFAULT_ORIGIN = getNetworkByName(DEFAULT_ORIGIN_CHAIN)
  const DEFAULT_DESTINATION = getNetworkByName(DEFAULT_DESTINATION_CHAIN)

  type SelectedToken = 'MOVR' | 'KAR' | 'aUSD' | 'KSM'

  const [closeMenu, setCloseMenu] = useState(false)
  const [selectedToken, setSelectedToken] = useState(DEFAULT_TOKEN)
  const [selectedOrigin, setSelectedOrigin] =
    useState<SupportedNetwork>(DEFAULT_ORIGIN)
  const [selectedDestination, setSelectedDestination] =
    useState<SupportedNetwork>(DEFAULT_DESTINATION)
  const [allowedTokens, setAllowedTokens] = useState([])

  const [maxAmount, setMaxAmount] = useState(0)
  const { balances } = useWalletBalance({
    //, isLoading, fetchBalances
    currentAccount,
    currentChainId: selectedOrigin.prefix,
    currentNetwork: selectedOrigin,
  })

  const handleClose = () => {
    setCloseMenu(false)
  }

  const calculateMaxAmountEVM = async () => {
    //console.log('metamask balance ', selectedToken)
    //console.log(balances, typeof(balances))
    const am = balances
      .filter(tok => tok.tokenOriginSymbol == selectedToken.toUpperCase())
      .map(filteredToken => filteredToken.tokenBalance)
    setMaxAmount(am[0])
    await setFieldValue('assetAmount', am[0], true)
    await setFieldTouched('assetAmount', true, true)
  }

  const calculateMaxAmountPolkadot = () => {
    //console.log('polkadot balance', selectedToken)
  }

  const handleMaxClick = async () => {
    if (selectedOrigin.network === DEFAULT_ORIGIN_CHAIN) {
      await calculateMaxAmountEVM()
    } else {
      calculateMaxAmountPolkadot()
    }
  }

  const handleOriginChange = (originChain: SupportedNetwork) => {
    setSelectedOrigin(originChain)
    if (originChain.network === DEFAULT_ORIGIN_CHAIN) {
      setSelectedDestination(DEFAULT_DESTINATION)
    } else {
      setSelectedDestination(DEFAULT_ORIGIN)
    }
  }

  const handleDestinationChange = (destinationChain: SupportedNetwork) => {
    setSelectedDestination(destinationChain)
    if (destinationChain.network === DEFAULT_ORIGIN_CHAIN) {
      setSelectedOrigin(DEFAULT_DESTINATION)
    } else {
      setSelectedOrigin(DEFAULT_ORIGIN)
    }
  }

  const handleSwapButtonClick = () => {
    setSelectedOrigin(selectedDestination)
    setSelectedDestination(selectedOrigin)
  }

  const handleTransferClick = async (amountToSend: string) => {
    const transaction = await TokenTransfer(
      toCapitalize(selectedOrigin.network),
      toCapitalize(selectedDestination.network),
      amountToSend.toString(),
      currentAccountPolkadot,
      signer,
      currentAccount,
      selectedToken,
    )
  }

  const transferTokenValidationSchemaa = Yup.object().shape({
    assetAmount: Yup.number()
      .typeError(t('global.errors.numbersOnly'))
      .positive(t('global.errors.positiveValue'))
      .required(t('global.errors.required')),
  })

  const formik = useFormik({
    initialValues: { assetAmount: '' },
    validationSchema: transferTokenValidationSchemaa,
    onSubmit: values => handleTransferClick(values.assetAmount.toString()),
  })

  const {
    values,
    handleChange,
    submitForm,
    handleBlur,
    setFieldValue,
    setFieldTouched,
  } = formik

  useEffect(() => {
    /**  Allowed tokens for Moonriver<>Kusama => KSM */
    if (
      selectedDestination.network === 'kusama' ||
      selectedOrigin.network === 'kusama'
    ) {
      setAllowedTokens(['KSM'])
      setSelectedToken('KSM')
    } else {
      /** Allowed tokens for Moonriver<>Karura => MOVR,KAR,aUSD */
      setAllowedTokens(['MOVR', 'KAR', 'aUSD'])
      setSelectedToken(DEFAULT_TOKEN)
    }
  }, [selectedDestination, selectedOrigin])

  const isSupportedNetwork = (network: SupportedNetwork['network']) => {
    if (network === DEFAULT_ORIGIN_CHAIN) {
      return isSupportedNetworkEVM
    }
    return isPolkadotEnabled && currentAccountPolkadot
  }

  const getAddressInput = (selectedChain: SupportedNetwork) => {
    if (isSupportedNetwork(selectedChain.network)) {
      return (
        <AddressInput
          className="u-full-width"
          name={selectedChain.network}
          value={sliceMiddleOfString(
            selectedChain.network === DEFAULT_ORIGIN_CHAIN
              ? currentAccount
              : currentAccountPolkadot.address,
            4,
          )}
          networkName={toCapitalize(selectedChain.network)}
          icon={{ name: selectedChain.icon, size: 30 }}
        />
      )
    } else {
      return (
        <AddressInput
          className="u-full-width"
          name={selectedChain.network}
          value=""
          networkName=""
          icon={undefined}
          status="error"
          error={t('global.errors.wrongNetwork', {
            network: toCapitalize(selectedChain.network),
          })}
        />
      )
    }
  }

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
                        <Icon
                          name={selectedOrigin.icon}
                          color="oxfordBlue"
                          size={40}
                        />
                      </BoxLayout>
                      <Text as="span" type="body 2">
                        {toCapitalize(selectedOrigin.network)}
                      </Text>

                      <BoxLayout gap={0.75}>
                        <Icon name="arrow-down" color="oxfordBlue" />
                      </BoxLayout>
                    </>
                  </Button>
                }
                field={
                  <StackLayout>
                    {chains.map(chain => (
                      <MenuItem
                        key={chain.prefix}
                        appearance="text"
                        variant="medium"
                        size="large"
                        onClick={() => handleOriginChange(chain)}
                        className="u-full-width"
                        disabled={chain.network === selectedOrigin.network}
                      >
                        <ColumnLayout
                          className="u-full-width"
                          align="space-between"
                        >
                          <Icon
                            name={chain.icon}
                            color="oxfordBlue"
                            size={20}
                          />
                          <Text type="body 2">
                            {toCapitalize(chain.network)}
                          </Text>
                        </ColumnLayout>
                      </MenuItem>
                    ))}
                  </StackLayout>
                }
              />
            </StackLayout>
            <Button
              onClick={handleSwapButtonClick}
              appearance="text"
              variant="large"
              size="large"
              icon="transfer"
            />

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
                        <Icon
                          name={selectedDestination.icon}
                          color="oxfordBlue"
                          size={40}
                        />
                      </BoxLayout>
                      <Text as="span" type="body 2">
                        {toCapitalize(selectedDestination.network)}
                      </Text>
                      <BoxLayout gap={0.75}>
                        <Icon name="arrow-down" color="oxfordBlue" />
                      </BoxLayout>
                    </>
                  </Button>
                }
                field={
                  <StackLayout>
                    {chains.map(chain => (
                      <MenuItem
                        key={chain.prefix}
                        appearance="text"
                        variant="large"
                        size="large"
                        onClick={() => handleDestinationChange(chain)}
                        className="u-full-width"
                        disabled={chain.network === selectedDestination.network}
                      >
                        <ColumnLayout
                          className="u-full-width"
                          align="space-between"
                        >
                          <Icon
                            name={chain.icon}
                            color="oxfordBlue"
                            size={20}
                          />
                          <Text type="body 2">
                            {toCapitalize(chain.network)}
                          </Text>
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
            {getAddressInput(selectedOrigin)}
          </StackLayout>
          <StackLayout gap={1}>
            <StackLayout gap={0.625}>
              <Text color="oxfordBlue" type="heading 3">
                {t('transfer.destinationAccount')}
              </Text>
              {getAddressInput(selectedDestination)}
            </StackLayout>

            <StackLayout gap={3.315}>
              <StackLayout gap={0.5}>
                <ColumnLayout align="space-between">
                  <Text as="span" color="oxfordBlue" type="heading 3">
                    {t('global.inputs.amount')}
                  </Text>
                  {/* <Text as="span" color="oxfordBlue" type="body 1">
                    0 ( {t('transfer.inNetworkLabel', { network: 'Moonbeam' })})
                  </Text> */}
                  <Text as="span" color="oxfordBlue" type="body 1">
                    {maxAmount}
                  </Text>
                </ColumnLayout>

                <ColumnLayout gap={2} align="space-between">
                  <ColumnLayout className="u-full-width">
                    <BaseInput
                      className="u-full-width"
                      width="100%"
                      type="number"
                      name="assetAmount"
                      value={values.assetAmount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      height="large"
                    />
                    <Button
                      appearance="secondary"
                      variant="large"
                      size="small"
                      className="u-fit-content-width"
                      onClick={handleMaxClick}
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
                type="submit"
                onClick={submitForm}
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
