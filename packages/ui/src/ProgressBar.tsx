import React, { useContext } from 'react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LabelList,
  Label,
} from 'recharts'
import styled, { ThemeContext } from 'styled-components'

import { Fonts } from './styles/fonts'
import { Text } from './Text'

export interface ProgressBarProps {
  /**
   * Progress value
   */
  value: number
  /**
   * Title of the progress bar
   */
  title?: string
  /**
   * The bottom label shows progress value
   */
  showBottomLabel?: boolean
}

/**
 * Height of the progress bar wrapper container
 */
const containerHeight = 70

export const ProgressBar = ({
  value,
  title,
  showBottomLabel,
}: ProgressBarProps) => {
  const themeContext = useContext(ThemeContext)
  const data = [
    {
      value,
      completed: 100 - value,
    },
  ]

  /**
   * Height of the progress bar component
   */
  const progressBarHeight = 15
  /**
   * Right offset of the progress bar value
   */
  const offset = 25
  /**
   * Width breakpoint that changes progress bar style regarding progress value
   * If value < widthBreakpoint - progress value is centered without offset
   * If value > widthBreakpoint - progress value should be right aligned with offset
   */
  const widthBreakpoint = 40
  /**
   * Calculate if progress value should be displayed
   */
  const displayLabel = value > 10

  return (
    <Wrapper>
      {title && (
        <Title color="oxfordBlue" type="body 2">
          {title}
        </Title>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          barCategoryGap={0}
          barGap={0}
          margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
          data={data}
          layout="vertical"
        >
          <XAxis type="number" tick={false} tickLine={false} axisLine={false}>
            {showBottomLabel && (
              <Label
                value={`${value}% of 100%`}
                position="insideTopRight"
                fontFamily={Fonts.Inter}
                fontSize={12}
                fill={themeContext.buttonDark}
                id="bottom-label"
              />
            )}
          </XAxis>
          <YAxis type="category" hide />

          <Bar
            barSize={progressBarHeight}
            dataKey="value"
            stackId="a"
            fill={themeContext.buttonDark}
            radius={[4, 0, 0, 4]}
          >
            {displayLabel && (
              <LabelList
                formatter={(value: number) => `${value}%`}
                fill={themeContext.white}
                dataKey="value"
                position={value > widthBreakpoint ? 'insideRight' : 'center'}
                fontFamily={Fonts.Inter}
                fontSize={12}
                offset={value > widthBreakpoint && offset}
              />
            )}
          </Bar>
          <Bar
            barSize={progressBarHeight}
            dataKey="completed"
            stackId="a"
            fill={themeContext.buttonLight}
            radius={[4, 0, 0, 4]}
          >
            {value === 0 && (
              <LabelList
                formatter={(value: number) => `${value}%`}
                fill={themeContext.buttonDark}
                dataKey="value"
                position="center"
                fontFamily={Fonts.Inter}
                fontSize={12}
              />
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: ${containerHeight}px;
  width: 100%;

  #bottom-label {
    transform: translate(-10px, -10px);
  }
`

const Title = styled(Text)`
  margin-bottom: 0.5rem;
`
