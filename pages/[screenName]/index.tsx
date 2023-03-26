import { ServiceLayout } from '@/components/common/ServiceLayout'
import { useAuth } from '@/context/auth_user.context'
import { InMemberInfo } from '@/models/member/in_member.info'
import { MessageProps } from '@/models/message'
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { TriangleDownIcon } from '@chakra-ui/icons'
import { GetServerSideProps, NextPage } from 'next'
import { ChangeEvent, useState } from 'react'
import ResizeTextarea from 'react-textarea-autosize'
import axios from 'axios'
import MessageItem from '@/components/MessageItem'
import { InMessage } from '@/models/message/in_message'
import { useQuery } from 'react-query'
import { AxiosResponse } from 'axios'
import api from '../../services/api'
interface Props {
  userInfo: InMemberInfo | null
  screenName: string
}

const UserHomePage: NextPage<Props> = function ({ userInfo, screenName }) {
  const [message, setMessage] = useState<string>('')
  const [messageList, setMessageList] = useState<InMessage[]>([])
  const [isAnonymous, setAnonymous] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [msgListFetchTrigger, setMsgListFetchTrigger] = useState<boolean>(false)
  const { authUser } = useAuth()
  const toast = useToast()

  const handleChangeMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    if (value) {
      const lineCount = (e.target.value.match(/[^\n]*\n[^\n]*/gi)?.length || 1) + 1
      if (lineCount > 7) {
        toast({ title: '최대 7줄까지만 입력 가능합니다.', position: 'top-right' })
        return false
      }
    }
    setMessage(value)
  }

  const handleToggleAnonymous = () => {
    if (authUser === null) {
      toast({ title: '로그인이 필요합니다', position: 'top-right' })
      return
    }
    setAnonymous((prev) => !prev)
  }

  const fetchMessageinfo = async ({ uid, messageId }: { uid: string; messageId: string }) => {
    try {
      const res = await fetch(`/api/messages.info?uid=${uid}&messageId=${messageId}`)
      if (res.status === 200) {
        const data: InMessage = await res.json()
        setMessageList((prev) => {
          const findIndex = prev.findIndex((fv) => fv.id === data.id)
          if (findIndex >= 0) {
            const fetchInfo = [...prev]
            fetchInfo[findIndex] = data
            return fetchInfo
          }
          return prev
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const messageListQueryKey = ['messageList', userInfo?.uid, page, msgListFetchTrigger]
  useQuery(
    messageListQueryKey,
    async () =>
      await axios.get<{
        totalElements: number
        totalPages: number
        page: number
        size: number
        content: InMessage[]
      }>(`/api/messages.list?uid=${userInfo?.uid}&page=${page}&size=10`),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setTotalPages(data.data.totalPages)
        if (page === 1) {
          setMessageList(data.data.content)
          return
        }
        setMessageList((prev) => [...prev, ...data.data.content])
      },
    },
  )

  if (userInfo === null) {
    return <p>사용자를 찾을 수 없습니다.</p>
  }

  const postMessage = async ({ uid, message, author }: MessageProps) => {
    if (message.length < 0) {
      return {
        result: false,
        message: '메시지를 입력해주세요',
      }
    }
    try {
      await fetch('/api/messages.add', {
        method: 'post',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          message,
          author,
        }),
      })
      return {
        result: true,
      }
    } catch (err) {
      console.error(err)
      return {
        result: false,
        message: '메세지 등록 실패',
      }
    }
  }

  const handleSubmitMessage = async () => {
    const payload: MessageProps = {
      message,
      uid: userInfo.uid,
    }
    if (isAnonymous === false) {
      payload.author = {
        photoURL: authUser?.photoURL ?? '',
        displayName: authUser?.displayName ?? '',
      }
    }
    const messageResp = await postMessage(payload)
    if (messageResp.result === false) {
      toast({ title: '메세지 등록 실패', position: 'top-right' })
    }
    setMessage('')
    setPage(1)
    setTimeout(() => {
      setMsgListFetchTrigger((prev) => !prev)
    }, 50)
  }

  const handleNextPage = () => {
    setPage((prev) => prev + 1)
  }

  const isOwner = authUser !== null && authUser.uid === userInfo.uid

  return (
    <ServiceLayout title={`${userInfo?.displayName}의 홈`} minH="100vh" backgroundColor="gray.50">
      <Box maxW="md" mx="auto" pt="6">
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Flex p="6">
            <Avatar size="lg" src={userInfo.photoURL ?? 'https://bit.ly/broken-link'} mr="2" />
            <Flex direction="column" justify="center">
              <Text>{userInfo.displayName}</Text>
              <Text> {userInfo.email}</Text>
            </Flex>
          </Flex>
        </Box>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Flex align="center" p="2">
            <Avatar
              size="xs"
              src={isAnonymous ? 'https://bit.ly/broken-link' : authUser?.photoURL ?? 'https://bit.ly/broken-link'}
              mr="2"
            />
            <Textarea
              bg="gray.100"
              border="none"
              placeholder="무엇이든 물어보세요"
              resize="none"
              minH="unset"
              overflow="hidden"
              fontSize="sx"
              mr="2"
              maxRows={7}
              as={ResizeTextarea}
              value={message}
              onChange={handleChangeMessage}
            />
            <Button
              isDisabled={message.length === 0}
              bgColor="#FFB86C"
              colorScheme="yellow"
              variant="solid"
              color="white"
              onClick={handleSubmitMessage}
            >
              등록
            </Button>
          </Flex>
          <FormControl display="flex" alignItems="center" mt="1" ml="2" pb="2">
            <Switch
              size="sm"
              colorScheme="orange"
              id="anonymous"
              mr="1"
              isChecked={isAnonymous}
              onChange={handleToggleAnonymous}
            />
            <FormLabel htmlFor="anonymous" mb="0" fontSize="xx-small">
              Anonymous
            </FormLabel>
          </FormControl>
        </Box>
        <VStack spacing="12px" mt="6">
          {messageList &&
            messageList.map((message) => (
              <MessageItem
                key={`message-item-${userInfo.uid}-${message.id}`}
                item={message}
                uid={userInfo.uid}
                displayName={userInfo.displayName ?? ''}
                photoURL={userInfo.photoURL ?? 'https://bit.ly/broken-link'}
                isOwner={isOwner}
                screenName={screenName}
                onSendComplete={() => fetchMessageinfo({ uid: userInfo.uid, messageId: message.id })}
              />
            ))}
        </VStack>
        {totalPages > page && (
          <Button width="full" mt="2" fontSize="sm" leftIcon={<TriangleDownIcon />} onClick={handleNextPage}>
            더보기
          </Button>
        )}
      </Box>
    </ServiceLayout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const { screenName } = query
  if (screenName === undefined) {
    return {
      props: {
        userInfo: null,
        screenName: '',
      },
    }
  }
  try {
    const screenNameToStr = Array.isArray(screenName) ? screenName[0] : screenName
    const userInfoRes: AxiosResponse<InMemberInfo> = await api.getMemberInfo(screenNameToStr)
    return {
      props: {
        userInfo: userInfoRes.data,
        screenName: screenNameToStr,
      },
    }
  } catch (err) {
    return {
      props: {
        userInfo: null,
        screenName: '',
      },
    }
  }
}

export default UserHomePage
