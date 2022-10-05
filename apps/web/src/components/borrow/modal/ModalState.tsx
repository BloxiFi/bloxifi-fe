import React from 'react'
import { BoxLayout, CenterLayout, Icon, Loader, Text } from '@bloxifi/ui'
import { useTranslation } from 'react-i18next'

interface ModalStateProps {
  loading: boolean
  error: boolean
  success: boolean
  messages?: { error?: string; success?: string }
}

/**
 *  Component that returns appropriate content depending on modal state: loading, error or success
 */
export const ModalState = ({
  loading,
  error,
  success,
  messages,
}: ModalStateProps) => {
  const { t } = useTranslation()

  return (
    <CenterLayout>
      <BoxLayout gap={6} />
      {loading ? (
        <Loader loaderSize={150} />
      ) : error ? (
        <>
          <Icon name="error" size={150} />
          <Text align="center" type="body 5">
            {messages.error
              ? messages.error
              : t('global.notifications.transaction_failed')}
          </Text>
        </>
      ) : (
        success && (
          <>
            <Icon name="success" size={150} />
            <Text align="center" type="body 5">
              {messages.success
                ? messages.success
                : t('global.notifications.success')}
            </Text>
          </>
        )
      )}
      <BoxLayout gap={6} />
    </CenterLayout>
  )
}
