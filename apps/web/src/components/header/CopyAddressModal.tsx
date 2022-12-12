import React from 'react'
import { BoxLayout, Modal, Text } from '@bloxifi/ui'
import { useTranslation } from 'react-i18next'

interface Props {
  /**
   * Boolean value that defines if modal is open or closed
   */
  isOpen?: boolean
  /**
   * Function that defines closing of modal
   */
  onClose?: () => void
}

export const CopyAddressModal = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation()

  return (
    <Modal isOpen={isOpen} onClose={onClose} disableCloseButton={false}>
      <BoxLayout gap={5}>
        <Text
          color="oxfordBlue"
          type="heading 2"
          as="span"
          data-cy="copy address modal title"
        >
          {t('header.walletAddressCopyTitle')}
        </Text>
      </BoxLayout>
    </Modal>
  )
}
