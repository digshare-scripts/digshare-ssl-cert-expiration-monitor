import {Script} from '@digshare/script';

interface Payload {}

interface Storage {}

const script: Script<Payload, Storage> = async function (_payload, _context) {
  return {
    content: '这是一条价值不菲的消息！',
  };
};

export default script;
