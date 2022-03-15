import {Script} from '@digshare/script';
import {getCert} from './@cert';

const DAY_IN_MS = 24 * 3600 * 1000;

const EXPIRATION_WARN_THRESHOLD = 7 * DAY_IN_MS;

const COMMON_NAMES = [
  'dingshao.cn',
  // www 和其他二级域名都是同一个证书，同一个 nginx 前端，所以只检查这个就行了。
  'www.dingshao.cn',
];

interface Payload {}

interface Storage {}

const script: Script<Payload, Storage> = async function (_payload, _context) {
  interface Problem {
    emoji: string;
    commonName: string;
    description: string;
  }

  let problems: Problem[] = [];

  let now = Date.now();

  for (let commonName of COMMON_NAMES) {
    let cert = await getCert(commonName);

    if (cert) {
      let duration = new Date(cert.valid_to).getTime() - now;

      if (duration < EXPIRATION_WARN_THRESHOLD) {
        problems.push({
          emoji: '⚠️',
          commonName,
          description: `证书将在 ${Math.ceil(duration / DAY_IN_MS)} 天内到期`,
        });
      }
    } else {
      problems.push({
        emoji: '❌',
        commonName,
        description: '无效的证书',
      });
    }
  }

  if (problems.length === 0) {
    console.info('没有发现证书问题');
    return;
  }

  return {
    content: `\
发现了 ${problems.length} 个证书问题，请及时处理：

${problems
  .map(
    problem => `${problem.emoji} ${problem.commonName}\n${problem.description}`,
  )
  .join('\n\n')}`,
  };
};

export default script;
