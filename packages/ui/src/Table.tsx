import React, { useState } from 'react'
import styled from 'styled-components'

import { Fonts } from './styles/fonts'

/**
 * Table data.
 */
type TableData = Record<string, unknown>

/**
 * Cell props representing `<td>` element.
 */
export interface CellProps {
  /**
   * Function that if triggered with some data, it will show {@link ColumnData.ExpandedCell}
   */
  onRowExpand: (data?: TableData | boolean) => void
  /**
   * Row data passed in Cell.
   */
  data: TableData
  /**
   * Row index.
   */
  index: number
}

/**
 * Column props representing `<th>` element.
 */
interface ColumnData {
  /**
   * Header content
   */
  header: string
  /**
   * A Cell component that will be placed in this Column in every row.
   */
  Cell: (props: CellProps) => JSX.Element
  /**
   * Optional width prop, used to limit the column width
   */
  width?: number
  /**
   * Optional component that will render if {@link CellProps.onRowExpand} is triggered in Cell with some data.
   */
  ExpandedCell?: (props: Omit<CellProps, 'onRowExpand'>) => JSX.Element
  /**
   * Optional align prop, used to align the column text
   */
  alignText?: string
}

/**
 * Table props.
 */
export interface TableProps extends React.ComponentPropsWithoutRef<'table'> {
  /**
   * Required data prop, should be array of objects.
   */
  data: TableData[]
  /**
   * Required columns prop, used to layout the content in cells and columns
   */
  columns: Record<string, ColumnData>
  /**
   * Renders Loader instead of table content.
   */
  isLoading?: boolean
  /**
   * Optional message when there is no data present
   */
  noDataMessage?: string
  /**
   * Optional title that will appear above header columns
   */
  titleComponent?: string | React.ReactNode
  /**
   * Optional footer that will appear below table body
   */
  footer?: React.ReactNode
  /**
   * Optional Footer className to override any default styling
   */
  footerClassName?: string
}

/**
 * Row props.
 */
interface RowProps
  extends Pick<TableProps, 'columns'>,
    React.ComponentPropsWithoutRef<'tr'> {
  /**
   * Row index.
   */
  rowIndex: number
  /**
   * Renders Loader instead of table content.
   */
  rowData: TableData
  /**
   * Boolean if table title is present
   */
  withTitle?: boolean
  /**
   * Boolean if table title is a component or a string
   */
  isTitleAString?: boolean
}

const Row = ({
  columns,
  rowData,
  rowIndex,
  withTitle,
  isTitleAString,
  ...props
}: RowProps) => {
  const [isRowExpanded, setIsRowExpanded] = useState(false)
  const [expandedRowData, setExpandedRowData] = useState<TableData>({})

  const onRowExpand = (data: TableData) => {
    setExpandedRowData({ ...data })

    if (data) {
      setIsRowExpanded(true)
    } else {
      setIsRowExpanded(false)
    }
  }

  const Row = (
    <tr {...props}>
      {Object.values(columns).map(({ Cell, alignText = 'center' }, index) => {
        if (!Cell) {
          return null
        }

        return (
          <Column
            key={index}
            alignText={alignText}
            withTitle={withTitle}
            isTitleAString={isTitleAString}
          >
            <Cell onRowExpand={onRowExpand} data={rowData} index={rowIndex} />
          </Column>
        )
      })}
    </tr>
  )

  return (
    <>
      {Row}
      {isRowExpanded && (
        <tr>
          {Object.values(columns).map(({ ExpandedCell }, index) => {
            if (!ExpandedCell) {
              return null
            }

            return (
              <ExpandedColumn
                colSpan={Object.values(columns).length}
                key={index}
              >
                <ExpandedCell
                  data={{ ...expandedRowData, ...rowData }}
                  index={rowIndex}
                />
              </ExpandedColumn>
            )
          })}
        </tr>
      )}
    </>
  )
}

export const Table = ({
  data,
  columns,
  isLoading,
  noDataMessage = '',
  titleComponent = '',
  footer,
  footerClassName = '',
  ...props
}: TableProps) => {
  const isTitleAString = typeof titleComponent === 'string'
  const numberOfColumns = Object.values(columns).length

  return (
    <Wrapper data-element="tableWrapper">
      <TableWrapper data-element="table" {...props}>
        <THead>
          {titleComponent && isTitleAString && (
            <tr>
              <HeaderTitle colSpan={numberOfColumns}>
                {titleComponent}
              </HeaderTitle>
            </tr>
          )}
          {titleComponent && !isTitleAString && (
            <tr>
              <HeaderTitleComponent colSpan={numberOfColumns}>
                {titleComponent}
              </HeaderTitleComponent>
            </tr>
          )}

          <tr>
            {columns &&
              Object.values(columns).map(
                ({ header, width, alignText = 'center' }, index) => {
                  if (header && !isLoading) {
                    return (
                      <HeaderColumn
                        width={width}
                        key={index}
                        alignText={alignText}
                        withTitle={!!titleComponent}
                        isTitleAString={isTitleAString}
                      >
                        <TableHeaderText>{header}</TableHeaderText>
                      </HeaderColumn>
                    )
                  }

                  if (index === 0 && isLoading) {
                    return (
                      <Column
                        width="100%"
                        key={index}
                        withTitle={!!titleComponent}
                      >
                        <TableHeaderText>Loading...</TableHeaderText>
                      </Column>
                    )
                  }

                  return null
                },
              )}
          </tr>
        </THead>
        <tbody>
          {isLoading ? (
            <tr>
              <LoadingColumn>
                <div>TODO - Loader</div>
              </LoadingColumn>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <Column colSpan={numberOfColumns}>{noDataMessage}</Column>
            </tr>
          ) : (
            data.map((rowData, rowIndex) => (
              <Row
                key={rowIndex}
                columns={columns}
                rowIndex={rowIndex}
                rowData={rowData}
                withTitle={!!titleComponent}
                isTitleAString={isTitleAString}
              />
            ))
          )}
        </tbody>

        {footer && (
          <Footer className={footerClassName}>
            <Column colSpan={numberOfColumns}>{footer}</Column>
          </Footer>
        )}
      </TableWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.tableBorderColor};
  background-color: ${({ theme }) => theme.darkBackground};
  font-family: ${Fonts.ClashDisplay}, serif;
  border-radius: 10px;
  overflow: hidden;
`

const TableWrapper = styled.table`
  table-layout: fixed;
  border-spacing: 0;
`

export const TruncatedText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  max-width: 100%;
`

const TableHeaderText = styled(TruncatedText)`
  color: ${({ theme }) => theme.tableTextColor};
  font-weight: 600;
  vertical-align: middle;
  font-size: 16px;
`

export const Column = styled.td<{
  width?: number | string
  alignText?: string
  withTitle?: boolean
  isTitleAString?: boolean
}>`
  border-top: 1px solid ${({ theme }) => theme.tableBorderColor};
  background-color: ${({ theme }) => theme.tableCellBackgroundColor};
  color: ${({ theme }) => theme.tableTextColor};
  font-family: ${Fonts.Inter}, serif;
  font-weight: 600;
  font-size: 16px;
  ${({ width, alignText, withTitle, isTitleAString }) => `
      padding: ${!isTitleAString && withTitle ? '15px' : '30px'} 20px;
      text-align: ${alignText || 'center'};

      ${
        typeof width === 'number'
          ? `width: ${width}px;`
          : `width: ${width || ''};`
      }

    `};
`
const HeaderColumn = styled(Column)<{
  withTitle?: boolean
}>`
  ${({ withTitle }) =>
    `padding: ${withTitle ? '15px 20px 4px 20px;' : '30px 20px;'}`}
`

const ExpandedColumn = styled.td`
  padding: 0;
  background-color: ${({ theme }) => theme.tableCellBackgroundColor};
  color: ${({ theme }) => theme.tableTextColor};
`

export const LoadingColumn = styled(Column)`
  display: flex;
  justify-content: center;
  width: 100%;
  text-align: center;
  margin: auto;
`

const THead = styled.thead`
  td {
    border-top: 0;
    font-family: ${Fonts.ClashDisplay}, serif;
  }
`

const HeaderTitle = styled.td`
  padding: 30px 20px 19px;
  font-size: 24px;
  color: ${({ theme }) => theme.tableTextColor};
  background-color: ${({ theme }) => theme.tableCellBackgroundColor};
`

const HeaderTitleComponent = styled.td`
  padding: 30px 20px 14px;
  font-size: 24px;
  color: ${({ theme }) => theme.tableTextColor};
  background-color: ${({ theme }) => theme.tableCellBackgroundColor};
`

const Footer = styled.tfoot`
  padding: 30px 20px;
  background-color: ${({ theme }) => theme.tableCellBackgroundColor};
`
