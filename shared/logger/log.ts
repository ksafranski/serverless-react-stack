import moment from 'moment'
export default (level: string, payload: any): void => {
  console[level](moment().format('LLL'), payload)
}
