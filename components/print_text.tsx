import { Text } from '@chakra-ui/react'

const PrintText = ({ printText }: { printText: string }) => {
  const textCount = printText.length
  const usedText = textCount > 200 ? `${printText.substring(0, 199)}...` : printText
  return (
    <Text whiteSpace="pre-line" p="4" position="absolute" fontSize="32pt" fontFamily="Pretendard">
      {usedText}
    </Text>
  )
}

export default PrintText
