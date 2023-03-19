import { InMessage } from '@/models/message/in_message'
import convertDateToString from '@/utils/convert_date_to_string'
import { Avatar, Box, Button, Divider, Flex, Text, Textarea } from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'
import ResizeTextArea from 'react-textarea-autosize'

interface Props {
  uid: string
  displayName: string
  photoURL?: string
  isOwner: boolean
  item: InMessage
  onSendComplete: () => void
}

const MessageItem = ({ uid, displayName, photoURL, item, isOwner, onSendComplete }: Props) => {
  const [reply, setReply] = useState<string>('')
  const haveReply = item.reply !== undefined
  const handleChangeReply = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    setReply(value)
  }
  const postReply = async () => {
    const res = await fetch('/api/messages.add.reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid,
        messageId: item.id,
        reply,
      }),
    })
    if (res.status < 300) {
      onSendComplete()
      setReply('')
    }
  }
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
            <Divider></Divider>
            <Box display="flex" mt="2">
              <Box pt="2">
                <Avatar size="xs" src={photoURL} mr="2"></Avatar>
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
