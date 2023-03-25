import PrintText from '@/components/print_text'
import { Box } from '@chakra-ui/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

const OpenGraphImgPage: NextPage = () => {
  const { query } = useRouter()
  const text = query.text ?? ''
  const printText = Array.isArray(text) ? text[0] : text
  return (
    <Box width="full" bgColor="white" p="25px">
      <PrintText printText={printText} />
      <img src="/screenshot_bg.svg" alt="framle" />
    </Box>
  )
}

export default OpenGraphImgPage
