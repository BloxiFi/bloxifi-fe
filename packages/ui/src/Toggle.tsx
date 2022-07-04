import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

/**
 * Props for styling the toggler
 */
type ToggleStyle = {
  /**
   * Width of the toggler
   */
  width: number
  /**
   * Height of the toggler is calculated from width
   */
  height: number
  /**
   * Circle radius is calculated from height and padding
   */
  circleWidth: number
  /**
   * Height of the circle
   */
  circleHeight: number
  /**
   * Left & right padding for the toggler
   */
  paddingSides: number
  /**
   * Padding top for the circle
   */
  paddingTop?: number
}

/**
 * Toggle props.
 */
export interface ToggleProps extends React.ComponentPropsWithoutRef<'input'> {
  /**
   * Setting custom size for the Toggle
   */
  styleProps?: Pick<ToggleStyle, 'width' | 'paddingTop'>
}

export const Toggle: FunctionComponent<ToggleProps> = ({
  styleProps = {} as ToggleStyle,
  ...props
}: ToggleProps) => {
  const { width = 50, paddingTop = 2 } = styleProps
  const height = width * 0.5

  //Difference between circle padding top and sides is 1px
  const paddingSides = paddingTop + 1
  const circleHeight = height - 2 * paddingTop
  //Difference between circle width and height is 1px
  const circleWidth = circleHeight - 1

  return (
    <Wrapper
      width={width}
      height={height}
      data-element="toggle"
      className={`rts-toggle__container ${props.className}`}
    >
      <ToggleInput
        type="checkbox"
        className="rts-toggle__toggle"
        data-element="toggle-input"
        styleProps={{ width, paddingSides, circleWidth }}
        {...props}
      />
      <ToggleBackground
        height={height}
        paddingTop={paddingTop}
        circleWidth={circleWidth}
        circleHeight={circleHeight}
        paddingSides={paddingSides}
        className="rts-toggle__background"
        data-element="toggle-background"
      />
    </Wrapper>
  )
}

const Wrapper = styled.div<Pick<ToggleStyle, 'width' | 'height'>>`
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  display: inline-flex;
  border-radius: ${({ height }) => height * 0.4}px;
`
const ToggleBackground = styled.span<Omit<ToggleStyle, 'width'>>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: ${({ theme }) => theme.toggleBackground} 0% 0% no-repeat
    padding-box;
  border-radius: ${({ height }) => height * 0.4}px;
  transition: 0.2s ease background;

  &::after {
    content: '';
    position: absolute;
    ${({ paddingTop, paddingSides, circleWidth, circleHeight }) => `
      left: ${paddingSides}px;
      top: ${paddingTop}px;
      width: ${circleWidth}px;
      height: ${circleHeight}px;
      `}
    border-radius: 50%;
    transition: 0.5s ease transform, 0.2s ease background;
    background: ${({ theme }) => theme.white};
    z-index: 0;
    box-shadow: 0 3px 6px #00000080;
  }
`

const ToggleInput = styled.input<{
  styleProps: Omit<ToggleStyle, 'height' | 'circleHeight' | 'paddingTop'>
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  z-index: 2;
  cursor: pointer;

  :checked + ${ToggleBackground} {
    background-image: linear-gradient(
      to right,
      ${({ theme }) => theme.toggleActiveGradient1},
      ${({ theme }) => theme.toggleActiveGradient2}
    );

    &::after {
      transform: translate(
        ${({ styleProps: { width, circleWidth, paddingSides } }): number =>
          width - circleWidth - 2 * paddingSides}px,
        0
      );
    }
  }
`
