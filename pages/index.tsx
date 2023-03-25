import { useRouter } from 'next/router'
import { Box, Button, Center, Flex, Heading } from '@chakra-ui/react'
import { NextPage } from 'next'
import { ServiceLayout } from '@/components/common/ServiceLayout'
import { GoogleLoginBtn } from '@/components/common/GoogleLoginBtn'
import { useAuth } from '@/context/auth_user.context'

const IndexPage: NextPage = function () {
  const router = useRouter()
  const { signInWithGoogle, authUser } = useAuth()
  return (
    <ServiceLayout title="danwoon" backgroundColor="gray.50">
      <Box maxW="md" mx="auto" pt="10">
        <img src="/main_logo.svg" alt="메인 로고" />
        <Flex justify="center">
          <Heading>#Dansoon</Heading>
        </Flex>
      </Box>
      <Center mt="20">
        {/* {authUser?.uid ? (
          <Button
            size="lg"
            width="300px"
            maxW="md"
            borderRadius="full"
            bgColor="#4285f4"
            color="white"
            colorScheme="blue"
            onClick={() => {
              const path = authUser.email?.split('@')[0]
              router.push(path ?? '')
            }}
          >
            시작하기
          </Button>
        ) : ( */}
        <GoogleLoginBtn onClick={signInWithGoogle} />
        {/* )} */}
      </Center>
    </ServiceLayout>
  )
}

export default IndexPage
