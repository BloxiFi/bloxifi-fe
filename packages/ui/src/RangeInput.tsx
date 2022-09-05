import React, { ForwardedRef, forwardRef, HTMLProps } from 'react'
import styled from 'styled-components'
import { numberToPercentage } from '@bloxifi/core'

import { Colors } from './styles/colors'
import { Text } from './Text'

export type RangeInputProps = HTMLProps<HTMLInputElement>

/**
 * Height of the scroll bar wrapper container
 */
const containerHeight = 30

export const RangeInput = forwardRef(
  ({ ...props }: RangeInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const max = Number(props.max)
    const min = Number(props.min)
    const percentage = numberToPercentage((Number(props.value) || 0) / max)

    return (
      <Wrapper>
        {props.title && (
          <Title color="oxfordBlue" type="body 2">
            {props.title}
          </Title>
        )}
        <InnerWrapper className={props.className} valuePercent={percentage}>
          <input ref={ref} {...props} min={min} max={max} />
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
    width: 100%;
    border-radius: 4px;
    background: ${({ valuePercent }) =>
      `linear-gradient(to right, ${Colors.dark.inputTextColor} 0%, ${
        Colors.dark.inputTextColor
      } ${valuePercent - 1}%, ${Colors.dark.loaderBackground} ${
        valuePercent - 1
      }%, ${Colors.dark.loaderBackground} 100%);`};

    ::-webkit-slider-thumb {
      appearance: none;
      width: 20px;
      height: 20px;
      background-image: radial-gradient(
        circle,
        ${Colors.light.white} 65%,
        ${Colors.dark.activeHeaderItemBorderColorStart} 45%
      );
      border-radius: 50%;
      box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
    }

    ::-moz-range-thumb {
      width: 20px;
      height: 20px;
      appearance: none;
      background-image: radial-gradient(
        circle,
        ${Colors.light.white} 65%,
        ${Colors.dark.activeHeaderItemBorderColorStart} 45%
      );
      border-radius: 50%;
      box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
    }
  }
`

const Title = styled(Text)`
  margin-bottom: 0.5rem;
`
