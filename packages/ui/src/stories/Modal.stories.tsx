import { Meta } from '@storybook/react'
import React, { Fragment, useContext, useState } from 'react'

import { Button } from '..'
import { BoxLayout, ColumnLayout, StackLayout } from '../Layouts'
import { Modal } from '../Modal'
import { Table, CellProps } from '../Table'
import { Text } from '../Text'
import { Toggle } from '../Toggle'
import { BaseInput } from '../BaseInput'
import styled from 'styled-components'
import { Icon } from '../Icon'
import { ThemeContext } from 'styled-components'

export default {
  title: 'Components/Modal',
  component: Modal,
} as Meta

export const ModalExample = args => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
  }
  return (
    <Fragment>
      <Button
        variant="medium"
        appearance="primary"
        size="medium"
        onClick={() => {
          handleOpen()
        }}
      >
        Open Modal
      </Button>
      <Modal {...args} isOpen={isOpen} onClose={handleClose}>
        <BoxLayout gap={1.875}>
          <StackLayout gap={1.5}>
            <Text type="heading 2">Modal Heading</Text>
            <Text type="body 1">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              <br /> Voluptatem numquam similique tempora .<br />
              Sequi eaque quas dicta, explicabo nam?
            </Text>

            <Button
              className="u-full-width"
              appearance="dark"
              size="medium"
              variant="medium"
            >
              Approve
            </Button>
            <Button
              className="u-full-width"
              appearance="secondary"
              disabled
              size="medium"
              variant="medium"
            >
              Continue
            </Button>
          </StackLayout>
        </BoxLayout>
      </Modal>
    </Fragment>
  )
}

const tableData = [
  {
    asset: 'ETH',
  },
]

const tableColumns = {
  action: {
    header: 'Amount',
    Cell: () => (
      <ColumnLayout>
        <BaseInput />
        <Button
          appearance="secondary"
          variant="thin"
          size="small"
          className="u-fit-content-width"
        >
          MAX
        </Button>
      </ColumnLayout>
    ),
    alignText: 'left',
  },
  asset: {
    header: '',
    Cell: ({ data: { asset } }: CellProps) => <span>{asset}</span>,
    alignText: 'right',
  },
}

export const DepositModal = args => {
  const Title = () => (
    <Text color="oxfordBlue" type="heading 2">
      Deposit asset
    </Text>
  )

  return (
    <Modal {...args} isOpen={true}>
      <StackLayout gap={5}>
        <StackLayout>
          <Table
            columns={tableColumns}
            data={tableData}
            titleComponent={<Title />}
          />
          <BoxLayout gap={1.875}>
            <ColumnLayout split="-1">
              <Text type="body 2">Collaterization</Text>
              <Toggle />
            </ColumnLayout>
          </BoxLayout>
        </StackLayout>

        <BoxLayout gap={1.875}>
          <StackLayout gap={1}>
            <Button
              className="u-full-width"
              appearance="dark"
              size="large"
              variant="large"
            >
              Approve to conitinue
            </Button>
            <Button
              className="u-full-width"
              appearance="secondary"
              disabled
              size="large"
              variant="large"
            >
              Deposit ETH
            </Button>
          </StackLayout>
        </BoxLayout>
      </StackLayout>
    </Modal>
  )
}

export const BorrowModal = args => {
  const themeContext = useContext(ThemeContext)
  const Title = () => (
    <Text color="oxfordBlue" type="heading 2">
      Borrow asset
    </Text>
  )

  const transactionData = [
    {
      name: 'Health factor',
    },
  ]

  const transactionColumns = {
    action: {
      header: 'Transaction overview',
      Cell: ({ data: { name } }: CellProps) => (
        <Text type="body 3" color="oxfordBlue" style={{ margin: 0 }}>
          {name}
        </Text>
      ),
      alignText: 'left',
    },
    healthFactor: {
      header: '',
      Cell: () => (
        <StackLayout>
          <Center>
            <Icon name="union" size={16} color={themeContext.buttonDark} />
            <Icon
              name="arrow-right"
              size={15}
              color={themeContext.buttonDark}
            />
            <Text as="span" type="body 1" color="oxfordBlue">
              1,00
            </Text>
          </Center>

          <Text as="span" type="body 1" color="oxfordBlue">
            {'Liquidation at < 1.00'}
          </Text>
        </StackLayout>
      ),
      alignText: 'right',
    },
  }

  return (
    <Modal {...args} isOpen={true}>
      <StackLayout gap={5}>
        <StackLayout>
          <Table
            columns={tableColumns}
            data={tableData}
            titleComponent={<Title />}
          />
          <Table columns={transactionColumns} data={transactionData} />
        </StackLayout>

        <BoxLayout gap={1.875}>
          <StackLayout gap={1}>
            <Button
              className="u-full-width"
              appearance="dark"
              size="large"
              variant="large"
            >
              Borrow asset
            </Button>
          </StackLayout>
        </BoxLayout>
      </StackLayout>
    </Modal>
  )
}

export const RepayModal = args => {
  const themeContext = useContext(ThemeContext)
  const Title = () => (
    <Text color="oxfordBlue" type="heading 2">
      Repay asset
    </Text>
  )

  const transactionData = [
    {
      name: 'Remaining debt',
      debt: true,
    },
    {
      name: 'Health factor',
    },
  ]

  const transactionColumns = {
    action: {
      header: 'Transaction overview',
      Cell: ({ data: { name } }: CellProps) => (
        <Text type="body 3" color="oxfordBlue" as="span">
          {name}
        </Text>
      ),
      alignText: 'left',
    },
    value: {
      header: '',
      Cell: ({ data: { debt } }: CellProps) => (
        <StackLayout>
          {debt ? (
            <Center>
              <Text as="span" type="body 1" color="oxfordBlue">
                1.00 Asset
              </Text>
              <Icon
                name="arrow-right"
                size={15}
                color={themeContext.buttonDark}
              />
              <Text as="span" type="body 1" color="oxfordBlue">
                0.000001 Asset
              </Text>
            </Center>
          ) : (
            <Center>
              <Icon name="union" size={16} color={themeContext.buttonDark} />
              <Icon
                name="arrow-right"
                size={15}
                color={themeContext.buttonDark}
              />
              <Text as="span" type="body 1" color="oxfordBlue">
                1.00
              </Text>
            </Center>
          )}
          <Text as="span" type="body 1" color="oxfordBlue">
            {'Liquidation at < 1.00'}
          </Text>
        </StackLayout>
      ),
      alignText: 'right',
    },
  }

  return (
    <Modal {...args} isOpen={true}>
      <StackLayout gap={5}>
        <StackLayout>
          <Table
            columns={tableColumns}
            data={tableData}
            titleComponent={<Title />}
          />
          <Table columns={transactionColumns} data={transactionData} />
        </StackLayout>

        <BoxLayout gap={1.875}>
          <StackLayout gap={1}>
            <Button
              className="u-full-width"
              appearance="dark"
              size="large"
              variant="large"
            >
              Repay asset
            </Button>
          </StackLayout>
        </BoxLayout>
      </StackLayout>
    </Modal>
  )
}

const Center = styled(ColumnLayout)`
  align-items: center;
  justify-content: flex-end;
`
