import React, { useState } from 'react'
import styled from 'styled-components'

import { Fonts } from './styles/fonts'
import { Text } from './Text'

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
  width?: number | string
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
   * Optional compact that will remove table borders
   */
  compact?: boolean
  /**
   * Optional additional padding for table row
   */
  columnSpacing?: boolean
  /**
   * Optional additional padding for table header
   */
  headerSpacing?: boolean
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
   * Boolean if table title is a component or a string
   */
  isTitleAString?: boolean
  /**
   * Optional additional padding for table row
   */
  columnSpacing?: boolean
}

export const stylings = {
  // Use this class on titleComponent to target its ProgressBar component
  tableHeaderWithProgressBar: 'c-table__header--progressbar',
  //Use this class on ProgressBar inside the titleComponent in order to position ProgressBar to the bottom of the parent
  tableHeaderProgressBar: 'c-table__bottom-progressbar',
}

const Row = ({
  columns,
  rowData,
  rowIndex,
  columnSpacing,
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
            columnSpacing={columnSpacing}
            key={index}
            alignText={alignText}
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
  compact,
  columnSpacing,
  headerSpacing,
  ...props
}: TableProps) => {
  const isTitleAString = typeof titleComponent === 'string'
  const numberOfColumns = Object.values(columns).length
  const isEmpty = data.length === 0

  return (
    <Wrapper data-element="tableWrapper" compact={compact} isEmpty={isEmpty}>
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
          {!isEmpty && (
            <tr>
              {columns &&
                Object.values(columns).map(
                  ({ header, width, alignText = 'center' }, index) => {
                    if (!isLoading) {
                      return (
                        <HeaderColumn
                          width={width}
                          key={index}
                          alignText={alignText}
                          headerSpacing={headerSpacing}
                        >
                          <TableHeaderText>{header}</TableHeaderText>
                        </HeaderColumn>
                      )
                    }

                    if (index === 0 && isLoading) {
                      return (
                        <Column width="100%" key={index}>
                          <TableHeaderText>Loading...</TableHeaderText>
                        </Column>
                      )
                    }

                    return null
                  },
                )}
            </tr>
          )}
        </THead>
        <tbody>
          {isLoading ? (
            <tr>
              <LoadingColumn>
                <div>TODO - Loader</div>
              </LoadingColumn>
            </tr>
          ) : isEmpty ? (
            <tr>
              <Column alignText="left" isEmpty colSpan={numberOfColumns}>
                <Text type="body 5">{noDataMessage}</Text>
              </Column>
            </tr>
          ) : (
            data.map((rowData, rowIndex) => (
              <Row
                key={rowIndex}
                columns={columns}
                rowIndex={rowIndex}
                rowData={rowData}
                isTitleAString={isTitleAString}
                columnSpacing={columnSpacing}
              />
            ))
          )}
        </tbody>

        {footer && (
          <Footer className="c-table__footer">
            <Column isEmpty={isEmpty} colSpan={numberOfColumns}>
              {footer}
            </Column>
          </Footer>
        )}
      </TableWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ compact?: boolean; isEmpty?: boolean }>`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.tableBorderColor};
  background-color: ${({ theme }) => theme.darkBackground};
  font-family: ${Fonts.ClashDisplay}, serif;
  border-radius: 10px;
  overflow: hidden;
  ${({ compact, isEmpty }) => (compact || isEmpty) && ` border: none;`};
  ${({ compact, isEmpty, theme }) =>
    compact &&
    !isEmpty &&
    `
border-bottom: 1px solid ${theme.tableBorderColor};
border-radius: 0;
`}
`

const TableWrapper = styled.table`
  table-layout: fixed;
  border-spacing: 0;
  background: ${({ theme }) => theme.white};
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
  isEmpty?: boolean
  columnSpacing?: boolean
}>`
  ${({ theme, isEmpty }) =>
    !isEmpty && `border-top: 1px solid ${theme.tableBorderColor}`};
  background-color: ${({ theme }) => theme.tableCellBackgroundColor};
  color: ${({ theme }) => theme.tableTextColor};
  font-family: ${Fonts.Inter}, serif;
  font-weight: 600;
  font-size: 16px;
  padding: ${({ columnSpacing }) => (columnSpacing ? '20px' : '10px 20px')};
  ${({ width, alignText }) => `
      text-align: ${alignText || 'center'};

      ${
        typeof width === 'number'
          ? `width: ${width}px;`
          : `width: ${width || ''};`
      }

    `};
`
const HeaderColumn = styled(Column)<{
  headerSpacing?: boolean
}>`
  ${({ headerSpacing }) =>
    `padding: ${headerSpacing ? '30px 20px;' : '15px 20px 4px 20px;'}`}
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

  .c-table__header--progressbar {
    position: relative;

    .c-table__bottom-progressbar {
      position: absolute;
      bottom: -4px;
      right: 0;
      width: 50%;
    }
  }
`

const Footer = styled.tfoot`
  padding: 30px 20px;
  background-color: ${({ theme }) => theme.tableCellBackgroundColor};
`
