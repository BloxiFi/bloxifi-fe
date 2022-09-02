import React, {
  useContext,
  useState,
  useEffect,
  ForwardedRef,
  forwardRef,
  HTMLProps,
} from 'react'
import styled, { ThemeContext } from 'styled-components'

import { Text } from './Text'

export interface RangeBarProps extends HTMLProps<HTMLInputElement> {
  /**
   * Step value of scroll bar
   */
  stepvalue?: number
}

/**
 * Height of the scroll bar wrapper container
 */
const containerHeight = 70

export const RangeBar = forwardRef(
  (
    {
      type = 'range',
      className = '',
      disabled = false,
      stepvalue,
      min,
      max,
      ...props
    }: RangeBarProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const themeContext = useContext(ThemeContext)
    const [valuePercent, setValuePercent] = useState(0)
    const [rangeValue, setRangeValue] = useState(0)

    const calculatePercent = (val: string) => {
      setValuePercent((parseInt(val, 10) / Number(max)) * 100)
    }

    const handleRangeChange = e => {
      if (e && e.target && e.target.value) {
        setRangeValue(e.target.value)
        calculatePercent(e.target.value)
      }
    }

    useEffect(() => {
      const startValue = (Number(max) - Number(min)) / 2
      setRangeValue(startValue)
      calculatePercent(startValue.toString())
    }, [])

    useEffect(() => {
      const startValue = (Number(max) - Number(min)) / 2
      setRangeValue(startValue)
      calculatePercent(startValue.toString())
    }, [min, max])

    return (
      <Wrapper>
        {props.title && (
          <Title color="oxfordBlue" type="body 2">
            {props.title}
          </Title>
        )}
        <InnerWrapper className={className} valuePercent={valuePercent}>
          <input
            ref={ref}
            value={rangeValue}
            type={type}
            min={min}
            step={stepvalue}
            max={max}
            onChange={handleRangeChange}
            {...props}
            disabled={disabled}
          />
        </InnerWrapper>
      </Wrapper>
    )
  },
)

const Wrapper = styled.div`
  height: ${containerHeight}px;
  width: 100%;

  #bottom-label {
    transform: translate(-10px, -10px);
  }
`
/* stylelint-disable property-no-vendor-prefix */
const InnerWrapper = styled.div<{ valuePercent: number }>`
  input {
    appearance: none;
    outline: 0;
    height: 15px;
    border-radius: 4px;
    background: ${({ theme, valuePercent }) =>
      `linear-gradient(to right, ${theme.buttonDark} 0%, ${theme.buttonDark} ${
        valuePercent - 1
      }%, #DAE3ED ${valuePercent - 1}%, #DAE3ED 100%);`};
    box-shadow: 0 0 4px rgb(0 0 0 / 0.5);

    ::-webkit-slider-thumb {
      appearance: none;
      width: 20px;
      height: 20px;
      background-image: radial-gradient(circle, #fff 65%, #90abc8 45%);
      border-radius: 50%;
      box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
    }

    ::-moz-range-thumb {
      width: 20px;
      height: 20px;
      appearance: none;
      background-image: radial-gradient(circle, #fff 65%, #90abc8 45%);
      border-radius: 50%;
      box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
    }
  }
`

const Title = styled(Text)`
  margin-bottom: 0.5rem;
`
