import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatDateTime = (date: string) => {
  const formattedDate = dayjs(date).format('MMMM D, YYYY h:mm A');
  const duration = dayjs().diff(dayjs(date), 'minute');

  if (duration < 1440) {
    return dayjs(date).fromNow();
  }

  return formattedDate;
};

export const formatStandardDateTime = (date: string) => {
  return dayjs(date).format('MMMM D, YYYY h:mm A');
};

export const formatStandardDate = (date: string) => {
  return dayjs(date).format('MMMM D, YYYY');
};
