import moment from "moment";

export const momentWithLocale = <T>(locale: string, fn: () => T): T => {
  const temp = moment.locale();
  moment.locale(locale);
  const result: T = fn();
  moment.locale(temp);
  return result;
}