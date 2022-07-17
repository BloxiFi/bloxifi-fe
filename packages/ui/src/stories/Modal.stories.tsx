import { Meta } from '@storybook/react'
import React, { Fragment, useState } from 'react'

import { Button } from '..'
import { ContentLoader } from '../ContentLoader'
import { StackLayout } from '../Layouts'
import { Modal } from '../Modal'
import { Text } from '../Text'

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
        <StackLayout gap={1.5}>
          <Text type="heading 2">
            <ContentLoader />
          </Text>
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
      </Modal>
    </Fragment>
  )
}
