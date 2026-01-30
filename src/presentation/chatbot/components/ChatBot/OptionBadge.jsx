import { Chip } from '@mui/material';
import { useChatStore } from '../../../../services/genieBot/client/src/store/chatStore';
import { m } from 'framer-motion';
import { TURBO_TRACE_DEFAULT_MEMORY_LIMIT } from 'next/dist/shared/lib/constants';

const OptionBadge = ({ label, nextMessageId }) => {
  const { scenario, addMessage, setOptions, setCurrentMessageId } = useChatStore();

  const handleClick = () => {
    // 사용자 메시지 추가
    addMessage({ sender: 'user', text: label });

    // nextMessageId에 해당하는 메시지 찾기
    const nextMsg = scenario.messages.find(m => m.id === nextMessageId);
    if (nextMsg) {
      setTimeout(() => {
        addMessage({ sender: nextMsg.sender, text: nextMsg.text });
        setOptions(nextMsg.options || []);
        setCurrentMessageId(nextMsg.id);
      }, 500); // 봇 답변 약간 딜레이
    } else {
      setOptions([]);
    }
  };

  return (
    <Chip
      label={label}
      clickable
      color="primary"
      onClick={handleClick}
      sx={{ fontWeight: 500, fontSize: 16, borderRadius: 2, px: 2 }}
    />
  );
};

export default OptionBadge;