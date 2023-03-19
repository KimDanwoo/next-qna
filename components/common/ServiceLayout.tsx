import { Box, BoxProps } from '@chakra-ui/react'
import Head from 'next/head'
import AppHeader from './AppHeader'

interface Props {
  title: string
  children: React.ReactNode
}
export const ServiceLayout: React.FC<Props & BoxProps> = function ({
  title = 'dansoon',
  children,
  ...boxProps
}: Props) {
  return (
    <Box {...boxProps}>
      <Head>
        <title>{title}</title>
      </Head>
      <AppHeader />
      {children}
    </Box>
  )
}
