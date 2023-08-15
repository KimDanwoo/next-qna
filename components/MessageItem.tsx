import FirebaseClient from '@/models/firebase_client'
import { InMessage } from '@/models/message/in_message'
import convertDateToString from '@/utils/convert_date_to_string'
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/router'
import ResizeTextArea from 'react-textarea-autosize'
import MoreBtnItem from './common/MoreBtnIcon'

interface Props {
  uid: string
  displayName: string
  photoURL?: string
  isOwner: boolean
  item: InMessage
  screenName: string
  onSendComplete: () => void
  onDeleteMessage: () => void
}

const MessageItem = ({
  uid,
  displayName,
  photoURL,
  item,
  isOwner,
  onSendComplete,
  screenName,
  onDeleteMessage,
}: Props) => {
  const router = useRouter()
  const toast = useToast()
  const [reply, setReply] = useState<string>('')
  const haveReply = item.reply !== undefined
  const handleChangeReply = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    setReply(value)
  }

  const postReply = async () => {
    const token = await FirebaseClient.getInstance().Auth.currentUser?.getIdToken()
    if (token === undefined) {
      toast({
        title: '로그인한 사용자만 사용할 수 있는 메뉴입니다.',
      })
    }
    try {
      const protocol = process.env.PROTOCOL || 'http'
      const host = process.env.HOST || 'localhost'
      const port = process.env.PORT || '3000'
      const baseUrl = `${protocol}://${host}:${port}`
      const res = await fetch(`${baseUrl}/api/messages.add.reply?uid=${uid}&messageId=${item.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token ?? '' },
        body: JSON.stringify({
          reply,
        }),
      })
      if (res.status < 300) {
        onSendComplete()
        setReply('')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const updateMessage = async ({ deny }: { deny: boolean }) => {
    const token = await FirebaseClient.getInstance().Auth.currentUser?.getIdToken()
    if (token === undefined) {
      toast({
        title: '로그인한 사용자만 사용할 수 있는 메뉴입니다.',
      })
    }
    const res = await fetch('/api/messages.deny', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', authorization: token ?? '' },
      body: JSON.stringify({
        uid,
        messageId: item.id,
        deny,
      }),
    })
    if (res.status < 300) {
      onSendComplete()
    }
  }
  // const deleteMessage = async () => {
  //   const token = await FirebaseClient.getInstance().Auth.currentUser?.getIdToken()
  //   if (token === undefined) {
  //     toast({
  //       title: '로그인한 사용자만 사용할 수 있는 메뉴입니다.',
  //     })
  //   }
  //   await fetch('/api/messages.delete', {
  //     method: 'DELETE',
  //     headers: { 'Content-Type': 'application/json', authorization: token ?? '' },
  //     body: JSON.stringify({
  //       uid,
  //       messageId: item.id,
  //     }),
  //   })
  //   onDeleteMessage()
  // }

  const isDeny = item.deny !== undefined ? item.deny === true : false

  return (
    <Box borderRadius="md" width="full" bg="white" boxShadow="md">
      <Box>
        <Flex pt="2" px="2" alignItems="center">
          <Avatar
            size="xs"
            src={item.author ? item.author.photoURL ?? 'https://bit.ly/broken-link' : 'https://bit.ly/broken-link'}
          />
          <Text fontSize="xx-small" ml="1">
            {item.author ? item.author?.displayName : 'anonymous'}
          </Text>
          <Text whiteSpace="pre-line" fontSize="xx-small" color="gray.500" ml="2">
            {convertDateToString(item.createAt)}
          </Text>
          <Spacer />
          {isOwner && (
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<MoreBtnItem />}
                width="24px"
                height="24px"
                borderRadius="full"
                variant="Link"
                size="sx"
              />
              <MenuList>
                <MenuItem onClick={() => updateMessage({ deny: !item.deny !== undefined ? !item.deny : true })}>
                  {isDeny ? '비공개처리 해제' : '비공개처리'}
                </MenuItem>
                {!router.asPath.includes(item.id) && (
                  <MenuItem onClick={() => router.push(`/${screenName}/${item.id}`)}>상세보기</MenuItem>
                )}
                {/* {isOwner && <MenuItem onClick={deleteMessage}>메세지 삭제</MenuItem>} */}
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Box>
      <Box p="2">
        <Box borderRadius="md" borderWidth="1px" p="2">
          <Text whiteSpace="pre-line" fontSize="sm">
            {item.message}
          </Text>
        </Box>
        {haveReply && (
          <Box pt={2}>
            <Box display="flex" mt="2">
              <Box pt="2">
                <Avatar size="xs" src={photoURL} mr="2" />
              </Box>
              <Box borderRadius="md" p="2" width="full" bg="gray.100">
                <Flex alignItems="center">
                  <Text fontSize="xs">{displayName}</Text>
                  <Text whiteSpace="pre-line" fontSize="xs" color="gray" ml="2">
                    {convertDateToString(item.replyAt!)}
                  </Text>
                </Flex>
                <Text whiteSpace="pre-line" fontSize="sx">
                  {item.reply}
                </Text>
              </Box>
            </Box>
          </Box>
        )}
        {haveReply === false && isOwner && (
          <Box pt="2">
            <Divider />
            <Box display="flex" mt="2">
              <Box pt="2">
                <Avatar size="xs" src={photoURL} mr="2" />
              </Box>
              <Box borderRadius="md" width="full" bg="gray.100" mr="2">
                <Textarea
                  border="none"
                  boxShadow="none !important"
                  resize="none"
                  minH="unset"
                  overflow="hidden"
                  fontSize="xs"
                  placeholder="댓글을 입력하세요"
                  as={ResizeTextArea}
                  value={reply}
                  onChange={handleChangeReply}
                />
              </Box>
              <Button
                isDisabled={reply.length === 0}
                colorScheme="pink"
                bgColor="#FF75B5"
                size="sm"
                onClick={postReply}
              >
                등록
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default MessageItem
