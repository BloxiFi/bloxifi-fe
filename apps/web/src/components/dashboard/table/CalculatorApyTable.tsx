import React, { FunctionComponent, useState, useEffect } from 'react'
import {
  BoxLayout,
  Button,
  CardLayout,
  StackLayout,
  Icon,
  Text,
  BaseInput,
  RangeInput,
  Menu,
  MenuItem,
  ColumnLayout,
} from '@bloxifi/ui'
import { useCalculateAPY } from '@bloxifi/core/src/hooks/useCalculateAPY'
import { useTranslation } from 'react-i18next'
import { useFormatNumber } from '@bloxifi/core'
import { useFormik } from 'formik'
import * as Yup from 'yup'

interface CalculatorProps {
  /**
   * Calculator type represents borrow, landing, stake... types to perform
   */
  readonly calctype?: string
}

//TODO rewrite hook and UI to use token address not symbol
//export type tokensList = keyof (typeof TOKENS)

export const CalculatorApyTable: FunctionComponent<CalculatorProps> = ({
  calctype,
}: CalculatorProps) => {
  const { t } = useTranslation()
  const [duration, setDuration] = useState<string>('24')

  const [labelPlural, setLabelPlural] = useState<string>('months')
  const [closeMenu, setCloseMenu] = useState(false)
  const handleClose = () => {
    setCloseMenu(false)
  }
  const chooseAsset = (asset: { token: any }) => {
    setCloseMenu(true)
    setAssetSelected(asset.token)
  }

  const tokens = ['KSMmb', 'WBTCmb', 'WETHmb', 'DAImb', 'USDCmb', 'MOWRmb']
  const [assetSelected, setAssetSelected] = useState(tokens[0])
  const [returnAmount, setReturnAmount] = useState(1)
  const [returnPercent, setReturnPercent] = useState(1)

  const assetAmountValidationSchemaa = Yup.object().shape({
    assetAmount: Yup.number()
      .typeError(t('global.errors.numbersOnly'))
      .positive(t('global.errors.positiveValue'))
      .required(t('global.errors.required')),
  })

  const formik = useFormik({
    initialValues: { assetAmount: 100 },
    validationSchema: assetAmountValidationSchemaa,
    onSubmit: undefined,
  })

  const {
    values,
    errors,
    touched,
    handleBlur,
    setFieldValue,
    setFieldTouched,
  } = formik

  const setAssetAmount = async (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    await setFieldValue('assetAmount', target.value, true)
    await setFieldTouched('assetAmount', true, true)
  }

  const checkValue = (value: number) => {
    return value > 0 && value !== null ? value : 0
  }

  const responseAPY = useCalculateAPY({
    tokenSymbol: assetSelected,
    tokenAmount: checkValue(values.assetAmount),
    daysAmount: Number(duration) * 30,
    simulationType: calctype,
  })

  useEffect(() => {
    if (responseAPY && responseAPY !== null) {
      setReturnAmount(checkValue(responseAPY[0]))
      setReturnPercent(checkValue(responseAPY[1]))
    }
  }, [responseAPY])

  useEffect(() => {
    if (duration == '1') {
      setLabelPlural(' month')
    } else {
      setLabelPlural(' months')
    }
  }, [duration])

  return (
    <CardLayout>
      <BoxLayout gap={2}>
        <StackLayout gap={2}>
          <Text as="span" color="oxfordBlue" type="heading 2">
            {t('dashboard.APYcalculator.title', { type: calctype })}
          </Text>

          <ColumnLayout gap={2}>
            <StackLayout gap={0.5}>
              <Text color="oxfordBlue" type="heading 3">
                {t('global.inputs.chooseCurrency')}
              </Text>
              <Menu
                left
                bottom
                positionOffset={{ top: 5, left: 0 }}
                forceClose={closeMenu}
                onClose={handleClose}
                toggler={
                  <Button appearance="secondary" variant="thin" size="medium">
                    <>
                      {assetSelected}
                      <BoxLayout gap={0.75}>
                        <Icon name="arrow-down" color="oxfordBlue" />
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
                        onClick={() => chooseAsset({ token })}
                      >
                        {token}
                      </MenuItem>
                    ))}
                  </StackLayout>
                }
              />
            </StackLayout>

            <StackLayout gap={0.5} className="u-full-width">
              <Text color="oxfordBlue" type="heading 3">
                {t('global.inputs.amount')}
              </Text>
              <BaseInput
                type="number"
                name="assetAmount"
                value={values.assetAmount}
                onInput={setAssetAmount}
                onBlur={handleBlur}
                status={
                  errors.assetAmount && touched.assetAmount
                    ? 'error'
                    : undefined
                }
                info={
                  errors.assetAmount &&
                  touched.assetAmount &&
                  errors.assetAmount
                }
              />
            </StackLayout>
          </ColumnLayout>

          <StackLayout gap={1}>
            <RangeInput
              name="duration"
              title={`${calctype} duration`}
              showlabel
              step={1}
              min={1}
              max={36}
              type="range"
              value={duration}
              onInput={e => {
                setDuration((e.target as HTMLInputElement).value)
              }}
            />

            <StackLayout>
              <Text color="oxfordBlue" type="heading 3">
                {t('dashboard.APYcalculator.duration', {
                  duration,
                  labelPlural,
                })}
              </Text>
              <ColumnLayout gap={0.5}>
                <Text
                  as="span"
                  color="oxfordBlue"
                  type="big-text"
                  bold
                  className="u-text-break-word"
                >
                  {useFormatNumber({
                    value: returnAmount,
                    decimals: 5,
                    percent: false,
                  })}
                </Text>
                <Text
                  as="span"
                  color="oxfordBlue"
                  type="big-text"
                  bold
                  className="u-text-break-word"
                >
                  {assetSelected}
                </Text>
                <Text as="span" color="oxfordBlue" type="big-text">
                  (
                  {useFormatNumber({
                    value: returnPercent,
                    decimals: 2,
                    percent: true,
                  })}
                  )
                </Text>
              </ColumnLayout>
            </StackLayout>
          </StackLayout>
        </StackLayout>
        <BoxLayout gap={1.5} />
      </BoxLayout>
    </CardLayout>
  )
}
