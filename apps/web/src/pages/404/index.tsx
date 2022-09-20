import {
  BoxLayout,
  Button,
  CardLayout,
  CenterLayout,
  GridLayout,
  PageLayout,
  Text,
} from '@bloxifi/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const PageNotFound = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <PageLayout.Section>
      <GridLayout.Column span={12}>
        <CardLayout>
          <BoxLayout gap={8}>
            <CenterLayout>
              <Text as="span" color="oxfordBlue" type="heading 2">
                {t('pageNotFound.title')}
              </Text>
              <Text color="oxfordBlue" type="body 5">
                {t('pageNotFound.description')}
              </Text>

              <Button
                appearance="primary"
                size="medium"
                variant="medium"
                onClick={() => navigate('/')}
              >
                {t('pageNotFound.goToDashboardButton')}
              </Button>
            </CenterLayout>
          </BoxLayout>
        </CardLayout>
      </GridLayout.Column>
    </PageLayout.Section>
  )
}
export default PageNotFound
