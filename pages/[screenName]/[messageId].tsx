import { ServiceLayout } from '@/components/common/ServiceLayout'
import { useAuth } from '@/context/auth_user.context'
import { InMemberInfo } from '@/models/member/in_member.info'
import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react'
import { GetServerSideProps, NextPage } from 'next'
import { useState } from 'react'
import axios from 'axios'
import MessageItem from '@/components/MessageItem'
import { InMessage } from '@/models/message/in_message'
import { AxiosResponse } from 'axios'
import Link from 'next/link'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import Head from 'next/head'

interface Props {
  userInfo: InMemberInfo | null
  messageData: InMessage | null
  screenName: string
  baseUrl: string
}

const MessagePage: NextPage<Props> = function ({ userInfo, messageData: initMsgData, screenName, baseUrl }) {
  const [messageData, setMessageData] = useState<null | InMessage>(initMsgData)
  const { authUser } = useAuth()
  const fetchMessageinfo = async ({ uid, messageId }: { uid: string; messageId: string }) => {
    try {
      const res = await fetch(`/api/messages.info?uid=${uid}&messageId=${messageId}`)
      if (res.status === 200) {
        const data: InMessage = await res.json()
        setMessageData(data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (userInfo === null) {
    return <p>사용자를 찾을 수 없습니다..</p>
  }

  if (messageData === null) {
    return <p>메세지를 찾을 수 없습니다.</p>
  }

  const isOwner = authUser !== null && authUser.uid === userInfo.uid
  const metaImgUrl = `${baseUrl}/open-graph-img?text=${encodeURIComponent(messageData.message)}`
  const thumbnailImgUrl = `${baseUrl}/api/thumbnail?url=${metaImgUrl}`
  return (
    <>
      <Head>
        <meta property="og:image" content={thumbnailImgUrl} />
        <meta name="twitter:image" content="summary_large_image" />
        <meta name="twitter:site" content="dansoon" />
        <meta name="twitter:title" content={messageData.message} />
        <meta name="twitter:image" content={thumbnailImgUrl} />
      </Head>
      <ServiceLayout title={`${userInfo?.displayName}의 홈`} minH="100vh" backgroundColor="gray.50">
        <Box maxW="md" mx="auto" pt="6">
          <Link href={`/${screenName}`}>
            <Button leftIcon={<ChevronLeftIcon />} mb="2" fontSize="sm">
              {screenName} 홈으로
            </Button>
          </Link>
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
            <Flex p="6">
              <Avatar size="lg" src={userInfo.photoURL ?? 'https://bit.ly/broken-link'} mr="2" />
              <Flex direction="column" justify="center">
                <Text>{userInfo.displayName}</Text>
                <Text> {userInfo.email}</Text>
              </Flex>
            </Flex>
          </Box>
          <MessageItem
            item={messageData}
            uid={userInfo.uid}
            displayName={userInfo.displayName ?? ''}
            photoURL={userInfo.photoURL ?? 'https://bit.ly/broken-link'}
            isOwner={isOwner}
            screenName={screenName}
            onSendComplete={() => fetchMessageinfo({ uid: userInfo.uid, messageId: messageData.id })}
            onDeleteMessage={() => {
              const path = authUser?.email?.split('@')[0]
              window.location.href = `/${path}`
            }}
          />
        </Box>
      </ServiceLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const { screenName, messageId } = query
  if (screenName === undefined || messageId === undefined) {
    return {
      props: {
        userInfo: null,
        messageData: null,
        screenName: '',
        baseUrl: '',
      },
    }
  }
  try {
    const protocol = process.env.PROTOCOL || 'http'
    const host = process.env.HOST || 'localhost'
    const port = process.env.PORT || '3000'
    const baseUrl = `${protocol}://${host}:${port}`
    const userInfoRes: AxiosResponse<InMemberInfo> = await axios(`${baseUrl}/api/user.info/${screenName}`)
    const screenNameToStr = Array.isArray(screenName) ? screenName[0] : screenName
    if (userInfoRes.status !== 200 || userInfoRes.data === undefined || userInfoRes.data.uid === undefined) {
      return {
        props: {
          userInfo: null,
          messageData: null,
          screenName: screenNameToStr,
          baseUrl: '',
        },
      }
    }
    const messageInfoRes: AxiosResponse<InMessage> = await axios(
      `${baseUrl}/api/messages.info?uid=${userInfoRes.data.uid}&messageId=${messageId}`,
    )
    return {
      props: {
        userInfo: userInfoRes.data,
        messageData: messageInfoRes.status !== 200 || messageInfoRes.data === undefined ? null : messageInfoRes.data,
        screenName: screenNameToStr,
        baseUrl,
      },
    }
  } catch (err) {
    return {
      props: {
        userInfo: null,
        messageData: null,
        screenName: '',
        baseUrl: '',
      },
    }
  }
}

export default MessagePage
