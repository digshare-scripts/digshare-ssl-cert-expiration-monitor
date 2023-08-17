import {script} from '@digshare/script';

import {getCert} from './@cert';

const DAY_IN_MS = 24 * 3600 * 1000;

const EXPIRATION_WARN_THRESHOLD = 7 * DAY_IN_MS;

const COMMON_NAMES = [
  'dingshao.cn',
  // www 和其他二级域名都是同一个证书，同一个 nginx 前端，所以只检查这个就行了。
  'www.dingshao.cn',
];

export default script<{}>(async () => {
  interface Problem {
    emoji: string;
    commonName: string;
    description: string;
  }

  const problems: Problem[] = [];

  const now = Date.now();

  for (const commonName of COMMON_NAMES) {
    const cert = await getCert(commonName);

    if (cert) {
      const duration = new Date(cert.valid_to).getTime() - now;

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
    message: `\
发现了 ${problems.length} 个证书问题，请及时处理：

${problems
  .map(
    problem => `${problem.emoji} ${problem.commonName}\n${problem.description}`,
  )
  .join('\n\n')}`,
  };
});
