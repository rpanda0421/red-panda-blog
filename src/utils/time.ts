export function formalizeDate(date: Date, isEnglish: boolean, style: ('short' | 'long') = 'short') {
  const local = isEnglish ? 'en-US' : 'zh-Hans-CN';
  return new Intl.DateTimeFormat(local, {
    dateStyle: style,
    timeZone: 'Asia/Shanghai',
  }).format(date)
}