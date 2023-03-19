import { Box, Center, Flex, Heading } from '@chakra-ui/react'
import { NextPage } from 'next'
import { ServiceLayout } from '@/components/common/ServiceLayout'
import { GoogleLoginBtn } from '@/components/common/GoogleLoginBtn'
import { useAuth } from '@/context/auth_user.context'

const IndexPage: NextPage = function () {
  const { signInWithGoogle, authUser } = useAuth()
  console.info(authUser)
  return (
    <ServiceLayout title="danwoon" backgroundColor="gray.50">
      <Box maxW="md" mx="auto" pt="10">
        <img src="/main_logo.svg" alt="메인 로고" />
        <Flex justify="center">
          <Heading>#Dansoon</Heading>
        </Flex>
      </Box>
      <Center mt="20">
        <GoogleLoginBtn onClick={signInWithGoogle} />
      </Center>
    </ServiceLayout>
  )
}

export default IndexPage
