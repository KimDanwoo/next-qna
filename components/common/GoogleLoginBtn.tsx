import { Box, Button } from '@chakra-ui/react'

interface Props {
  onClick: () => void
}

export const GoogleLoginBtn = function ({ onClick }: Props) {
  return (
    <Box>
      <Button
        size="lg"
        width="full"
        maxW="md"
        borderRadius="full"
        bgColor="#4285f4"
        color="white"
        colorScheme="blue"
        leftIcon={<img src="/google.svg" alt="구글 로고" style={{ backgroundColor: 'white', padding: '8px' }} />}
        onClick={onClick}
      >
        Google 계정으로 시작하기
      </Button>
    </Box>
  )
}

//  default GoogleLoginBtn
