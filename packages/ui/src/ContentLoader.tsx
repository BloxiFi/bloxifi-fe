import React from 'react'
import { default as Loader, IContentLoaderProps } from 'react-content-loader'
import { ResponsiveContainer } from 'recharts'

/**
 * ContentLoaderProps extending existing props {@link IContentLoaderProps} to have some custom loader appearance
 */
interface ContentLoaderProps extends IContentLoaderProps {
  /**
   * TODO@any Maybe to predefine some appearance for easier use
   */
  appearance?: 'text'
  /**
   * Border radius for loader
   */
  borderRadius?: React.SVGAttributes<unknown>['rx']
}

/**
 * ContentLoader component can be used to create a nice placeholder while waiting for some content (Text) to be available,
 * instead of adding Loader component while we wait we can use this component to layout the screen and then just switch it with the content.
 */
export const ContentLoader = ({
  appearance = 'text',
  width,
  height,
  borderRadius = 5,
  ...props
}: ContentLoaderProps) => {
  return (
    <ResponsiveContainer
      width={width ?? '100%'}
      height={appearance === 'text' ? 30 : height}
    >
      <Loader
        {...props}
        speed={2}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect
          x="0"
          y="0"
          rx={borderRadius}
          ry={borderRadius}
          width="100%"
          height="100%"
        />
      </Loader>
    </ResponsiveContainer>
  )
}
